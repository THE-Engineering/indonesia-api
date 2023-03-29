/**
 * @module #server/middlewares/get-file-data-middleware
 *
 * @typedef {import('#server/middleware/get-file-data-middleware').RequestQuery} RequestQuery
 * @typedef {import('#server/middleware/get-file-data-middleware').KeyMap} KeyMap
 * @typedef {import('#server/middleware/get-file-data-middleware').Middleware} Middleware
 */

import {
  access,
  constants,
  readFile,
  writeFile
} from 'node:fs/promises'

import handleError from '#utils/handle-error'

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
 * @returns {object[]} The file data (whether filtered or not)
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
 * @returns {object[]} The file data (whether filtered or not)
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
 * @returns {object[]} The file data (whether filtered or not)
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
 * @param {RequestQuery} query - The request query parameters
 * @param {object[]} fileData - Unserialised file data
 * @param {KeyMap} keyMap - The map from request query parameter keys to dataset values
 * @returns {object[]} Unserialised file data (whether filtered or not)
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
 * @param {RequestQuery} query - Request query parameters
 * @param {string} fromPath - A JSON file path
 * @param {KeyMap} keyMap - The map from request query parameter keys to dataset values
 * @returns {Promise<void>} Resolves without a return value
 */
async function render (toPath, query, fromPath, keyMap) {
  try {
    const fileData = await readFromFilePath(fromPath)
    await writeToFilePath(toPath, getQueryFileData(query, fileData, keyMap))
  } catch (e) {
    handleError(e)
  }
}

/**
 * Gets the middleware for filtering and generating the file data to stream
 *
 * @param {string} fromPath - A JSON file path
 * @param {KeyMap} keyMap - A map from request query parameter keys to dataset values
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
