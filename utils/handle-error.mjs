/**
 * @module #utils/handle-error
 */

/**
 * Handle errors
 *
 * @param {Error} e - The error
 * @returns {void} Without a return value
 */
export default function handleError (e) {
  const {
    code,
    message
  } = e

  console.error(
    (code)
      ? `💥 ${code} - ${message}`
      : `💥 ${message}`
  )
}
