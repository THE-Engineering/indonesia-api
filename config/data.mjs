/**
 * @module #config/data
 *
 * @typedef {import('#config/args').ArgsMap} ArgsMap
 * @typedef {import('#config/data').KeyMap} KeyMap
 */

import {
  resolve,
  join
} from 'node:path'

import toJsonFilePath from '#utils/to-json-file-path'

/**
 * @type {ArgsMap}
 */
import args from './args.mjs'

/**
 * @constant
 * @type {string}
 */
export const SOURCE_DIRECTORY = resolve(args.get('SOURCE_DIRECTORY'))

/**
 * @constant
 * @type {string}
 */
export const TARGET_DIRECTORY = resolve(args.get('TARGET_DIRECTORY'))

/**
 * @constant
 * @type {string}
 */
export const IMPACT_OVERALL_FILE_NAME = args.get('IMPACT_OVERALL_FILE_NAME')

/**
 * @constant
 * @type {string}
 */
export const IMPACT_OVERALL_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, IMPACT_OVERALL_FILE_NAME), TARGET_DIRECTORY)

/**
 * @constant
 * @type {string}
 */
export const WUR_PORTAL_FILE_NAME = args.get('WUR_PORTAL_FILE_NAME')

/**
 * @constant
 * @type {string}
 */
export const WUR_PORTAL_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, WUR_PORTAL_FILE_NAME), TARGET_DIRECTORY)

/**
 * @constant
 * @type {string}
 */
export const WUR_CITATIONS_FILE_NAME = args.get('WUR_CITATIONS_FILE_NAME')

/**
 * @constant
 * @type {string}
 */
export const WUR_CITATIONS_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, WUR_CITATIONS_FILE_NAME), TARGET_DIRECTORY)

/**
 * @constant
 * @type {string}
 */
export const WUR_METRICS_FILE_NAME = args.get('WUR_METRICS_FILE_NAME')

/**
 * @constant
 * @type {string}
 */
export const WUR_METRICS_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, WUR_METRICS_FILE_NAME), TARGET_DIRECTORY)

/**
 * @constant
 * @type {string}
 */
export const WUR_ID_MAPPING_FILE_NAME = args.get('WUR_ID_MAPPING_FILE_NAME')

/**
 * @constant
 * @type {string}
 */
export const WUR_ID_MAPPING_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, WUR_ID_MAPPING_FILE_NAME), TARGET_DIRECTORY)

/**
 * @constant
 * @type {string}
 */
export const WUR_REF_DATA_FILE_NAME = args.get('WUR_REF_DATA_FILE_NAME')

/**
 * @constant
 * @type {string}
 */
export const WUR_REF_DATA_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, WUR_REF_DATA_FILE_NAME), TARGET_DIRECTORY)

/**
 * @constant
 * @type {KeyMap}
 */
export const IMPACT_OVERALL_KEY_MAP = { institution_id: 'id' }

/**
 * @constant
 * @type {KeyMap}
 */
export const WUR_PORTAL_KEY_MAP = { institution_id: 'id', subject_id: 'subject' }

/**
 * @constant
 * @type {KeyMap}
 */
export const WUR_CITATIONS_KEY_MAP = { institution_id: 'id', subject_id: 'subject' }

/**
 * @constant
 * @type {KeyMap}
 */
export const WUR_METRICS_KEY_MAP = { institution_id: 'id', year: 'wur_year', subject_id: 'subject' }

/**
 * @constant
 * @type {KeyMap}
 */
export const WUR_ID_MAPPING_KEY_MAP = {}

/**
 * @constant
 * @type {KeyMap}
 */
export const WUR_REF_DATA_KEY_MAP = {}
