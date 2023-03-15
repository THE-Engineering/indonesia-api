import {
  dirname,
  join,
  resolve
} from 'node:path'

import {
  unlink
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

import toJsonFilePath from '#utils/to-json-file-path'
import handleFilePathError from '#utils/handle-file-path-error'
import transformFromCsvToJson from './transform-from-csv-to-json.mjs'

const SOURCE_PATTERN = resolve(join(SOURCE_DIRECTORY, '*.csv'))

const TARGET_PATTERN = resolve(join(TARGET_DIRECTORY, '*.json'))

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
 * Transforms source files in CSV format to target files in JSON
 * format and watches for changes, returning the watcher to the
 * caller
 *
 * @returns {Promise<chokidar.FSWatcher>}
 */
export default async function ingest () {
  await ensureDir(SOURCE_DIRECTORY)
  await ensureDir(TARGET_DIRECTORY)

  await del(TARGET_PATTERN)

  console.log('Ingesting data ...')

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
      .on('change', handleSourcePathChange)
      .on('unlink', handleSourcePathRemove)
      .on('error', handleFilePathError)
  )
}
