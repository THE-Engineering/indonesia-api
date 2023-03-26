/**
 * @module #utils/to-json-file-path
 */

import {
  basename,
  extname,
  join,
  resolve
} from 'node:path'

/**
 * Transforms from the source file path to the target file path
 *
 * @param {string} fromPath - The source file path
 * @param {string} toPath - The target directory
 * @returns {string} A file path
 */
export default function toJsonFilePath (fromPath, toPath) {
  const fileName = basename(fromPath, extname(fromPath)).concat('.json')

  return resolve(join(toPath, fileName))
}
