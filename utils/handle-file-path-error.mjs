/**
 * @module #utils/handle-file-path-error
 */

import hasLogError from './has-log-error.mjs'

/**
 * Handle file path errors
 *
 * @param {Error} e - The error
 * @returns {void} Without a return value
 */
export default function handleFilePathError (e) {
  const {
    code
  } = e

  if (code !== 'ENOENT') {
    const {
      message
    } = e

    console.error(
      (code)
        ? `💥 ${code} - ${message}`
        : `💥 ${message}`
    )
  }

  if (hasLogError()) console.error(e)
}
