import express from 'express'
import basicAuth from 'express-basic-auth'

import {
  BASIC_AUTH_USERS,
  WUR_PORTAL_FILE_PATH,
  WUR_CITATIONS_FILE_PATH,
  WUR_METRICS_FILE_PATH,
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
  realm: 'super-secret-api'
}))

ingest()
  .then(() => {
    app.get('/wurportal',
      getSchemaMiddleware(SCHEMA),
      getHasFilePathMiddleware(WUR_PORTAL_FILE_PATH),
      getFilePathMiddleware(WUR_PORTAL_FILE_PATH),
      getFileDataMiddleware(WUR_PORTAL_FILE_PATH),
      renderRoute)

    app.get('/wurcitations',
      getSchemaMiddleware(SCHEMA),
      getHasFilePathMiddleware(WUR_CITATIONS_FILE_PATH),
      getFilePathMiddleware(WUR_CITATIONS_FILE_PATH),
      getFileDataMiddleware(WUR_CITATIONS_FILE_PATH),
      renderRoute)

    app.get('/wurmetrics',
      getSchemaMiddleware(SCHEMA),
      getHasFilePathMiddleware(WUR_METRICS_FILE_PATH),
      getFilePathMiddleware(WUR_METRICS_FILE_PATH),
      getFileDataMiddleware(WUR_METRICS_FILE_PATH),
      renderRoute)

    app.listen(PORT, () => {
      console.log('🚀')
    })
  })
