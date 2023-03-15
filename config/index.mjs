import {
  join
} from 'node:path'

import toJsonFilePath from '#utils/to-json-file-path'

import args from './args.mjs'

export const BASIC_AUTH_USERS = args.get('BASIC_AUTH_USERS')
export const PORT = args.get('PORT')
export const SOURCE_DIRECTORY = args.get('SOURCE_DIRECTORY')
export const TARGET_DIRECTORY = args.get('TARGET_DIRECTORY')
export const WUR_PORTAL_FILE_NAME = args.get('WUR_PORTAL_FILE_NAME')
export const WUR_CITATIONS_FILE_NAME = args.get('WUR_CITATIONS_FILE_NAME')
export const WUR_METRICS_FILE_NAME = args.get('WUR_METRICS_FILE_NAME')
export const WUR_PORTAL_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, WUR_PORTAL_FILE_NAME), TARGET_DIRECTORY)
export const WUR_CITATIONS_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, WUR_CITATIONS_FILE_NAME), TARGET_DIRECTORY)
export const WUR_METRICS_FILE_PATH = toJsonFilePath(join(SOURCE_DIRECTORY, WUR_METRICS_FILE_NAME), TARGET_DIRECTORY)
