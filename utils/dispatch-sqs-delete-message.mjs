import {
  SQSClient,
  DeleteMessageCommand
} from '@aws-sdk/client-sqs'

import {
  AWS_REGION,
  AWS_QUEUE_URL
} from '#config'

import handleError from '#utils/handle-error'

/**
 * Handle the message from SQS
 *
 * @param {Message}
 * @returns {Promise<void>}
 */
export default async function dispatchSQSDeleteMessage ({ ReceiptHandle: receiptHandle }) {
  const client = new SQSClient({ region: AWS_REGION })

  try {
    const command = new DeleteMessageCommand({
      QueueUrl: AWS_QUEUE_URL,
      ReceiptHandle: receiptHandle
    })

    await client.send(command)
  } catch (e) {
    handleError(e)
  }
}
