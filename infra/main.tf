terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "eu-west-1"
}

data "aws_caller_identity" "current" {}



resource "aws_s3_bucket" "source_data" {
  bucket = "indonesian-api-source"
}

resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.source_data.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_iam_policy_document" "send_message_on_bucket_change" {
  statement {
    sid    = "indonesian-api-queue-statement"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["s3.amazonaws.com"]
    }

    actions   = ["SQS:SendMessage"]
    resources = [aws_sqs_queue.file_change_queue.arn]

    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values   = [aws_s3_bucket.source_data.arn]
    }

    condition {
      test     = "ForAnyValue:StringEquals"
      variable = "aws:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }
  }
}

resource "aws_sqs_queue" "file_change_queue" {
  name                      = "indonesian-api-queue"
  receive_wait_time_seconds = 10
}

resource "aws_sqs_queue_policy" "queue_policy" {
  queue_url = aws_sqs_queue.file_change_queue.id
  policy    = data.aws_iam_policy_document.send_message_on_bucket_change.json
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.source_data.id

  queue {
    id            = "xlsx-created-event"
    queue_arn     = aws_sqs_queue.file_change_queue.arn
    events        = ["s3:ObjectCreated:*"]
    filter_suffix = ".xlsx"
  }

  queue {
    id            = "xlsx-removed-event"
    queue_arn     = aws_sqs_queue.file_change_queue.arn
    events        = ["s3:ObjectRemoved:*"]
    filter_suffix = ".xlsx"
  }

  queue {
    id            = "csv-created-event"
    queue_arn     = aws_sqs_queue.file_change_queue.arn
    events        = ["s3:ObjectCreated:*"]
    filter_suffix = ".csv"
  }

  queue {
    id            = "csv-removed-event"
    queue_arn     = aws_sqs_queue.file_change_queue.arn
    events        = ["s3:ObjectRemoved:*"]
    filter_suffix = ".csv"
  }
}


resource "aws_iam_user" "indonesian_api_user" {
  name = "indonesian_api_user"
}

resource "aws_iam_access_key" "access_key" {
  user = aws_iam_user.indonesian_api_user.name
}

data "aws_iam_policy_document" "api_user_access_policy" {
  statement {
    actions = [
      "s3:ListBucket"
    ]

    resources = [
      aws_s3_bucket.source_data.arn,
    ]
  }
  statement {
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject"
    ]

    resources = [
      "${aws_s3_bucket.source_data.arn}/*",
    ]
  }
  statement {
    actions = [
      "sqs:GetQueueUrl",
      "sqs:ReceiveMessage"
    ]

    resources = [
      aws_sqs_queue.file_change_queue.arn,
    ]
  }
}

resource "aws_iam_user_policy" "api_user_access_policy_assign" {
  name = "accces-s3-sqs"
  user = aws_iam_user.indonesian_api_user.name
  policy = data.aws_iam_policy_document.api_user_access_policy.json
}

output "access_key" {
  value = aws_iam_access_key.access_key.id
}

output "secret" {
  value = aws_iam_access_key.access_key.encrypted_secret
}
