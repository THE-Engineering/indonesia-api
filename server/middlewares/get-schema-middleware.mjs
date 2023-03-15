/**
 * @typedef {import("joi").ObjectSchema} ObjectSchema
 * @typedef {import("express").NextFunction} NextFunction
 */

import {
  UNPROCESSABLE_CONTENT
} from '#server/common'

/**
 * Gets the middleware for validating the request query with its schema
 *
 * @param {ObjectSchema} schema - A schema definition
 * @returns {(req:Express.Request, res:Express.Response, next:NextFunction) => void} Middleware
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
