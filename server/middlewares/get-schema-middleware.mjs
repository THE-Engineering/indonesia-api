/**
 * @module #server/middlewares/get-schema-middleware
 *
 * @typedef {import('#server/middleware/get-schema-middleware').Middleware} Middleware
 * @typedef {import('joi').ObjectSchema} ObjectSchema
 */

import {
  UNPROCESSABLE_CONTENT
} from '#server/common'

/**
 * Gets the middleware for validating the request query with its schema
 *
 * @param {ObjectSchema} schema - A schema definition
 * @returns {Middleware} Middleware
 */
export default function getSchemaMiddleware (schema) {
  return function schemaMiddleware ({ query = {} }, res, next) {
    const {
      error
    } = schema.validate(query)

    if (error) {
      res.status(422).json(UNPROCESSABLE_CONTENT).on('end', () => {
        const {
          details = []
        } = error

        details
          .forEach(({ message }) => {
            if (message) console.error(`💥 ${message}`)
          })
      })
    } else {
      next()
    }
  }
}
