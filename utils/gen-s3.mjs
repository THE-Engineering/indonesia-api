/**
 * @module #utils/gen-s3
 *
 * @typedef {import('@aws-sdk/client-sqs').Message} Message
 * @typedef {import('#utils/gen-s3').S3} S3
 */

/**
 * Generator to destructure a message
 *
 * @generator
 * @param {Message} - An SQS Message
 * @yields {S3} A description of an S3 bucket
 * @returns {void} Without a return value
 */
export default function * genS3 ({ Body: body }) {
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
