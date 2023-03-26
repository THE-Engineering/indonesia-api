/**
 * @module #utils/gen-s3-object
 */

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
 * Gets the S3 signed URL with the client for the command
 *
 * @param {S3Client} client - An `S3Client` instance
 * @param {GetObjectCommand} command - The command for S3
 * @returns {Promise<string>} Resolves to the S3 signed URL
 */
async function toSignedUrl (client, command) {
  return (
    await getSignedUrl(client, command, { expiresIn: 3600 })
  )
}

/**
 * Fetches the URL and resolves to a Blob
 *
 * @param {string} url - The S3 signed URL
 * @returns {Promise<Blob>} Resolves to a Blob
 */
async function getBlobFromUrl (url) {
  const response = await fetch(url)

  return (
    await response.blob()
  )
}

/**
 * Transforms a Blob to a Buffer
 *
 * @param {Blob} blob - A Blob
 * @returns {Promise<Buffer>} Resolves to a Buffer
 */
async function fromBlobToBuffer (blob) {
  const arrayBuffer = await blob.arrayBuffer()

  return Buffer.from(arrayBuffer)
}

/**
 *  Gets the bucket object from S3 and resolves it to a Buffer
 *
 * @param {string} key - The S3 bucket object file name
 * @returns {Promise<Buffer>} Resolves to a Buffer
 */
export default async function getS3Object (key) {
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
