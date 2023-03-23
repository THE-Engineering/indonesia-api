import {
  S3Client,
  GetObjectCommand
} from '@aws-sdk/client-s3'

import {
  getSignedUrl
} from '@aws-sdk/s3-request-presigner'

import {
  AWS_REGION,
  AWS_BUCKET_NAME
} from '#config'

/**
 * Gets the S3 signed url with the client for the command
 *
 * @param {S3Client} client
 * @param {GetObjectCommand} command
 * @returns {Promise<string>}
 */
export async function toSignedUrl (client, command) {
  return (
    await getSignedUrl(client, command, { expiresIn: 3600 })
  )
}

/**
 * Fetches the URL and resolves to a Blob
 *
 * @param {string} url - The S3 signed url
 * @returns {Promise<Blob>}
 */
export async function getBlobFromUrl (url) {
  const response = await fetch(url)

  return (
    await response.blob()
  )
}

/**
 * Transforms a Blob to a Buffer
 *
 * @param {Blob} blob
 * @returns {Promise<Buffer>}
 */
export async function fromBlobToBuffer (blob) {
  const arrayBuffer = await blob.arrayBuffer()

  return Buffer.from(arrayBuffer)
}

/**
 *  Gets the bucket object from S3 and resolves it to a Buffer
 *
 * @param {string} key
 * @returns {Promise<Buffer>}
 */
export async function getS3ObjectFor (key) {
  const client = new S3Client({ region: AWS_REGION })
  const command = new GetObjectCommand({ Bucket: AWS_BUCKET_NAME, Key: key })

  return (
    await fromBlobToBuffer(
      await getBlobFromUrl(
        await toSignedUrl(client, command)
      )
    )
  )
}
