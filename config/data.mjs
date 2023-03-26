/**
 * @module #config/data
 *
 * @typedef {Object} KeyMap
 * @property {string} [institution_id]
 * @property {string} [year]
 * @property {string} [subject_id]
 */

import {
  resolve,
  join
} from 'node:path'

import toJsonFilePath from '#utils/to-json-file-path'

import args from './args.mjs'

/**
 * @type {string}
 */
export const SOURCE_DIRECTORY = resolve(args.get('SOURCE_DIRECTORY'))

/**
 * @type {string}
 */
export const TARGET_DIRECTORY = resolve(args.get('TARGET_DIRECTORY'))

/**
 * @type {string}
 */
export const IMPACT_OVERALL_FILE_NAME = args.get('IMPACT_OVERALL_FILE_NAME')

/**
 * @type {string}
 */
export const IMPACT_OVERALL_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, IMPACT_OVERALL_FILE_NAME), TARGET_DIRECTORY)

/**
 * @type {string}
 */
export const WUR_PORTAL_FILE_NAME = args.get('WUR_PORTAL_FILE_NAME')

/**
 * @type {string}
 */
export const WUR_PORTAL_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, WUR_PORTAL_FILE_NAME), TARGET_DIRECTORY)

/**
 * @type {string}
 */
export const WUR_CITATIONS_FILE_NAME = args.get('WUR_CITATIONS_FILE_NAME')

/**
 * @type {string}
 */
export const WUR_CITATIONS_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, WUR_CITATIONS_FILE_NAME), TARGET_DIRECTORY)

/**
 * @type {string}
 */
export const WUR_METRICS_FILE_NAME = args.get('WUR_METRICS_FILE_NAME')

/**
 * @type {string}
 */
export const WUR_METRICS_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, WUR_METRICS_FILE_NAME), TARGET_DIRECTORY)

/**
 * @type {string}
 */
export const WUR_ID_MAPPING_FILE_NAME = args.get('WUR_ID_MAPPING_FILE_NAME')

/**
 * @type {string}
 */
export const WUR_ID_MAPPING_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, WUR_ID_MAPPING_FILE_NAME), TARGET_DIRECTORY)

/**
 * @type {string}
 */
export const WUR_REF_DATA_FILE_NAME = args.get('WUR_REF_DATA_FILE_NAME')

/**
 * @type {string}
 */
export const WUR_REF_DATA_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, WUR_REF_DATA_FILE_NAME), TARGET_DIRECTORY)

/**
 * @type {KeyMap}
 */
export const IMPACT_OVERALL_KEY_MAP = { institution_id: 'id' }

/**
 * @type {KeyMap}
 */
export const WUR_PORTAL_KEY_MAP = { institution_id: 'id', subject_id: 'subject' }

/**
 * @type {KeyMap}
 */
export const WUR_CITATIONS_KEY_MAP = { institution_id: 'id', subject_id: 'subject' }

/**
 * @type {KeyMap}
 */
export const WUR_METRICS_KEY_MAP = { institution_id: 'id', year: 'wur_year', subject_id: 'subject' }

/**
 * @type {KeyMap}
 */
export const WUR_ID_MAPPING_KEY_MAP = {}

/**
 * @type {KeyMap}
 */
export const WUR_REF_DATA_KEY_MAP = {}
