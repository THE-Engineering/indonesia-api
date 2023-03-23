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
  writeFile
} from 'node:fs/promises'

import {
  SQSClient,
  DeleteMessageCommand
} from '@aws-sdk/client-sqs'

import {
  S3Client,
  ListObjectsCommand
} from '@aws-sdk/client-s3'

import glob from 'glob'

import XLSX from 'node-xlsx'

import chokidar from 'chokidar'

import {
  ensureDir
} from 'fs-extra'

import {
  deleteAsync as del
} from 'del'

import {
  XLSX_DIRECTORY,
  DATA_MODEL_FILE_NAME,
  SWAGGER_YAML_FILE_PATH,
  SWAGGER_JSON_FILE_PATH
} from '#config/data-model'

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
import handleFilePathError from '#utils/handle-file-path-error'
import handleError from '#utils/handle-error'

import transformFromXlsxToYaml from './transform-from-xlsx-to-yaml.mjs'
import transformFromYamlToJson from './transform-from-yaml-to-json.mjs'

const DATA_MODEL_FILE_PATH = resolve(join(XLSX_DIRECTORY, DATA_MODEL_FILE_NAME))

/**
 * Replaces `+` characters with whitespace
 *
 * @param {string} s
 * @returns {string}
 */
function toFileName (s) {
  return s.replace(/\+/g, String.fromCodePoint(32))
}

/**
 * When the source file is changed the target file is changed
 *
 * @param {string} filePath - an XLSX file
 * @returns {Promise<void>}
 */
async function handleDataModelFilePathChange (filePath) {
  try {
    await ensureDir(dirname(filePath))
    await ensureDir(dirname(SWAGGER_YAML_FILE_PATH))
    await ensureDir(dirname(SWAGGER_JSON_FILE_PATH))

    const xlsx = XLSX.parse(filePath)
    const yaml = transformFromXlsxToYaml(xlsx)
    const json = transformFromYamlToJson(yaml)

    await writeFile(SWAGGER_YAML_FILE_PATH, yaml)
    await writeFile(SWAGGER_JSON_FILE_PATH, json)
  } catch (e) {
    handleFilePathError(e)
  }
}

/**
 * When the source file is removed the target file is removed
 *
 * @param {string} filePath - an XLSX file
 * @returns {Promise<void>}
 */
async function handleDataModelFilePathRemove (filePath) {
  try {
    await ensureDir(dirname(filePath))
    await unlink(filePath)
  } catch (e) {
    handleFilePathError(e)
  }

  try {
    await ensureDir(dirname(SWAGGER_YAML_FILE_PATH))
    await unlink(SWAGGER_YAML_FILE_PATH)
  } catch (e) {
    handleFilePathError(e)
  }

  try {
    await ensureDir(dirname(SWAGGER_JSON_FILE_PATH))
    await unlink(SWAGGER_JSON_FILE_PATH)
  } catch (e) {
    handleFilePathError(e)
  }
}

/**
 * Objects created in the S3 bucket are written to the file system
 *
 * @param {S3} s3
 * @returns {Promise<void>}
 */
async function handleS3ObjectCreated ({ object: { key } = {} }) {
  try {
    const fileName = toFileName(key)
    const filePath = join(XLSX_DIRECTORY, fileName)
    await writeFile(filePath, await getS3ObjectFor(fileName))
  } catch (e) {
    handleError(e)
  }
}

/**
 * Objects removed from the S3 bucket are unlinked from the file system
 *
 * @param {S3} s3
 * @returns {Promise<void>}
 */
async function handleS3ObjectRemoved ({ object: { key } = {} }) {
  try {
    const fileName = toFileName(key)
    const filePath = join(XLSX_DIRECTORY, fileName)
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

        if (configurationId.startsWith('XLSXCreated')) {
          await handleS3ObjectCreated(s3)
          isMessageHandled = true
        } else {
          if (configurationId.startsWith('XLSXRemoved')) {
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
 * Syncronises the S3 bucket with the file system
 *
 * @returns {Promise<void>}
 */
async function syncDataModelWithS3 () {
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

      if (extname(key) === '.xlsx') {
        const fileName = toFileName(key)
        const filePath = join(XLSX_DIRECTORY, fileName)
        await writeFile(filePath, await getS3ObjectFor(fileName))
      }
    }
  } catch (e) {
    handleError(e)
  }
}

/**
 * Transforms source files in XLSX format to target files in JSON
 * format and watches for changes, returning the watcher to the
 * caller
 *
 * @returns {Promise<chokidar.FSWatcher>}
 */
export default async function ingestDataModel () {
  await ensureDir(dirname(DATA_MODEL_FILE_PATH))

  await del(DATA_MODEL_FILE_PATH)

  console.log('Ingesting data model ...')

  await syncDataModelWithS3()

  const filePathList = await glob(DATA_MODEL_FILE_PATH)
  while (filePathList.length) {
    const filePath = filePathList.shift()
    await handleDataModelFilePathChange(filePath)
  }

  console.log('Ingesting data model complete.')

  /**
   *  Initiate the generator iterator after execution is complete
   */
  setImmediate(async () => await readMessageQueue())

  /**
   *  Provided S3 had source XLSXs to sync, the Swagger YAML and JSON
   *  generation is now complete
   *
   *  However
   *
   *    1) It is possible that S3 had no XLSXs to sync
   *    2) XLSXs may change while Express is running
   *
   *  With respect to 1), we return 404 for `swagger.json` until Swagger
   *  YAML and JSON are generated
   *
   *  With respect to 2), Swagger YAML and JSON generation overwrites any
   *  existing files without piping so Swagger requests are unlikely to explode
   */

  return (
    chokidar
      /**
       *  Use `ignoreInitial` so as not to raise `add` events for XLSXs we
       *  have just synced when Chokidar initialises
       */
      .watch(DATA_MODEL_FILE_PATH, { persistent: true, ignoreInitial: true, awaitWriteFinish: true })
      /**
       *  But handle `add` events to sync XLSXs uploaded into S3 while the
       *  application is running
       */
      .on('add', handleDataModelFilePathChange)
      .on('change', handleDataModelFilePathChange)
      .on('unlink', handleDataModelFilePathRemove)
      .on('error', handleFilePathError)
  )
}
