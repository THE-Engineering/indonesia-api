/**
 * @module #config
 *
 * @typedef {import('#config/args').ArgsMap} ArgsMap
 * @typedef {import('#config/defaults').BasicAuth} BasicAuth
 */

/**
 * @type {ArgsMap}
 */
import args from './args.mjs'

/**
 * @type {boolean}
 */
export const logError = args.get('log-error')

/**
 * @type {string}
 */
export const AWS_REGION = args.get('AWS_REGION')

/**
 * @type {string}
 */
export const AWS_BUCKET_NAME = args.get('AWS_BUCKET_NAME')

/**
 * @type {string}
 */
export const AWS_QUEUE_URL = args.get('AWS_QUEUE_URL')

/**
 * @type {BasicAuth}
 */
export const BASIC_AUTH_USERS = args.get('BASIC_AUTH_USERS')

/**
 * @type {number}
 */
export const PORT = args.get('PORT')
