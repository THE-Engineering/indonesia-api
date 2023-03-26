/**
 * @module #utils/handle-file-path-error
 */

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
}
