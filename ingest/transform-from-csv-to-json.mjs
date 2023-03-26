/**
 * @module #ingest/transform-csv-to-json
 */

import {
  createReadStream,
  createWriteStream
} from 'node:fs'

import {
  readFile,
  writeFile
} from 'node:fs/promises'

import {
  deleteAsync as del
} from 'del'

import csv from 'csvtojson'

import {
  SOURCE_DIRECTORY
} from '#config/data'

import toJsonFilePath from '#utils/to-json-file-path'
import handleFilePathError from '#utils/handle-file-path-error'

/**
 * Parse the JSON string (but only take one argument from `map`)
 *
 * @param {string} string - From the array
 * @returns {Object.<string, (string|number|boolean)>} An object
 */
function fromJson (string) {
  return JSON.parse(string)
}

/**
 * Split on end-of-line characters and remove zero-length lines
 *
 * @param {string} string - From the file data buffer
 * @returns {string[]} An array of file data split to lines
 * and filtered to remove any falsy
 */
function toArray (string) {
  return string.split(String.fromCodePoint(10)).filter(Boolean)
}

/**
 * Transforms a file where each line is a JSON object into a file
 * describing an array containing all of those JSON objects
 *
 * @param {Buffer} buffer - The source file data
 * @returns {Buffer} The target file data
 */
function transformFileData (buffer) {
  return (
    Buffer.from(JSON.stringify(toArray(buffer.toString()).map(fromJson)))
  )
}

/**
 * A stepped process using both streams and async methods to transform file data
 * from CSV to JSON
 *
 *  - We read from `sourcePath` as a stream and write to `writerPath`
 *  as a stream
 *  - Then we read from `writerPath` async, transform the buffer, and
 *  write to `targetPath` async
 *
 * @param {string} sourcePath - A file path for a CSV file
 * @param {string} targetPath - A file path for a JSON file
 * @returns {Promise<void>} Resolves without a return value
 */
export default async function transformFromCsvToJson (sourcePath, targetPath) {
  /**
   *  Generate the `writerPath` file path for the write stream
   */
  const writerPath = toJsonFilePath(sourcePath, SOURCE_DIRECTORY)
  /**
   *  Ensure to delete any file at `writerPath`
   */
  await del(writerPath)

  return (
    new Promise((resolve, reject) => {
      const reader = createReadStream(sourcePath)
      const writer = createWriteStream(writerPath)

      reader
        .pipe(csv())
        .pipe(
          writer
            .on('finish', async function handleWriteStreamFinish () {
              try {
                /**
                 *  Read from `writerPath` async, transform the buffer, and write to
                 *  `targetPath` async
                 */
                await writeFile(targetPath, transformFileData(await readFile(writerPath)))
              } catch (e) {
                handleFilePathError(e)
              }
            })
            .on('close', resolve)
            .on('error', reject)
        )
    })
  )
}
