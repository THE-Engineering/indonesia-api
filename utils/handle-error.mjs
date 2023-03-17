/**
 * Handle errors
 *
 * @param {Error} e
 * @returns {void}
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
