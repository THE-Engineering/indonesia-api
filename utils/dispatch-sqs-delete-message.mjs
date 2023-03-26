/**
 * @module #utils/dispatch-sqs-delete-message
 *
 * @typedef {import('@aws-sdk/client-sqs').Message} Message
 */

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
 * @param {Message} - An SQS Message
 * @returns {Promise<void>} Resolves without a return value
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
