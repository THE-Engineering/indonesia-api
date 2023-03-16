import {
  join
} from 'node:path'

import toJsonFilePath from '#utils/to-json-file-path'

import args from './args.mjs'

export const BASIC_AUTH_USERS = args.get('BASIC_AUTH_USERS')
export const PORT = args.get('PORT')
export const SOURCE_DIRECTORY = args.get('SOURCE_DIRECTORY')
export const TARGET_DIRECTORY = args.get('TARGET_DIRECTORY')
export const IMPACT_OVERALL_FILE_NAME = args.get('IMPACT_OVERALL_FILE_NAME')
export const WUR_PORTAL_FILE_NAME = args.get('WUR_PORTAL_FILE_NAME')
export const WUR_CITATIONS_FILE_NAME = args.get('WUR_CITATIONS_FILE_NAME')
export const WUR_METRICS_FILE_NAME = args.get('WUR_METRICS_FILE_NAME')
export const WUR_ID_MAPPING_FILE_NAME = args.get('WUR_ID_MAPPING_FILE_NAME')
export const WUR_REF_DATA_FILE_NAME = args.get('WUR_REF_DATA_FILE_NAME')
export const IMPACT_OVERALL_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, IMPACT_OVERALL_FILE_NAME), TARGET_DIRECTORY)
export const WUR_PORTAL_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, WUR_PORTAL_FILE_NAME), TARGET_DIRECTORY)
export const WUR_CITATIONS_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, WUR_CITATIONS_FILE_NAME), TARGET_DIRECTORY)
export const WUR_METRICS_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, WUR_METRICS_FILE_NAME), TARGET_DIRECTORY)
export const WUR_ID_MAPPING_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, WUR_ID_MAPPING_FILE_NAME), TARGET_DIRECTORY)
export const WUR_REF_DATA_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, WUR_REF_DATA_FILE_NAME), TARGET_DIRECTORY)
export const IMPACT_OVERALL_KEY_MAP = { institution_id: 'id' }
export const WUR_PORTAL_KEY_MAP = { institution_id: 'id', subject_id: 'subject' }
export const WUR_CITATIONS_KEY_MAP = { institution_id: 'id', subject_id: 'subject' }
export const WUR_METRICS_KEY_MAP = { institution_id: 'id', year: 'wur_year', subject_id: 'subject' }
export const WUR_ID_MAPPING_KEY_MAP = {}
export const WUR_REF_DATA_KEY_MAP = {}
