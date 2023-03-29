/**
 * @module #config/schema
 *
 * @typedef {import('#config/args').ArgsMap} ArgsMap
 */

/**
 * @type {ArgsMap}
 */
import args from './args.mjs'

/**
 * @type {RegExp}
 */
export const SCHEMA_INSTITUTION_ID = /i-\d{8}/

/**
 * @type {number}
 */
export const SCHEMA_MIN_YEAR = args.get('SCHEMA_MIN_YEAR')

/**
 * @type {number}
 */
export const SCHEMA_MAX_YEAR = args.get('SCHEMA_MAX_YEAR')
