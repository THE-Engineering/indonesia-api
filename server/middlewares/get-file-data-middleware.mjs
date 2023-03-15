/**
 * @typedef {import('express').Request<{}, {}, {}, RequestQuery, {}>} ExpressRequest
 * @typedef {import('express').Response<{}, ResponseLocals>} ExpressResponse
 * @typedef {import("express").NextFunction} NextFunction
 */

/**
 * Request query
 * @typedef {Object} RequestQuery
 * @property {string} [institution_id] - An institution
 * @property {string} [year] - A year
 * @property {string} [subject_id] - A subject
 */

/**
 * Response locals
 * @typedef {Object} ResponseLocals
 * @property {string} [filePath] - A file path
 */

import {
  access,
  constants,
  readFile,
  writeFile
} from 'node:fs/promises'

/**
 * Generates the file data for `institution_id` queries
 *
 * @param {RequestQuery} query - The request query
 * @param {object[]} fileData - The current file data
 * @returns {object[]} The filtered/current file data
 *
 * Where `institution_id` is present in the query we filter the
 * file data for it. Otherwise, we return the file data as-is
 */
function getQueryFileDataForInstitutionId (query, fileData) {
  if (Reflect.has(query, 'institution_id')) {
    const ID = Reflect.get(query, 'institution_id').toLowerCase()

    return fileData.filter(({ id }) => id.toLowerCase() === ID)
  }

  return fileData
}

/**
 * Generates the file data for `year` queries
 *
 * @param {RequestQuery} query - The request query
 * @param {object[]} fileData - The current file data
 * @returns {object[]} The filtered/current file data
 *
 * Where `year` is present in the query we filter the file data
 * for it. Otherwise, we return the file data as-is
 */
function getQueryFileDataForYear (query, fileData) {
  if (Reflect.has(query, 'year')) {
    const YEAR = Reflect.get(query, 'year')

    return fileData.filter(({ year }) => year === YEAR)
  }

  return fileData
}

/**
 * Generates the file data for `subject_id` queries
 *
 * @param {RequestQuery} query - The request query
 * @param {object[]} fileData - The current file data
 * @returns {object[]} The filtered/current file data
 *
 * Where `subject_id` is present in the query we filter the
 * file data for it. Otherwise, we return the file data as-is
 */
function getQueryFileDataForSubjectId (query, fileData) {
  if (Reflect.has(query, 'subject_id')) {
    const SUBJECT = Reflect.get(query, 'subject_id').toLowerCase()

    return fileData.filter(({ subject }) => subject.toLowerCase() === SUBJECT)
  }

  return fileData
}

/**
 * Generates the file path
 *
 * @param {RequestQuery} query - The request query
 * @param {object[]} fileData - The file data
 * @returns {string} The file path
 */
function getQueryFileData (query, fileData) {
  return getQueryFileDataForSubjectId(query, getQueryFileDataForYear(query, getQueryFileDataForInstitutionId(query, fileData)))
}

/**
 * Reads and deserialises the file data
 *
 * @param {string} filePath
 * @returns {Promise<object[]>} The file data
 */
async function readFromFilePath (filePath) {
  const fileData = await readFile(filePath)
  return JSON.parse(fileData.toString('utf8'))
}

/**
 * Serialises and writes the file data
 *
 * @param {string} filePath
 * @param {*} value
 * @returns {Promise<void>}
 */
async function writeToFilePath (filePath, value) {
  const fileData = JSON.stringify(value)
  await writeFile(filePath, fileData, 'utf8')
}

/**
 * Generates the file data for the request query
 *
 * @param {string} toPath
 * @param {RequestQuery} query
 * @param {string} fromPath
 * @returns {Promise<void>}
 */
async function render (toPath, query, fromPath) {
  try {
    await writeToFilePath(toPath, getQueryFileData(query, await readFromFilePath(fromPath)))
  } catch ({
    message
  }) {
    if (!message.startsWith('Unterminated string in JSON')) console.error(`💥 ${message}`)
  }
}

/**
 * Gets the middleware for filtering and generating the file data to stream
 *
 * @param {string} fromPath - A JSON file path
 * @returns {(req:ExpressRequest, res:ExpressResponse, next:NextFunction) => void} Middleware
 */
export default function getFileDataMiddleware (fromPath) {
  return async function fileDataMiddleware ({ query }, { locals: { filePath: toPath = '' } }, next) {
    try {
      await access(toPath, constants.R_OK)
    } catch {
      await render(toPath, query, fromPath)
    }

    next()
  }
}
