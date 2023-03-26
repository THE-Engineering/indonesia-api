/**
 * @module #utils/to-query-file-path
 */

import {
  dirname,
  basename,
  extname,
  join,
  resolve
} from 'node:path'

/**
 * @param {string} value - A request query parameter
 * @returns {string} The transformed request query parameter
 */
function normalise (value) {
  let s = value.trim().toLowerCase().replace(/\s+/g, '-')

  while (/-{2,}/g.test(s)) s = s.replace(/-{2,}/g, '-')

  return s
}

/**
 * Generates a file path containing the query value
 *
 * @param {string} filePath - The source file path
 * @param {string} queryValue - The query value
 * @returns {string} A file path
 */
export default function toQueryFilePath (filePath, queryValue) {
  const directory = dirname(filePath)
  const extension = extname(filePath)
  const fileName = `${basename(filePath, extension)}.${normalise(queryValue)}`.concat(extension)

  return resolve(join(directory, fileName))
}
