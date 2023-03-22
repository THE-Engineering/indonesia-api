import {
  readFileSync
} from 'node:fs'

import express from 'express'
import basicAuth from 'express-basic-auth'
import YAML from 'yaml'
import swaggerUi from 'swagger-ui-express'

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

import IMPACT_OVERALL_SCHEMA from './server/schemas/impact-overall-schema.mjs'
import WUR_PORTAL_SCHEMA from './server/schemas/wur-portal-schema.mjs'
import WUR_CITATIONS_SCHEMA from './server/schemas/wur-citations-schema.mjs'
import WUR_METRICS_SCHEMA from './server/schemas/wur-metrics-schema.mjs'
import WUR_ID_MAPPING_SCHEMA from './server/schemas/wur-id-mapping-schema.mjs'
import WUR_REF_DATA_SCHEMA from './server/schemas/wur-ref-data-schema.mjs'

import getSchemaMiddleware from './server/middlewares/get-schema-middleware.mjs'
import getHasFilePathMiddleware from './server/middlewares/get-has-file-path-middleware.mjs'
import getFilePathMiddleware from './server/middlewares/get-file-path-middleware.mjs'
import getFileDataMiddleware from './server/middlewares/get-file-data-middleware.mjs'
import renderRoute from './server/render-route.mjs'

import {
  NOT_FOUND
} from './server/common/index.mjs'

const app = express()

app.disable('x-powered-by')

app.use(basicAuth({
  users: BASIC_AUTH_USERS,
  challenge: true,
  realm: 'indonesia-api'
}))

{
  const SWAGGER_OPTIONS = {
    swaggerOptions: {
      url: '/api-docs/swagger.json'
    }
  }

  const yaml = readFileSync('./swagger.yaml', 'utf8').toString('utf8')
  const swaggerDocument = YAML.parse(yaml)

  app.get('/api-docs/swagger.json', (req, res) => res.json(swaggerDocument))

  app.use('/api-docs', swaggerUi.serveFiles(null, SWAGGER_OPTIONS), swaggerUi.setup(null, SWAGGER_OPTIONS))
}

ingest()
  .then(() => {
    app.get('/impact-overall',
      getSchemaMiddleware(IMPACT_OVERALL_SCHEMA),
      getHasFilePathMiddleware(IMPACT_OVERALL_FILE_PATH),
      getFilePathMiddleware(IMPACT_OVERALL_FILE_PATH),
      getFileDataMiddleware(IMPACT_OVERALL_FILE_PATH, IMPACT_OVERALL_KEY_MAP),
      renderRoute)

    app.get('/wur-portal',
      getSchemaMiddleware(WUR_PORTAL_SCHEMA),
      getHasFilePathMiddleware(WUR_PORTAL_FILE_PATH),
      getFilePathMiddleware(WUR_PORTAL_FILE_PATH),
      getFileDataMiddleware(WUR_PORTAL_FILE_PATH, WUR_PORTAL_KEY_MAP),
      renderRoute)

    app.get('/wur-citations',
      getSchemaMiddleware(WUR_CITATIONS_SCHEMA),
      getHasFilePathMiddleware(WUR_CITATIONS_FILE_PATH),
      getFilePathMiddleware(WUR_CITATIONS_FILE_PATH),
      getFileDataMiddleware(WUR_CITATIONS_FILE_PATH, WUR_CITATIONS_KEY_MAP),
      renderRoute)

    app.get('/wur-metrics',
      getSchemaMiddleware(WUR_METRICS_SCHEMA),
      getHasFilePathMiddleware(WUR_METRICS_FILE_PATH),
      getFilePathMiddleware(WUR_METRICS_FILE_PATH),
      getFileDataMiddleware(WUR_METRICS_FILE_PATH, WUR_METRICS_KEY_MAP),
      renderRoute)

    app.get('/wur-id-mapping',
      getSchemaMiddleware(WUR_ID_MAPPING_SCHEMA),
      getHasFilePathMiddleware(WUR_ID_MAPPING_FILE_PATH),
      getFilePathMiddleware(WUR_ID_MAPPING_FILE_PATH),
      getFileDataMiddleware(WUR_ID_MAPPING_FILE_PATH, WUR_ID_MAPPING_KEY_MAP),
      renderRoute)

    app.get('/wur-ref-data',
      getSchemaMiddleware(WUR_REF_DATA_SCHEMA),
      getHasFilePathMiddleware(WUR_REF_DATA_FILE_PATH),
      getFilePathMiddleware(WUR_REF_DATA_FILE_PATH),
      getFileDataMiddleware(WUR_REF_DATA_FILE_PATH, WUR_REF_DATA_KEY_MAP),
      renderRoute)

    app.use((req, res) => {
      res.json(NOT_FOUND)
    })

    app.listen(PORT, () => {
      console.log('🚀')
    })
  })
