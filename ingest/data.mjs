/**
 * @typedef {import('fs').Stats} Stats
 * @typedef {import('@aws-sdk/client-sqs').ReceiveMessageCommandOutput} ReceiveMessageCommandOutput
 * @typedef {import('../utils/gen-s3.mjs').S3} S3
 */

import {
  extname,
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
  DeleteMessageCommand
} from '@aws-sdk/client-sqs'

import {
  S3Client,
  ListObjectsCommand
} from '@aws-sdk/client-s3'

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
} from '#config/data'

import {
  AWS_REGION,
  AWS_BUCKET_NAME,
  AWS_QUEUE_URL
} from '#config'

import genSQSMessage from '#utils/gen-sqs-message'
import genS3 from '#utils/gen-s3'
import {
  getS3ObjectFor
} from '#utils/client-s3'
import toJsonFilePath from '#utils/to-json-file-path'
import handleFilePathError from '#utils/handle-file-path-error'
import handleError from '#utils/handle-error'

import transformFromCsvToJson from './transform-from-csv-to-json.mjs'

const SOURCE_PATTERN = resolve(join(SOURCE_DIRECTORY, '*.csv'))

const TARGET_PATTERN = resolve(join(TARGET_DIRECTORY, '*.json'))

const statsMap = new Map()

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
async function handleDataFilePathChange (sourcePath) {
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
    if (!await isChanged(sourcePath)) return
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
async function handleDataFilePathRemove (sourcePath) {
  const targetPath = toJsonFilePath(sourcePath, TARGET_DIRECTORY)

  try {
    await ensureDir(dirname(targetPath))
    statsMap.delete(sourcePath)
    await unlink(targetPath)
  } catch (e) {
    handleFilePathError(e)
  }
}

/**
 * Objects created in S3 are written to the file system
 *
 * @param {S3} s3
 * @returns {Promise<void>}
 */
async function handleS3ObjectCreated ({ object: { key } = {} }) {
  try {
    const filePath = join(SOURCE_DIRECTORY, key)
    await writeFile(filePath, await getS3ObjectFor(key))
    statsMap.set(filePath, await stat(filePath))
  } catch (e) {
    handleError(e)
  }
}

/**
 * Objects removed from S3 are unlinked from the file system
 *
 * @param {S3} s3
 * @returns {Promise<void>}
 */
async function handleS3ObjectRemoved ({ object: { key } = {} }) {
  try {
    const filePath = join(SOURCE_DIRECTORY, key)
    statsMap.delete(filePath)
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

  for await (const { Messages: messages = [] } of genSQSMessage(client, AWS_QUEUE_URL)) {
    let isMessageHandled = false

    while (messages.length) {
      const message = messages.shift()

      for (const s3 of genS3(message)) {
        const {
          configurationId = ''
        } = s3

        if (configurationId.startsWith('CSVCreated')) {
          await handleS3ObjectCreated(s3)
          isMessageHandled = true
        } else {
          if (configurationId.startsWith('CSVRemoved')) {
            await handleS3ObjectRemoved(s3)
            isMessageHandled = true
          }
        }
      }

      if (isMessageHandled) {
        const {
          ReceiptHandle: receiptHandle
        } = message

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
}

/**
 * Syncronises S3 with the file system
 *
 * @returns {Promise<void>}
 */
async function syncDataWithS3 () {
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

      if (extname(key) === '.csv') {
        const filePath = join(SOURCE_DIRECTORY, key)
        await writeFile(filePath, await getS3ObjectFor(key))
        statsMap.set(filePath, await stat(filePath))
      }
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
export default async function ingestData () {
  await ensureDir(SOURCE_DIRECTORY)
  await ensureDir(TARGET_DIRECTORY)

  await del(SOURCE_PATTERN)
  await del(TARGET_PATTERN)

  console.log('Ingesting data ...')

  await syncDataWithS3()

  /**
   *  We perform the transformation process now on the expectation that
   *  we have retrieved source CSVs from S3 and there is something to
   *  transform
   */

  const filePathList = await glob(SOURCE_PATTERN)
  while (filePathList.length) {
    const filePath = filePathList.shift()
    await handleDataFilePathChange(filePath)
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
   *  CSVs into S3. If Express has to wait on a human then it
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
      .on('add', handleDataFilePathChange)
      .on('change', handleDataFilePathChange)
      .on('unlink', handleDataFilePathRemove)
      .on('error', handleFilePathError)
  )
}
