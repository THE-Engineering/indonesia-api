/**
 * @typedef {import('@aws-sdk/client-sqs').Message} Message
 */

import PubSub from 'pubsub-js'

import {
  SQSClient,
  DeleteMessageCommand
} from '@aws-sdk/client-sqs'

import {
  AWS_REGION,
  AWS_QUEUE_URL
} from '#config'

import handleError from '#utils/handle-error'
import genSQSReceiveMessage from '#utils/gen-sqs-receive-message'

/**
 * Handle the message from SQS
 *
 * @param {Message}
 * @returns {Promise<void>}
 */
export async function sendSQSDeleteMessageCommand ({ ReceiptHandle: receiptHandle }) {
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

/**
 * Initiates the generator iterator
 *
 * @returns {Promise<void>}
 */
export async function run () {
  const client = new SQSClient({ region: AWS_REGION })

  for await (const { Messages: messages = [] } of genSQSReceiveMessage(client, AWS_QUEUE_URL)) {
    messages
      .forEach((message) => {
        PubSub.publish('aws:sqs:message', message)
      })
  }
}

export default function ingestFromQueue () {
  /**
   *  Initiate the generator iterator
   */
  setImmediate(async () => await run())
}
