/**
 * @typedef {import('@aws-sdk/client-sqs').Message} Message
 */

import PubSub from 'pubsub-js'

import genSQSReceiveMessage from '#utils/gen-sqs-receive-message'

/**
 * Initiates the generator iterator
 *
 * @returns {Promise<void>}
 */
export async function run () {
  for await (const { Messages: messages = [] } of genSQSReceiveMessage()) {
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
