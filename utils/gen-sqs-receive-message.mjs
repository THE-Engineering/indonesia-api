/**
 * @typedef {import('@aws-sdk/client-sqs').SQSClient} SQSClient
 * @typedef {import('@aws-sdk/client-sqs').ReceiveMessageCommandOutput} ReceiveMessageCommandOutput
 */

import {
  SQSClient,
  ReceiveMessageCommand
} from '@aws-sdk/client-sqs'

import {
  AWS_REGION,
  AWS_QUEUE_URL
} from '#config'

/**
 * Interrogates the message to determine whether it has
 * a `Messages` array
 *
 * @param {ReceiveMessageCommandOutput} message
 * @returns {boolean}
 */
function hasMessages (commandOutput) {
  if (Reflect.has(commandOutput, 'Messages')) {
    return Boolean(Reflect.get(commandOutput, 'Messages'))
  }

  return false
}

/**
 * Generator to read from the SQS queue
 *
 * @generator
 * @yields {Promise<ReceiveMessageCommandOutput>}
 */
export default async function * genSQSReceiveMessage () {
  const client = new SQSClient({ region: AWS_REGION })

  /**
   *  Switch between long polling and short polling
   *  depending on whether messages have been
   *  received from the queue
   */
  let waitTimeSeconds = 20

  while (true) {
    const command = new ReceiveMessageCommand({
      QueueUrl: AWS_QUEUE_URL,
      WaitTimeSeconds: waitTimeSeconds,
      MaxNumberOfMessages: 1
    })

    const commandOutput = await client.send(command)
    if (hasMessages(commandOutput)) {
      /**
       *  Messages have been received from the queue
       *  so ensure short polling, and yield
       */
      waitTimeSeconds = 0

      yield commandOutput
    } else {
      /**
       *  No message has been received from the queue
       *  so ensure long polling
       */
      waitTimeSeconds = 20
    }
  }
}
