/**
 * @module #server/middlewares/get-file-data-middleware
 *
 * @typedef {import('express').Request<{}, {}, {}, RequestQuery, {}>} ExpressRequest
 * @typedef {import('express').Response<{}, ResponseLocals>} ExpressResponse
 * @typedef {import("express").NextFunction} NextFunction
 */

/**
 * Map from request query parameter keys to dataset values
 *
 * @typedef {Object} KeyMap
 * @property {string} [institution_id] - Key for the institution ID value
 * @property {string} [year] - Key for the year value
 * @property {string} [subject_id] - Key for the subject ID value
 */

/**
 * Request query
 *
 * @typedef {Object} RequestQuery
 * @property {string} [institution_id] - An institution
 * @property {string} [year] - A year
 * @property {string} [subject_id] - A subject
 */

/**
 * Response locals
 *
 * @typedef {Object} ResponseLocals
 * @property {string} [filePath] - A file path
 */

/**
 * Middleware
 *
 * @typedef {(req:ExpressRequest, res:ExpressResponse, next:NextFunction) => void} Middleware
 */

import {
  access,
  constants,
  readFile,
  writeFile
} from 'node:fs/promises'

/**
 * @type {string}
 */
const INSTITUTION_ID_KEY = 'institution_id'

/**
 * @type {string}
 */
const YEAR_KEY = 'year'

/**
 * @type {string}
 */
const SUBJECT_ID_KEY = 'subject_id'

/**
 * Generates the file data for `institution_id` queries
 *
 * @param {RequestQuery} query - The request query
 * @param {object[]} fileData - The current file data
 * @param {KeyMap} keyMap - The map from request query parameter keys to dataset values
 * @returns {object[]} Unserialised file data (whether filtered or unfiltered)
 *
 * Where `institution_id` is present in the query we filter the
 * file data for it. Otherwise, we return the file data as-is
 */
function getQueryFileDataForInstitutionId (query, fileData, { [INSTITUTION_ID_KEY]: key = INSTITUTION_ID_KEY }) {
  if (Reflect.has(query, 'institution_id')) {
    const INSTITUTION_ID = Reflect.get(query, 'institution_id').toLowerCase()

    return fileData.filter(({ [key]: institutionId }) => institutionId.toLowerCase() === INSTITUTION_ID)
  }

  return fileData
}

/**
 * Generates the file data for `year` queries
 *
 * @param {RequestQuery} query - The request query
 * @param {object[]} fileData - The current file data
 * @param {KeyMap} keyMap - The map from request query parameter keys to dataset values
 * @returns {object[]} Unserialised file data (whether filtered or unfiltered)
 *
 * Where `year` is present in the query we filter the file data
 * for it. Otherwise, we return the file data as-is
 */
function getQueryFileDataForYear (query, fileData, { [YEAR_KEY]: key = YEAR_KEY }) {
  if (Reflect.has(query, 'year')) {
    const YEAR = Reflect.get(query, 'year')

    return fileData.filter(({ [key]: year }) => year === YEAR)
  }

  return fileData
}

/**
 * Generates the file data for `subject_id` queries
 *
 * @param {RequestQuery} query - The request query
 * @param {object[]} fileData - The current file data
 * @param {KeyMap} keyMap - The map from request query parameter keys to dataset values
 * @returns {object[]} Unserialised file data (whether filtered or unfiltered)
 *
 * Where `subject_id` is present in the query we filter the
 * file data for it. Otherwise, we return the file data as-is
 */
function getQueryFileDataForSubjectId (query, fileData, { [SUBJECT_ID_KEY]: key = SUBJECT_ID_KEY }) {
  if (Reflect.has(query, 'subject_id')) {
    const SUBJECT_ID = Reflect.get(query, 'subject_id').toLowerCase()

    return fileData.filter(({ [key]: subjectId }) => subjectId.toLowerCase() === SUBJECT_ID)
  }

  return fileData
}

/**
 * Generates the file data
 *
 * @param {RequestQuery} query - The request query
 * @param {object[]} fileData - The file data
 * @param {KeyMap} keyMap - The map from request query parameter keys to dataset values
 * @returns {object[]} Unserialised file data
 */
function getQueryFileData (query, fileData, keyMap) {
  return getQueryFileDataForSubjectId(query, getQueryFileDataForYear(query, getQueryFileDataForInstitutionId(query, fileData, keyMap), keyMap), keyMap)
}

/**
 * Reads and deserialises the file data
 *
 * @param {string} filePath - A file path
 * @returns {Promise<object[]>} Resolves to deserialised file data
 */
async function readFromFilePath (filePath) {
  const fileData = await readFile(filePath)
  return JSON.parse(fileData.toString('utf8'))
}

/**
 * Serialises and writes the file data
 *
 * @param {string} filePath - A file path
 * @param {object[]} value - Unserialised file data
 * @returns {Promise<void>} Resolves without a return value
 */
async function writeToFilePath (filePath, value) {
  const fileData = JSON.stringify(value)
  await writeFile(filePath, fileData, 'utf8')
}

/**
 * Generates the file data for the request query
 *
 * @param {string} toPath - A JSON file path
 * @param {RequestQuery} query - Query parameters
 * @param {string} fromPath - A JSON file path
 * @param {KeyMap} keyMap - The map from request query parameter keys to dataset values
 * @returns {Promise<void>} Resolves without a return value
 */
async function render (toPath, query, fromPath, keyMap) {
  try {
    await writeToFilePath(toPath, getQueryFileData(query, await readFromFilePath(fromPath), keyMap))
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
 * @param {KeyMap} keyMap - A map between query parameter keys and dataset values
 * @returns {Middleware} Middleware
 */
export default function getFileDataMiddleware (fromPath, keyMap) {
  return async function fileDataMiddleware ({ query }, { locals: { filePath: toPath = '' } }, next) {
    try {
      await access(toPath, constants.R_OK)
    } catch {
      await render(toPath, query, fromPath, keyMap)
    }

    next()
  }
}
