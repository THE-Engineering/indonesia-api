/**
 * @module #ingest/data-model
 *
 * @typedef {import('@aws-sdk/client-sqs').Message} Message
 * @typedef {import('#utils/gen-s3').S3} S3
 */

import {
  extname,
  dirname,
  join,
  resolve
} from 'node:path'

import {
  readFile,
  writeFile,
  unlink
} from 'node:fs/promises'

import PubSub from 'pubsub-js'

import glob from 'glob'

import chokidar from 'chokidar'

import {
  ensureDir
} from 'fs-extra'

import {
  deleteAsync as del
} from 'del'

import {
  XLSX_DIRECTORY,
  DATA_MODEL_FILE_PATH,
  SWAGGER_YAML_FILE_PATH,
  SWAGGER_JSON_FILE_PATH
} from '#config/data-model'

import genS3 from '#utils/gen-s3'
import getS3Objects from '#utils/get-s3-objects'
import getS3Object from '#utils/get-s3-object'
import dispatchSQSDeleteMessage from '#utils/dispatch-sqs-delete-message'
import handleFilePathError from '#utils/handle-file-path-error'
import handleError from '#utils/handle-error'

import transformFromXlsxToYaml from './transform-from-xlsx-to-yaml.mjs'
import transformFromYamlToJson from './transform-from-yaml-to-json.mjs'

const XLSX_CREATED_EVENT = 'xlsx-created-event'

const XLSX_REMOVED_EVENT = 'xlsx-removed-event'

/**
 * Replaces `+` characters with whitespace
 *
 * @param {string} s - A file name
 * @returns {string} A file name
 */
function toFileName (s) {
  return s.replace(/\+/g, String.fromCodePoint(32))
}

/**
 * Resolves `s` to a file path
 *
 * @param {string} s - A file name
 * @returns {string} A file path
 */
function toFilePath (s) {
  return resolve(join(XLSX_DIRECTORY, s))
}

/**
 * When the source file is changed the target file is changed
 *
 * @param {string} filePath - An XLSX file
 * @returns {Promise<void>} Resolves without a return value
 */
async function handleDataModelFilePathChange (filePath) {
  try {
    await ensureDir(dirname(filePath))
    await ensureDir(dirname(SWAGGER_YAML_FILE_PATH))
    await ensureDir(dirname(SWAGGER_JSON_FILE_PATH))

    const xlsx = await readFile(filePath)
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
 * @param {string} filePath - An XLSX file
 * @returns {Promise<void>} Resolves without a return value
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
 * @param {S3} - Destructured from an SQS Message
 * @returns {Promise<void>} Resolves without a return value
 */
async function handleS3ObjectCreated ({ object: { key } = {} }) {
  try {
    const fileName = toFileName(key)
    const filePath = toFilePath(fileName)
    await writeFile(filePath, await getS3Object(fileName))

    console.log(`🛸 Created "${fileName}"`)
  } catch (e) {
    handleError(e)
  }
}

/**
 * Objects removed from the S3 bucket are unlinked from the file system
 *
 * @param {S3} - Destructured from an SQS Message
 * @returns {Promise<void>} Resolves without a return value
 */
async function handleS3ObjectRemoved ({ object: { key } = {} }) {
  try {
    const fileName = toFileName(key)
    const filePath = toFilePath(fileName)
    await unlink(filePath)

    console.log(`🛸 Removed "${fileName}"`)
  } catch (e) {
    handleError(e)
  }
}

/**
 * Handle the message from SQS
 *
 * @param {Message} message - An SQS Message
 * @returns {Promise<void>} Resolves without a return value
 */
async function handleSQSMessage (message) {
  for (const s3 of genS3(message)) {
    const {
      configurationId = ''
    } = s3

    if (configurationId.startsWith(XLSX_CREATED_EVENT)) {
      await handleS3ObjectCreated(s3)

      await dispatchSQSDeleteMessage(message)
    } else {
      if (configurationId.startsWith(XLSX_REMOVED_EVENT)) {
        await handleS3ObjectRemoved(s3)

        await dispatchSQSDeleteMessage(message)
      }
    }
  }
}

/**
 * Syncronises the S3 bucket with the file system
 *
 * @returns {Promise<void>} Resolves without a return value
 */
async function syncDataModelWithS3 () {
  try {
    const {
      Contents: contents = []
    } = await getS3Objects()

    while (contents.length) {
      const {
        Key: key
      } = contents.shift()

      if (extname(key) === '.xlsx') {
        const fileName = toFileName(key)
        const filePath = toFilePath(fileName)
        await writeFile(filePath, await getS3Object(fileName))
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
 * @returns {Promise<chokidar.FSWatcher>} Resolves to a Chokidar file system watcher
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

  PubSub.subscribe('aws:sqs:message', async (topic, message) => { await handleSQSMessage(message) })

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
      .on('add', async (filePath) => {
        await handleDataModelFilePathChange(filePath)
      })
      .on('change', async (filePath) => {
        await handleDataModelFilePathChange(filePath)
      })
      .on('unlink', async (filePath) => {
        await handleDataModelFilePathRemove(filePath)
      })
      .on('error', handleFilePathError)
  )
}
