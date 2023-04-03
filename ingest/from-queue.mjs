/**
 * @module #ingest/from-queue
 */

import PubSub from 'pubsub-js'

import dispatchSQSDeleteMessage from '#utils/dispatch-sqs-delete-message'
import genSQSReceiveMessage from '#utils/gen-sqs-receive-message'

/**
 *  Test events are put onto the queue by AWS
 */
PubSub.subscribe('aws:sqs:message', async (topic, message) => {
  if (isS3TestEvent(message)) await dispatchSQSDeleteMessage(message)
})

function isS3TestEvent ({ Body: body }) {
  const {
    Event: event
  } = JSON.parse(body)

  return (
    event === 's3:TestEvent'
  )
}
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
