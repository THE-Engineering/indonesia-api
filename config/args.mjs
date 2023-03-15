import 'dotenv/config'
import nconf from 'nconf'

export const DEFAULT_SOURCE_DIRECTORY = '.source'
export const DEFAULT_TARGET_DIRECTORY = '.target'
export const DEFAULT_WUR_PORTAL_FILE_NAME = 'WUR_portal.csv'
export const DEFAULT_WUR_CITATIONS_FILE_NAME = 'WUR_citation.csv'
export const DEFAULT_WUR_METRICS_FILE_NAME = 'WUR_metrics.csv'
export const DEFAULT_SCHEMA_MIN_YEAR = 2001
export const DEFAULT_SCHEMA_MAX_YEAR = (new Date()).getFullYear()
export const DEFAULT_PORT = 80

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
  WUR_PORTAL_FILE_NAME: DEFAULT_WUR_PORTAL_FILE_NAME,
  WUR_CITATIONS_FILE_NAME: DEFAULT_WUR_CITATIONS_FILE_NAME,
  WUR_METRICS_FILE_NAME: DEFAULT_WUR_METRICS_FILE_NAME,
  SCHEMA_MIN_YEAR: DEFAULT_SCHEMA_MIN_YEAR,
  SCHEMA_MAX_YEAR: DEFAULT_SCHEMA_MAX_YEAR,
  PORT: DEFAULT_PORT
}).get()

export default new Map(Object.entries(args))
