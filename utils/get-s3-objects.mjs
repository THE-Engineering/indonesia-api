/**
 * @typedef {import('@aws-sdk/client-s3/dist-types/commands/ListObjectsCommand').ListObjectsCommandOutput} ListObjectsCommandOutput
 */
import {
  S3Client,
  ListObjectsCommand
} from '@aws-sdk/client-s3'

import {
  AWS_REGION,
  AWS_BUCKET_NAME
} from '#config'

/**
 * @returns {Promise<ListObjectsCommandOutput>}
 */
export default async function getS3Objects () {
  const client = new S3Client({ region: AWS_REGION })
  const command = new ListObjectsCommand({ Bucket: AWS_BUCKET_NAME })

  return (
    await client.send(command)
  )
}
