import 'dotenv/config'
import nconf from 'nconf'

export const DEFAULT_SOURCE_DIRECTORY = '.source'
export const DEFAULT_TARGET_DIRECTORY = '.target'
export const DEFAULT_XLSX_DIRECTORY = '.xlsx'
export const DEFAULT_IMPACT_OVERALL_FILE_NAME = 'Impact_Overall.csv'
export const DEFAULT_WUR_PORTAL_FILE_NAME = 'WUR_portal.csv'
export const DEFAULT_WUR_CITATIONS_FILE_NAME = 'WUR_citation.csv'
export const DEFAULT_WUR_METRICS_FILE_NAME = 'WUR_metrics.csv'
export const DEFAULT_WUR_ID_MAPPING_FILE_NAME = 'WUR_ID_mapping.csv'
export const DEFAULT_WUR_REF_DATA_FILE_NAME = 'WUR_Ref_data.csv'
export const DEFAULT_SCHEMA_MIN_YEAR = 2001
export const DEFAULT_SCHEMA_MAX_YEAR = (new Date()).getFullYear()
export const DEFAULT_PORT = 80
export const DEFAULT_DATA_MODEL_FILE_NAME = 'Data Model.xlsx'
export const DEFAULT_SWAGGER_YAML_FILE_PATH = './swagger.yaml'
export const DEFAULT_SWAGGER_JSON_FILE_PATH = './swagger.json'

function transform ({ key, value }) {
  if (key === 'BASIC_AUTH_USERS') {
    return {
      key,
      value: JSON.parse(value)
    }
  }

  if (
    key === 'PORT' ||
    key === 'SCHEMA_MIN_YEAR' ||
    key === 'SCHEMA_MAX_YEAR') {
    return {
      key,
      value: Number(value)
    }
  }

  return {
    key,
    value
  }
}

/**
 *  `argv` and `env` options objects are destroyed (so
 *  don't pass the same object to both methods)
 */
export const args = nconf.argv({ transform }).env({ transform }).defaults({
  BASIC_AUTH_USERS: {},
  SOURCE_DIRECTORY: DEFAULT_SOURCE_DIRECTORY,
  TARGET_DIRECTORY: DEFAULT_TARGET_DIRECTORY,
  XLSX_DIRECTORY: DEFAULT_XLSX_DIRECTORY,
  IMPACT_OVERALL_FILE_NAME: DEFAULT_IMPACT_OVERALL_FILE_NAME,
  WUR_PORTAL_FILE_NAME: DEFAULT_WUR_PORTAL_FILE_NAME,
  WUR_CITATIONS_FILE_NAME: DEFAULT_WUR_CITATIONS_FILE_NAME,
  WUR_METRICS_FILE_NAME: DEFAULT_WUR_METRICS_FILE_NAME,
  WUR_ID_MAPPING_FILE_NAME: DEFAULT_WUR_ID_MAPPING_FILE_NAME,
  WUR_REF_DATA_FILE_NAME: DEFAULT_WUR_REF_DATA_FILE_NAME,
  SCHEMA_MIN_YEAR: DEFAULT_SCHEMA_MIN_YEAR,
  SCHEMA_MAX_YEAR: DEFAULT_SCHEMA_MAX_YEAR,
  PORT: DEFAULT_PORT,
  DATA_MODEL_FILE_NAME: DEFAULT_DATA_MODEL_FILE_NAME,
  SWAGGER_YAML_FILE_PATH: DEFAULT_SWAGGER_YAML_FILE_PATH,
  SWAGGER_JSON_FILE_PATH: DEFAULT_SWAGGER_JSON_FILE_PATH
}).get()

export default new Map(Object.entries(args))
