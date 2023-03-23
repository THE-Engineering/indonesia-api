/**
 * @typedef {import('@aws-sdk/client-sqs').Message} Message
 */

/**
 * S3
 *
 * @typedef {Object} S3
 * @property {string} configurationId
 * @property {{key: string}} [object]
 */

/**
 * Generator to read a message
 *
 * @generator
 * @param {Message} message
 * @yields {S3}
 */
export default function * genS3From (message) {
  const {
    Body: body
  } = message

  const {
    Records: records = []
  } = JSON.parse(body)

  while (records.length) {
    const record = records.shift()

    if (record) {
      const {
        eventSource
      } = record

      if (eventSource === 'aws:s3') {
        const {
          eventName
        } = record

        if (eventName.startsWith('ObjectCreated') || eventName.startsWith('ObjectRemoved')) {
          const {
            s3
          } = record

          yield s3
        }
      }
    }
  }
}
