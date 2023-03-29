/**
 * @module #server/render-route
 *
 * @typedef {import('#server/render-route').ResponseLocals} ResponseLocals
 * @typedef {import('express').Request} ExpressRequest
 * @typedef {import('express').Response<{}, ResponseLocals>} ExpressResponse
 */

import {
  access,
  constants
} from 'node:fs/promises'

import handleFilePathError from '#utils/handle-file-path-error'

import {
  NOT_FOUND
} from './common/index.mjs'

/**
 * @param {ExpressRequest} req - The Express request
 * @param {ExpressResponse} res - The Express response
 * @returns {void} Without a return value
 */
export default async function renderRoute (req, res) {
  const {
    locals: {
      filePath
    }
  } = res

  try {
    await access(filePath, constants.R_OK)
    res.sendFile(filePath)
  } catch (e) {
    res.status(404).json(NOT_FOUND).on('end', () => {
      handleFilePathError(e)
    })
  }
}
