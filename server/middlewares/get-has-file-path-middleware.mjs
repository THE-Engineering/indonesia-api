/**
 * @typedef {import("express").NextFunction} NextFunction
 */

import {
  access,
  constants
} from 'node:fs/promises'

import handleFilePathError from '#utils/handle-file-path-error'

import {
  NOT_FOUND
} from '#server/common'

/**
 * Gets the middleware for validating a file exists at the JSON file path
 *
 * @param {string} filePath - A JSON file path
 * @returns {(req:Express.Request, res:Express.Response, next:NextFunction) => void} Middleware
 */
export default function getHasFilePathMiddleware (filePath) {
  return async function hasFilePathMiddleware (req, res, next) {
    try {
      await access(filePath, constants.R_OK)
      next()
    } catch (e) {
      res.status(404).json(NOT_FOUND).on('end', () => {
        handleFilePathError(e)
      })
    }
  }
}
