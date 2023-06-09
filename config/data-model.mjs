/**
 * @module #config/data-model
 *
 * @typedef {import('#config/args').ArgsMap} ArgsMap
 * @typedef {import('#config/data-model').KeyMap} KeyMap
 */

import {
  resolve,
  join
} from 'node:path'

/**
 * @type {ArgsMap}
 */
import args from './args.mjs'

/**
 * @constant
 * @type {string}
 */
export const XLSX_DIRECTORY = resolve(args.get('XLSX_DIRECTORY'))

/**
 * @constant
 * @type {string}
 */
export const DATA_MODEL_FILE_NAME = args.get('DATA_MODEL_FILE_NAME')

/**
 * @constant
 * @type {string}
 */
export const DATA_MODEL_FILE_PATH = resolve(join(XLSX_DIRECTORY, DATA_MODEL_FILE_NAME))

/**
 * @constant
 * @type {string}
 */
export const SWAGGER_YAML_FILE_PATH = resolve(args.get('SWAGGER_YAML_FILE_PATH'))

/**
 * @constant
 * @type {string}
 */
export const SWAGGER_JSON_FILE_PATH = resolve(args.get('SWAGGER_JSON_FILE_PATH'))

/**
 * @constant
 * @type {string}
 */
export const IMPACT_OVERALL_DATASET_NAME = args.get('IMPACT_OVERALL_DATASET_NAME')

/**
 * @constant
 * @type {string}
 */
export const WUR_PORTAL_DATASET_NAME = args.get('WUR_PORTAL_DATASET_NAME')

/**
 * @constant
 * @type {string}
 */
export const WUR_CITATIONS_DATASET_NAME = args.get('WUR_CITATIONS_DATASET_NAME')

/**
 * @constant
 * @type {string}
 */
export const WUR_METRICS_DATASET_NAME = args.get('WUR_METRICS_DATASET_NAME')

/**
 * @constant
 * @type {string}
 */
export const WUR_ID_MAPPING_DATASET_NAME = args.get('WUR_ID_MAPPING_DATASET_NAME')

/**
 * @constant
 * @type {string}
 */
export const WUR_REF_DATA_DATASET_NAME = args.get('WUR_REF_DATA_DATASET_NAME')

/**
 * @constant
 * @type {string}
 */
export const IMPACT_OVERALL_COMPONENT_SCHEMA = args.get('IMPACT_OVERALL_COMPONENT_SCHEMA')

/**
 * @constant
 * @type {string}
 */
export const WUR_PORTAL_COMPONENT_SCHEMA = args.get('WUR_PORTAL_COMPONENT_SCHEMA')

/**
 * @constant
 * @type {string}
 */
export const WUR_CITATIONS_COMPONENT_SCHEMA = args.get('WUR_CITATIONS_COMPONENT_SCHEMA')

/**
 * @constant
 * @type {string}
 */
export const WUR_METRICS_COMPONENT_SCHEMA = args.get('WUR_METRICS_COMPONENT_SCHEMA')

/**
 * @constant
 * @type {string}
 */
export const WUR_ID_MAPPING_COMPONENT_SCHEMA = args.get('WUR_ID_MAPPING_COMPONENT_SCHEMA')

/**
 * @constant
 * @type {string}
 */
export const WUR_REF_DATA_COMPONENT_SCHEMA = args.get('WUR_REF_DATA_COMPONENT_SCHEMA')

/**
 * @constant
 * @type {string}
 */
export const IMPACT_OVERALL_LABEL = args.get('IMPACT_OVERALL_LABEL')

/**
 * @constant
 * @type {string}
 */
export const WUR_PORTAL_LABEL = args.get('WUR_PORTAL_LABEL')

/**
 * @constant
 * @type {string}
 */
export const WUR_CITATIONS_LABEL = args.get('WUR_CITATIONS_LABEL')

/**
 * @constant
 * @type {string}
 */
export const WUR_METRICS_LABEL = args.get('WUR_METRICS_LABEL')

/**
 * @constant
 * @type {string}
 */
export const WUR_ID_MAPPING_LABEL = args.get('WUR_ID_MAPPING_LABEL')

/**
 * @constant
 * @type {string}
 */
export const WUR_REF_DATA_LABEL = args.get('WUR_REF_DATA_LABEL')

/**
 * @constant
 * @type {KeyMap}
 */
export const IMPACT_OVERALL_KEY_MAP = { id: 'institution_id' }

/**
 * @constant
 * @type {KeyMap}
 */
export const WUR_PORTAL_KEY_MAP = { id: 'institution_id', subject: 'subject_id' }

/**
 * @constant
 * @type {KeyMap}
 */
export const WUR_CITATIONS_KEY_MAP = { id: 'institution_id', subject: 'subject_id' }

/**
 * @constant
 * @type {KeyMap}
 */
export const WUR_METRICS_KEY_MAP = { id: 'institution_id', wur_year: 'year', subject: 'subject_id' }

/**
 * @constant
 * @type {KeyMap}
 */
export const WUR_ID_MAPPING_KEY_MAP = {}

/**
 * @constant
 * @type {KeyMap}
 */
export const WUR_REF_DATA_KEY_MAP = { parentid: 'institution_id' }
