import {
  SQSClient,
  DeleteMessageCommand,
  ReceiveMessageCommand
} from '@aws-sdk/client-sqs'
import {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand
} from '@aws-sdk/client-s3'
import {
  getSignedUrl
} from '@aws-sdk/s3-request-presigner'

import {
  dirname,
  join,
  resolve
} from 'node:path'

import {
  unlink,
  writeFile
} from 'node:fs/promises'

import glob from 'glob'

import chokidar from 'chokidar'

import {
  ensureDir
} from 'fs-extra'

import {
  deleteAsync as del
} from 'del'

import {
  SOURCE_DIRECTORY,
  TARGET_DIRECTORY
} from '#config'

import args from '#config/args'

import toJsonFilePath from '#utils/to-json-file-path'
import handleFilePathError from '#utils/handle-file-path-error'
import handleError from '#utils/handle-error'

import transformFromCsvToJson from './transform-from-csv-to-json.mjs'

const SOURCE_PATTERN = resolve(join(SOURCE_DIRECTORY, '*.csv'))

const TARGET_PATTERN = resolve(join(TARGET_DIRECTORY, '*.json'))

const AWS_REGION = args.get('AWS_REGION')

const AWS_BUCKET_NAME = args.get('AWS_BUCKET_NAME')

const AWS_QUEUE_URL = args.get('AWS_QUEUE_URL')

/**
 * When the source file is change the target file is changed
 *
 * @param {string} sourcePath - a CSV file
 * @returns {Promise<void>}
 */
async function handleSourcePathChange (sourcePath) {
  const targetPath = toJsonFilePath(sourcePath, TARGET_DIRECTORY)

  try {
    await ensureDir(dirname(targetPath))
    await transformFromCsvToJson(sourcePath, targetPath)
  } catch (e) {
    handleFilePathError(e)
  }
}

/**
 * When the source file is removed the target file is removed
 *
 * @param {string} sourcePath - a CSV file
 * @returns {Promise<void>}
 */
async function handleSourcePathRemove (sourcePath) {
  const targetPath = toJsonFilePath(sourcePath, TARGET_DIRECTORY)

  try {
    await ensureDir(dirname(targetPath))
    await unlink(targetPath)
  } catch (e) {
    handleFilePathError(e)
  }
}

/**
 * Generator to read from the SQS queue
 *
 * @generator
 * @param {S3Client} client
 * @param {string} queueUrl
 * @yields {{Messages: AWS.SQS.MessageList}}
 */
async function * genMessages (client, queueUrl) {
  /**
   *  Switch between long polling and short polling
   *  depending on whether a message has been
   *  received from the queue
   */
  let waitTimeSeconds = 20

  while (true) {
    const command = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      WaitTimeSeconds: waitTimeSeconds
    })

    const {
      Messages = null
    } = await client.send(command)

    if (Messages) {
      /**
       *  A message has been received from the queue
       *  so ensure short polling, and yield
       */
      waitTimeSeconds = 0

      yield {
        Messages
      }
    } else {
      /**
       *  A message has not been received from the queue
       *  so ensure long polling
       */
      waitTimeSeconds = 20
    }
  }
}

/**
 * Gets the S3 signed url with the client for the command
 *
 * @param {S3Client} client
 * @param {GetObjectCommand} command
 * @returns {Promise<string>}
 */
async function toSignedUrl (client, command) {
  return (
    await getSignedUrl(client, command, { expiresIn: 3600 })
  )
}

/**
 * Gets the bucket object from S3 and resolves it to a Blob
 *
 * @param {string} signedUrl
 * @returns {Promise<Blob>}
 */
async function getObjectBlob (signedUrl) {
  const response = await fetch(signedUrl)

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
async function fromBlobToBuffer (blob) {
  const arrayBuffer = await blob.arrayBuffer()

  return Buffer.from(arrayBuffer)
}

/**
 * Objects created in the S3 bucket are written to the file system
 *
 * @param {{bucket?: {name: string}, object?: {key: string}}} s3
 * @returns {Promise<void>}
 */
async function handleS3ObjectCreated (s3) {
  const {
    bucket: {
      name: bucketName
    } = {},
    object: {
      key: objectKey
    } = {}
  } = s3

  try {
    const client = new S3Client({ region: AWS_REGION })
    const command = new GetObjectCommand({ Bucket: bucketName, Key: objectKey })
    const buffer = (
      await fromBlobToBuffer(
        await getObjectBlob(
          await toSignedUrl(client, command)
        )
      )
    )

    const filePath = join(SOURCE_DIRECTORY, objectKey)

    await writeFile(filePath, buffer)
  } catch (e) {
    handleError(e)
  }
}

/**
 * Objects removed from the S3 bucket are unlinked from the file system
 *
 * @param {{bucket?: {name: string}, object?: {key: string}}} s3
 * @returns {Promise<void>}
 */
async function handleS3ObjectRemoved (s3 = {}) {
  const {
    object: {
      key: objectKey
    } = {}
  } = s3

  const filePath = join(SOURCE_DIRECTORY, objectKey)

  try {
    await unlink(filePath)
  } catch (e) {
    handleError(e)
  }
}

/**
 * Handles the generator iterator
 *
 * @returns {Promise<void>}
 */
async function readMessageQueue () {
  const client = new SQSClient({ region: AWS_REGION })

  for await (const { Messages: messages = [] } of genMessages(client, AWS_QUEUE_URL)) {
    while (messages.length) {
      const {
        ReceiptHandle: receiptHandle,
        Body: string
      } = messages.shift()

      const {
        Records: records = []
      } = JSON.parse(string)

      while (records.length) {
        const {
          eventName,
          s3 = {}
        } = records.shift()

        if (eventName.startsWith('ObjectCreated')) await handleS3ObjectCreated(s3)
        else {
          if (eventName.startsWith('ObjectRemoved')) await handleS3ObjectRemoved(s3)
        }
      }

      try {
        const command = new DeleteMessageCommand({
          QueueUrl: AWS_QUEUE_URL,
          ReceiptHandle: receiptHandle
        })

        await client.send(command)
      } catch (e) {
        handleError(e)
      }
    }
  }
}

/**
 * Syncronises the S3 bucket with the file system
 *
 * @returns {Promise<void>}
 */
async function syncSourceDirectoryWithS3 () {
  try {
    const client = new S3Client({ region: AWS_REGION })
    const command = new ListObjectsCommand({ Bucket: AWS_BUCKET_NAME })

    const {
      Contents: contents = []
    } = await client.send(command)

    while (contents.length) {
      const {
        Key: key
      } = contents.shift()

      const client = new S3Client({ region: AWS_REGION })
      const command = new GetObjectCommand({ Bucket: AWS_BUCKET_NAME, Key: key })
      const buffer = (
        await fromBlobToBuffer(
          await getObjectBlob(
            await toSignedUrl(client, command)
          )
        )
      )

      const filePath = join(SOURCE_DIRECTORY, key)

      await writeFile(filePath, buffer)
    }
  } catch (e) {
    handleError(e)
  }
}

/**
 * Transforms source files in CSV format to target files in JSON
 * format and watches for changes, returning the watcher to the
 * caller
 *
 * @returns {Promise<chokidar.FSWatcher>}
 */
export default async function ingest () {
  await ensureDir(SOURCE_DIRECTORY)
  await ensureDir(TARGET_DIRECTORY)

  await del(SOURCE_PATTERN)
  await del(TARGET_PATTERN)

  console.log('Ingesting data ...')

  await syncSourceDirectoryWithS3()

  /**
   *  We could perform the transformation process using
   *
   *     chokidar
   *        .watch(SOURCE_PATTERN, { persistent: true })
   *        .on('add', handleSourcePathChange)
   *
   *  but, in that case, `ingest` is able to return without resolving
   *  any of the transformations invoked in `handleSourcePathChange`
   *  and Express can start serving routes, which will generate a 404
   */

  const filePathList = await glob(SOURCE_PATTERN)
  while (filePathList.length) {
    const filePath = filePathList.shift()
    await handleSourcePathChange(filePath)
  }

  console.log('Ingesting data complete.')

  setImmediate(async () => await readMessageQueue())

  /**
   *  With all transformation now complete it should be impossible for
   *  Express to generate a 404 provided all of source CSVs have
   *  transformed to JSON successfully, and unless any of those source
   *  CSVs change while the server is running:
   *
   *  During which time it is possible for Express to read from a
   *  target JSON which is being written to (as it is transformed
   *  again) and parsing will fail
   *
   *  But! That's quite unlikely, I think
   */

  return (
    chokidar
      .watch(SOURCE_PATTERN, { persistent: true })
      .on('add', handleSourcePathChange)
      .on('change', handleSourcePathChange)
      .on('unlink', handleSourcePathRemove)
      .on('error', handleFilePathError)
  )
}
