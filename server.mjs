import express from 'express'
import basicAuth from 'express-basic-auth'

import {
  BASIC_AUTH_USERS,
  IMPACT_OVERALL_FILE_PATH,
  IMPACT_OVERALL_KEY_MAP,
  WUR_PORTAL_FILE_PATH,
  WUR_PORTAL_KEY_MAP,
  WUR_CITATIONS_FILE_PATH,
  WUR_CITATIONS_KEY_MAP,
  WUR_METRICS_FILE_PATH,
  WUR_METRICS_KEY_MAP,
  WUR_ID_MAPPING_FILE_PATH,
  WUR_ID_MAPPING_KEY_MAP,
  WUR_REF_DATA_FILE_PATH,
  WUR_REF_DATA_KEY_MAP,
  PORT
} from '#config'

import ingest from '#ingest'

import SCHEMA from './server/schema.mjs'
import getSchemaMiddleware from './server/middlewares/get-schema-middleware.mjs'
import getHasFilePathMiddleware from './server/middlewares/get-has-file-path-middleware.mjs'
import getFilePathMiddleware from './server/middlewares/get-file-path-middleware.mjs'
import getFileDataMiddleware from './server/middlewares/get-file-data-middleware.mjs'
import renderRoute from './server/render-route.mjs'

const app = express()

app.disable('x-powered-by')

app.use(basicAuth({
  users: BASIC_AUTH_USERS,
  challenge: true,
  realm: 'indonesia-api'
}))

ingest()
  .then(() => {
    app.get('/impactoverall',
      getSchemaMiddleware(SCHEMA),
      getHasFilePathMiddleware(IMPACT_OVERALL_FILE_PATH),
      getFilePathMiddleware(IMPACT_OVERALL_FILE_PATH),
      getFileDataMiddleware(IMPACT_OVERALL_FILE_PATH, IMPACT_OVERALL_KEY_MAP),
      renderRoute)

    app.get('/wurportal',
      getSchemaMiddleware(SCHEMA),
      getHasFilePathMiddleware(WUR_PORTAL_FILE_PATH),
      getFilePathMiddleware(WUR_PORTAL_FILE_PATH),
      getFileDataMiddleware(WUR_PORTAL_FILE_PATH, WUR_PORTAL_KEY_MAP),
      renderRoute)

    app.get('/wurcitations',
      getSchemaMiddleware(SCHEMA),
      getHasFilePathMiddleware(WUR_CITATIONS_FILE_PATH),
      getFilePathMiddleware(WUR_CITATIONS_FILE_PATH),
      getFileDataMiddleware(WUR_CITATIONS_FILE_PATH, WUR_CITATIONS_KEY_MAP),
      renderRoute)

    app.get('/wurmetrics',
      getSchemaMiddleware(SCHEMA),
      getHasFilePathMiddleware(WUR_METRICS_FILE_PATH),
      getFilePathMiddleware(WUR_METRICS_FILE_PATH),
      getFileDataMiddleware(WUR_METRICS_FILE_PATH, WUR_METRICS_KEY_MAP),
      renderRoute)

    app.get('/wuridmapping',
      getSchemaMiddleware(SCHEMA),
      getHasFilePathMiddleware(WUR_ID_MAPPING_FILE_PATH),
      getFilePathMiddleware(WUR_ID_MAPPING_FILE_PATH),
      getFileDataMiddleware(WUR_ID_MAPPING_FILE_PATH, WUR_ID_MAPPING_KEY_MAP),
      renderRoute)

    app.get('/wurrefdata',
      getSchemaMiddleware(SCHEMA),
      getHasFilePathMiddleware(WUR_REF_DATA_FILE_PATH),
      getFilePathMiddleware(WUR_REF_DATA_FILE_PATH),
      getFileDataMiddleware(WUR_REF_DATA_FILE_PATH, WUR_REF_DATA_KEY_MAP),
      renderRoute)

    app.listen(PORT, () => {
      console.log('🚀')
    })
  })
