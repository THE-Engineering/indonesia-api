/**
 * @module #server/common
 *
 * @typedef {import('#server/common').CommonError} CommonError
 */

/**
 * @type {CommonError}
 */
export const NOT_FOUND = {
  status: 404,
  message: 'Not Found'
}

/**
 * @type {CommonError}
 */
export const UNPROCESSABLE_CONTENT = {
  status: 422,
  message: 'Unprocessable Content'
}
