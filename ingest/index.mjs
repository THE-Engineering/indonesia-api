/**
 * @typedef {import('fs').Stats} Stats
 * @typedef {import('@aws-sdk/client-sqs').ReceiveMessageCommandOutput} ReceiveMessageCommandOutput
 */

import {
  dirname,
  join,
  resolve
} from 'node:path'

import {
  unlink,
  writeFile,
  stat
} from 'node:fs/promises'

import {
  isDeepStrictEqual
} from 'node:util'

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

const statsMap = new Map()

/**
 * Interrogates the message to determine whether it has
 * a `Messages` array
 *
 * @param {ReceiveMessageCommandOutput} message
 * @returns {boolean}
 */
function hasMessages (message) {
  if (Reflect.has(message, 'Messages')) {
    return Boolean(Reflect.get(message, 'Messages'))
  }

  return false
}

/**
 * Get the file system stats or null for the target JSON file
 *
 * @param {string} targetPath - a JSON file
 * @returns {Promise<Stats|null>}
 */
async function statsFor (targetPath) {
  try {
    return await stat(targetPath)
  } catch {
    return null
  }
}

/**
 * Interrogate the file path and compare its current stats with
 * its previous stats
 *
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
async function isChanged (filePath) {
  const now = await statsFor(filePath)

  if (now) {
    if (statsMap.has(filePath)) {
      const was = statsMap.get(filePath)

      if (isDeepStrictEqual(was, now)) return false
    }

    statsMap.set(filePath, now)
  }

  return true
}

/**
 * When the source file is changed the target file is changed
 *
 * @param {string} sourcePath - a CSV file
 * @returns {Promise<void>}
 */
async function handleSourcePathChange (sourcePath) {
  const targetPath = toJsonFilePath(sourcePath, TARGET_DIRECTORY)

  try {
    await ensureDir(dirname(targetPath))
    /**
     * This file system event filtering ensures we don't try to transform
     * from CSV to JSON while an earlier transformation of the same file data
     * is in progress
     *
     * We cache the stats for each file at `add` or `change` to decide whether
     * the current stats are different from the previous stats before beginning
     * another transformation
     *
     * It is possible (though unlikely) for change events to overlap where the
     * stats are not different. Simultaneous transformations will cause a fatal
     * error as the write streams trip over each other. Overlapping change
     * events are more likely with larger files!
     */
    if (!await isChanged(targetPath)) return
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
    if (!statsMap.delete(targetPath)) return
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
 * @yields {ReceiveMessageCommandOutput}
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
      WaitTimeSeconds: waitTimeSeconds,
      MaxNumberOfMessages: 1,
      MessageAttributeNames: [
        'All'
      ]
    })

    const message = await client.send(command)
    if (hasMessages(message)) {
      /**
       *  A message has been received from the queue
       *  so ensure short polling, and yield
       */
      waitTimeSeconds = 0

      yield message
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
 * Fetches the URL and resolves to a Blob
 *
 * @param {string} url - The S3 signed url
 * @returns {Promise<Blob>}
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
 * @param {Blob} blob
 * @returns {Promise<Buffer>}
 */
async function fromBlobToBuffer (blob) {
  const arrayBuffer = await blob.arrayBuffer()

  return Buffer.from(arrayBuffer)
}

/**
 *  Gets the bucket object from S3 and resolves it to a Buffer
 *
 * @param {string} key
 * @returns {Promise<Buffer>}
 */
async function getS3ObjectFor (key) {
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

/**
 * Objects created in the S3 bucket are written to the file system
 *
 * @param {{object?: {key: string}}} s3
 * @returns {Promise<void>}
 */
async function handleS3ObjectCreated ({ object: { key } = {} }) {
  try {
    const filePath = join(SOURCE_DIRECTORY, key)

    await writeFile(filePath, await getS3ObjectFor(key))
  } catch (e) {
    handleError(e)
  }
}

/**
 * Objects removed from the S3 bucket are unlinked from the file system
 *
 * @param {{object?: {key: string}}} s3
 * @returns {Promise<void>}
 */
async function handleS3ObjectRemoved ({ object: { key } = {} }) {
  try {
    const filePath = join(SOURCE_DIRECTORY, key)

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

  /**
   *  Loop
   */
  for await (const { Messages: messages = [] } of genMessages(client, AWS_QUEUE_URL)) {
    /**
     *  Loop
     */
    while (messages.length) {
      const {
        Body: messageBody,
        ReceiptHandle: receiptHandle
      } = messages.shift()

      const {
        Records: records = []
      } = JSON.parse(messageBody)

      /**
       *  Loop
       */
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

      const filePath = join(SOURCE_DIRECTORY, key)

      await writeFile(filePath, await getS3ObjectFor(key))
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
   *  We perform the transformation process now on the expectation that
   *  we have retrieved source CSVs from S3 and there is something to
   *  transform
   */

  const filePathList = await glob(SOURCE_PATTERN)
  while (filePathList.length) {
    const filePath = filePathList.shift()
    await handleSourcePathChange(filePath)
  }

  console.log('Ingesting data complete.')

  /**
   *  Initiate the generator iterator after execution is complete
   */
  setImmediate(async () => await readMessageQueue())

  /**
   *  Provided S3 had source CSVs to sync, their transformation is now
   *  complete. It should be impossible for Express to generate a 404
   *  on any of its routes
   *
   *  However
   *
   *    1) It is possible that S3 had no CSVs to sync
   *    2) CSVs may change while Express is running
   *
   *  With respect to 1) we return 404 for routes until there is target
   *  JSON
   *
   *  With respect to 2) it is possible for Express to try reading from
   *  a target JSON file whle it is being written to (as the source CSV
   *  is transformed again), in which case parsing the JSON will fail
   *
   *  2) seems quite unlikely while 1) is unlikely provided CI puts
   *  CSVs into the S3 bucket. If Express has to wait on a human then it
   *  can only return a 404 until a human has uploaded CSV files to S3
   */

  return (
    chokidar
      /**
       *  Use `ignoreInitial` so as not to raise `add` events for CSVs we
       *  have just synced when Chokidar initialises
       */
      .watch(SOURCE_PATTERN, { persistent: true, ignoreInitial: true })
      /**
       *  But handle `add` events to sync CSVs uploaded into S3 while the
       *  application is running
       */
      .on('add', handleSourcePathChange)
      .on('change', handleSourcePathChange)
      .on('unlink', handleSourcePathRemove)
      .on('error', handleFilePathError)
  )
}
