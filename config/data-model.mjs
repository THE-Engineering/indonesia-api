import args from './args.mjs'

import {
  resolve
} from 'node:path'

export const XLSX_DIRECTORY = args.get('XLSX_DIRECTORY')

export const DATA_MODEL_FILE_NAME = args.get('DATA_MODEL_FILE_NAME')
export const SWAGGER_YAML_FILE_PATH = resolve(args.get('SWAGGER_YAML_FILE_PATH'))
export const SWAGGER_JSON_FILE_PATH = resolve(args.get('SWAGGER_JSON_FILE_PATH'))

export const IMPACT_OVERALL_DATASET_NAME = args.get('IMPACT_OVERALL_DATASET_NAME')
export const WUR_PORTAL_DATASET_NAME = args.get('WUR_PORTAL_DATASET_NAME')
export const WUR_CITATIONS_DATASET_NAME = args.get('WUR_CITATIONS_DATASET_NAME')
export const WUR_METRICS_DATASET_NAME = args.get('WUR_METRICS_DATASET_NAME')
export const WUR_ID_MAPPING_DATASET_NAME = args.get('WUR_ID_MAPPING_DATASET_NAME')
export const WUR_REF_DATA_DATASET_NAME = args.get('WUR_REF_DATA_DATASET_NAME')

export const IMPACT_OVERALL_COMPONENT_SCHEMA = args.get('IMPACT_OVERALL_COMPONENT_SCHEMA')
export const WUR_PORTAL_COMPONENT_SCHEMA = args.get('WUR_PORTAL_COMPONENT_SCHEMA')
export const WUR_CITATIONS_COMPONENT_SCHEMA = args.get('WUR_CITATIONS_COMPONENT_SCHEMA')
export const WUR_METRICS_COMPONENT_SCHEMA = args.get('WUR_METRICS_COMPONENT_SCHEMA')
export const WUR_ID_MAPPING_COMPONENT_SCHEMA = args.get('WUR_ID_MAPPING_COMPONENT_SCHEMA')
export const WUR_REF_DATA_COMPONENT_SCHEMA = args.get('WUR_REF_DATA_COMPONENT_SCHEMA')

export const IMPACT_OVERALL_LABEL = args.get('IMPACT_OVERALL_LABEL')
export const WUR_PORTAL_LABEL = args.get('WUR_PORTAL_LABEL')
export const WUR_CITATIONS_LABEL = args.get('WUR_CITATIONS_LABEL')
export const WUR_METRICS_LABEL = args.get('WUR_METRICS_LABEL')
export const WUR_ID_MAPPING_LABEL = args.get('WUR_ID_MAPPING_LABEL')
export const WUR_REF_DATA_LABEL = args.get('WUR_REF_DATA_LABEL')

export const IMPACT_OVERALL_KEY_MAP = { id: 'institution_id' }
export const WUR_PORTAL_KEY_MAP = { id: 'institution_id', subject: 'subject_id' }
export const WUR_CITATIONS_KEY_MAP = { id: 'institution_id', subject: 'subject_id' }
export const WUR_METRICS_KEY_MAP = { id: 'institution_id', wur_year: 'year', subject: 'subject_id' }
export const WUR_ID_MAPPING_KEY_MAP = {}
export const WUR_REF_DATA_KEY_MAP = { parentid: 'institution_id' }
