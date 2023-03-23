/**
 * @typedef {import('@aws-sdk/client-sqs').SQSClient} SQSClient
 * @typedef {import('@aws-sdk/client-sqs').ReceiveMessageCommandOutput} ReceiveMessageCommandOutput
 */

import {
  ReceiveMessageCommand
} from '@aws-sdk/client-sqs'

/**
 * Interrogates the message to determine whether it has
 * a `Messages` array
 *
 * @param {ReceiveMessageCommandOutput} message
 * @returns {boolean}
 */
function hasMessages (message) {
  if (Reflect.has(message, 'Messages')) {
    return Boolean(Reflect.get(message, 'Messages'))
  }

  return false
}

/**
 * Generator to read from the SQS queue
 *
 * @generator
 * @param {SQSClient} client
 * @param {string} queueUrl
 * @yields {ReceiveMessageCommandOutput}
 */
export default async function * genSQSMessage (client, queueUrl) {
  /**
   *  Switch between long polling and short polling
   *  depending on whether a message has been
   *  received from the queue
   */
  let waitTimeSeconds = 20

  while (true) {
    const command = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      WaitTimeSeconds: waitTimeSeconds,
      MaxNumberOfMessages: 1
    })

    const message = await client.send(command)
    if (hasMessages(message)) {
      /**
       *  A message has been received from the queue
       *  so ensure short polling, and yield
       */
      waitTimeSeconds = 0

      yield message
    } else {
      /**
       *  A message has not been received from the queue
       *  so ensure long polling
       */
      waitTimeSeconds = 20
    }
  }
}
