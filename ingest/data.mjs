/**
 * @typedef {import('fs').Stats} Stats
 * @typedef {import('@aws-sdk/client-sqs').ReceiveMessageCommandOutput} ReceiveMessageCommandOutput
 * @typedef {import('@aws-sdk/client-sqs').Message} Message
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
  writeFile
} from 'node:fs/promises'

import PubSub from 'pubsub-js'

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
  AWS_BUCKET_NAME
} from '#config'

import genS3 from '#utils/gen-s3'
import getS3ObjectFor from '#utils/get-s3-object-for'
import toJsonFilePath from '#utils/to-json-file-path'
import handleFilePathError from '#utils/handle-file-path-error'
import handleError from '#utils/handle-error'

import {
  sendSQSDeleteMessageCommand
} from './from-queue.mjs'

import transformFromCsvToJson from './transform-from-csv-to-json.mjs'

const SOURCE_PATTERN = resolve(join(SOURCE_DIRECTORY, '*.csv'))

const TARGET_PATTERN = resolve(join(TARGET_DIRECTORY, '*.json'))

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
    await unlink(targetPath)
  } catch (e) {
    handleFilePathError(e)
  }
}

/**
 * Objects created in S3 are written to the file system
 *
 * @param {S3}
 * @returns {Promise<void>}
 */
async function handleS3ObjectCreated ({ object: { key } = {} }) {
  try {
    const filePath = resolve(join(SOURCE_DIRECTORY, key))
    await writeFile(filePath, await getS3ObjectFor(key))
  } catch (e) {
    handleError(e)
  }
}

/**
 * Objects removed from S3 are unlinked from the file system
 *
 * @param {S3}
 * @returns {Promise<void>}
 */
async function handleS3ObjectRemoved ({ object: { key } = {} }) {
  try {
    const filePath = resolve(join(SOURCE_DIRECTORY, key))
    await unlink(filePath)
  } catch (e) {
    handleError(e)
  }
}

/**
 * Handle the message from SQS
 *
 * @param {Message} message
 * @returns {Promise<void>}
 */
async function handleSQSMessage (message) {
  for (const s3 of genS3(message)) {
    const {
      configurationId = ''
    } = s3

    if (configurationId.startsWith('CSVCreated')) {
      await handleS3ObjectCreated(s3)

      await sendSQSDeleteMessageCommand(message)
    } else {
      if (configurationId.startsWith('CSVRemoved')) {
        await handleS3ObjectRemoved(s3)

        await sendSQSDeleteMessageCommand(message)
      }
    }
  }
}

/**
 * Handle the `PubSub` topic
 *
 * @param {string} topic
 * @param {Message} message
 * @returns {Promise<void>}
 */
async function handleSQSMessageTopic (topic, message) {
  return (
    await handleSQSMessage(message)
  )
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
        const filePath = resolve(join(SOURCE_DIRECTORY, key))
        await writeFile(filePath, await getS3ObjectFor(key))
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

  PubSub.subscribe('aws:sqs:message', handleSQSMessageTopic)

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
      .watch(SOURCE_PATTERN, { persistent: true, ignoreInitial: true, awaitWriteFinish: true })
      /**
       *  But handle `add` events to sync CSVs uploaded into S3 while the
       *  application is running
       */
      .on('add', async (filePath) => {
        await handleDataFilePathChange(filePath)
      })
      .on('change', async (filePath) => {
        await handleDataFilePathChange(filePath)
      })
      .on('unlink', async (filePath) => {
        await handleDataFilePathRemove(filePath)
      })
      .on('error', handleFilePathError)
  )
}
