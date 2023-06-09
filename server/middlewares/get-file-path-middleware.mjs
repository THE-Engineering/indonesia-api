/**
 * @module #server/middlewares/get-file-path-middleware
 *
 * @typedef {import('#server/middleware/get-file-path-middleware').RequestQuery} RequestQuery
 * @typedef {import('#server/middleware/get-file-path-middleware').Middleware} Middleware
 */

import toQueryFilePath from '#utils/to-query-file-path'

/**
 * Generates the file path for `institution_id` query
 *
 * @param {RequestQuery} query - The request query
 * @param {string} filePath - The current file path
 * @returns {string} The file path (whether amended or not)
 *
 * Where `institution_id` is present in the query we append its
 * value to the file path. Otherwise, we return the file path
 * as-is
 */
function getQueryFilePathForInstitutionId (query, filePath) {
  if (Reflect.has(query, 'institution_id')) {
    const ID = Reflect.get(query, 'institution_id')

    return toQueryFilePath(filePath, ID)
  }

  return filePath
}

/**
 * Generates the file path for `year` query
 *
 * @param {RequestQuery} query - The request query
 * @param {string} filePath - The current file path
 * @returns {string} The file path (whether amended or not)
 *
 * Where `year` is present in the query we append its value
 * to the file path. Otherwise, we return the file path as-is
 */
function getQueryFilePathForYear (query, filePath) {
  if (Reflect.has(query, 'year')) {
    const YEAR = Reflect.get(query, 'year')

    return toQueryFilePath(filePath, YEAR)
  }

  return filePath
}

/**
 * Generates the file path for `subject_id` query
 *
 * @param {RequestQuery} query - The request query
 * @param {string} filePath - The current file path
 * @returns {string} The file path (whether amended or not)
 *
 * Where `subject_id` is present in the query we append its
 * value to the file path. Otherwise, we return the file path
 * as-is
 */
function getQueryFilePathForSubjectId (query, filePath) {
  if (Reflect.has(query, 'subject_id')) {
    const SUBJECT = Reflect.get(query, 'subject_id')

    return toQueryFilePath(filePath, SUBJECT)
  }

  return filePath
}

/**
 * Generates the file path for the request query
 *
 * @param {RequestQuery} query - The request query
 * @param {string} filePath - The source file path
 * @returns {string} The target file path
 */
function getQueryFilePath (query, filePath) {
  return getQueryFilePathForSubjectId(query, getQueryFilePathForYear(query, getQueryFilePathForInstitutionId(query, filePath)))
}

/**
 * Gets the middleware for generating the file path for filtered file data
 *
 * @param {string} fromPath - A JSON file path
 * @returns {Middleware} Middleware
 */
export default function getFilePathMiddleware (fromPath) {
  return function filePathMiddleware ({ query }, { locals }, next) {
    const toPath = getQueryFilePath(query, fromPath)

    locals.filePath = toPath

    next()
  }
}
