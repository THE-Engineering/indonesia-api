/**
 * @module #ingest/from-queue
 */

import PubSub from 'pubsub-js'

import genSQSReceiveMessage from '#utils/gen-sqs-receive-message'

/**
 * Initiates the generator iterator
 *
 * @returns {Promise<void>} Resolves without a return value
 */
export async function run () {
  for await (const { Messages: messages = [] } of genSQSReceiveMessage()) {
    messages
      .forEach((message) => {
        PubSub.publish('aws:sqs:message', message)
      })
  }
}

/**
 * Initiates the generator iterator initiator
 *
 * @returns {void} Without a return value
 */
export default function ingestFromQueue () {
  /**
   *  Initiate the generator iterator
   */
  setImmediate(async () => await run())
}
