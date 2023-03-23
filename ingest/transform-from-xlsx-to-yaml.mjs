/**
 * Cols
 *
 * @typedef {Object} Cols
 * @property {number} dataSetNameColumn
 * @property {number} fieldColumn
 * @property {number} typeColumn
 */

/**
 * Row
 *
 * @typedef {(string|number|undefined)[]} Row
 */

/**
 * Rows
 *
 * @typedef {Row[]} Rows
 */

/**
 * Component
 *
 * @typedef {Object} Component
 * @property {string} field
 * @property {string} type
 */

/**
 * Components
 *
 * @typedef {Component[]} Components
 */

/**
 * KeyMap
 *
 * @typedef {Object.<string, string>} KeyMap
 */

import {
  IMPACT_OVERALL_KEY_MAP,
  WUR_PORTAL_KEY_MAP,
  WUR_CITATIONS_KEY_MAP,
  WUR_METRICS_KEY_MAP,
  WUR_ID_MAPPING_KEY_MAP,
  WUR_REF_DATA_KEY_MAP,
  IMPACT_OVERALL_DATASET_NAME,
  WUR_PORTAL_DATASET_NAME,
  WUR_CITATIONS_DATASET_NAME,
  WUR_METRICS_DATASET_NAME,
  WUR_ID_MAPPING_DATASET_NAME,
  WUR_REF_DATA_DATASET_NAME,
  IMPACT_OVERALL_COMPONENT_SCHEMA,
  WUR_PORTAL_COMPONENT_SCHEMA,
  WUR_CITATIONS_COMPONENT_SCHEMA,
  WUR_METRICS_COMPONENT_SCHEMA,
  WUR_ID_MAPPING_COMPONENT_SCHEMA,
  WUR_REF_DATA_COMPONENT_SCHEMA,
  IMPACT_OVERALL_LABEL,
  WUR_PORTAL_LABEL,
  WUR_CITATIONS_LABEL,
  WUR_METRICS_LABEL,
  WUR_ID_MAPPING_LABEL,
  WUR_REF_DATA_LABEL
} from '#config/data-model'

const IMPACT_OVERALL_PATH = `
  /impact-overall:
    get:
      tags:
        - authorised
      summary: Gets the ${IMPACT_OVERALL_LABEL} dataset
      operationId: ${IMPACT_OVERALL_COMPONENT_SCHEMA}
      description: |
        Gets the complete ${IMPACT_OVERALL_LABEL} dataset, or that dataset filtered using
        optional request query parameters
      parameters:
        - in: query
          name: institution_id
          description: an optional query parameter for filtering on institution
          required: false
          schema:
            $ref: '#/components/schemas/InstitutionQuery'
        - in: query
          name: year
          description: an optional query parameter for filtering on year
          required: false
          schema:
            $ref: '#/components/schemas/YearQuery'
      responses:
        '200':
          $ref: '#/components/responses/${IMPACT_OVERALL_COMPONENT_SCHEMA}'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/UnprocessableContent'
`

const WUR_PORTAL_PATH = `
  /wur-portal:
    get:
      tags:
        - authorised
      summary: Gets the ${WUR_PORTAL_LABEL} dataset
      operationId: ${WUR_PORTAL_COMPONENT_SCHEMA}
      description: |
        Gets the complete ${WUR_PORTAL_LABEL} dataset, or that dataset filtered using
        optional request query parameters
      parameters:
        - in: query
          name: institution_id
          description: an optional query parameter for filtering on institution
          required: false
          schema:
            $ref: '#/components/schemas/InstitutionQuery'
        - in: query
          name: year
          description: an optional query parameter for filtering on year
          required: false
          schema:
            $ref: '#/components/schemas/YearQuery'
        - in: query
          name: subject_id
          description: an optional query parameter for filtering on subject
          required: false
          schema:
            $ref: '#/components/schemas/SubjectQuery'
      responses:
        '200':
          $ref: '#/components/responses/${WUR_PORTAL_COMPONENT_SCHEMA}'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/UnprocessableContent'
`

const WUR_CITATIONS_PATH = `
  /wur-citations:
    get:
      tags:
        - authorised
      summary: Gets the ${WUR_CITATIONS_LABEL} dataset
      operationId: ${WUR_CITATIONS_COMPONENT_SCHEMA}
      description: |
        Gets the complete ${WUR_CITATIONS_LABEL} dataset, or that dataset filtered using
        optional request query parameters
      parameters:
        - in: query
          name: institution_id
          description: an optional query parameter for filtering on institution
          required: false
          schema:
            $ref: '#/components/schemas/InstitutionQuery'
        - in: query
          name: year
          description: an optional query parameter for filtering on year
          required: false
          schema:
            $ref: '#/components/schemas/YearQuery'
        - in: query
          name: subject_id
          description: an optional query parameter for filtering on subject
          required: false
          schema:
            $ref: '#/components/schemas/SubjectQuery'
      responses:
        '200':
          $ref: '#/components/responses/${WUR_CITATIONS_COMPONENT_SCHEMA}'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/UnprocessableContent'
`

const WUR_METRICS_PATH = `
  /wur-metrics:
    get:
      tags:
        - authorised
      summary: Gets the ${WUR_METRICS_LABEL} dataset
      operationId: ${WUR_METRICS_COMPONENT_SCHEMA}
      description: |
        Gets the complete ${WUR_METRICS_LABEL} dataset, or that dataset filtered using
        optional request query parameters
      parameters:
        - in: query
          name: institution_id
          description: an optional query parameter for filtering on institution
          required: false
          schema:
            $ref: '#/components/schemas/InstitutionQuery'
        - in: query
          name: year
          description: an optional query parameter for filtering on year
          required: false
          schema:
            $ref: '#/components/schemas/YearQuery'
        - in: query
          name: subject_id
          description: an optional query parameter for filtering on subject
          required: false
          schema:
            $ref: '#/components/schemas/SubjectQuery'
      responses:
        '200':
          $ref: '#/components/responses/${WUR_METRICS_COMPONENT_SCHEMA}'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/UnprocessableContent'
`

const WUR_ID_MAPPING_PATH = `
  /wur-id-mapping:
    get:
      tags:
        - authorised
      summary: Gets the ${WUR_ID_MAPPING_LABEL} dataset
      operationId: ${WUR_ID_MAPPING_COMPONENT_SCHEMA}
      description: |
        Gets the complete ${WUR_ID_MAPPING_LABEL} dataset, or that dataset filtered using
        optional request query parameters
      parameters:
        - in: query
          name: institution_id
          description: an optional query parameter for filtering on institution
          required: false
          schema:
            $ref: '#/components/schemas/InstitutionQuery'
      responses:
        '200':
          $ref: '#/components/responses/${WUR_ID_MAPPING_COMPONENT_SCHEMA}'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/UnprocessableContent'
`

const WUR_REF_DATA_PATH = `
  /wur-ref-data:
    get:
      tags:
        - authorised
      summary: Gets the ${WUR_REF_DATA_LABEL} dataset
      operationId: ${WUR_REF_DATA_COMPONENT_SCHEMA}
      description: |
        Gets the complete ${WUR_REF_DATA_LABEL} dataset, or that dataset filtered using
        optional request query parameters
      parameters:
        - in: query
          name: institution_id
          description: an optional query parameter for filtering on institution
          required: false
          schema:
            $ref: '#/components/schemas/InstitutionQuery'
      responses:
        '200':
          $ref: '#/components/responses/${WUR_REF_DATA_COMPONENT_SCHEMA}'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/UnprocessableContent'
`

const IMPACT_OVERALL_RESPONSE = `
    ${IMPACT_OVERALL_COMPONENT_SCHEMA}:
      description: Available results response for ${IMPACT_OVERALL_LABEL} dataset
      content:
        application/json:
          schema:
            type: array
            items:
              $ref: '#/components/schemas/${IMPACT_OVERALL_COMPONENT_SCHEMA}'
`

const WUR_PORTAL_RESPONSE = `
    ${WUR_PORTAL_COMPONENT_SCHEMA}:
      description: Available results response for ${WUR_PORTAL_LABEL} dataset
      content:
        application/json:
          schema:
            type: array
            items:
              $ref: '#/components/schemas/${WUR_PORTAL_COMPONENT_SCHEMA}'
`

const WUR_CITATIONS_RESPONSE = `
    ${WUR_CITATIONS_COMPONENT_SCHEMA}:
      description: Available results response for ${WUR_CITATIONS_LABEL} dataset
      content:
        application/json:
          schema:
            type: array
            items:
              $ref: '#/components/schemas/${WUR_CITATIONS_COMPONENT_SCHEMA}'
`

const WUR_METRICS_RESPONSE = `
    ${WUR_METRICS_COMPONENT_SCHEMA}:
      description: Available results response for ${WUR_METRICS_LABEL} dataset
      content:
        application/json:
          schema:
            type: array
            items:
              $ref: '#/components/schemas/${WUR_METRICS_COMPONENT_SCHEMA}'
`

const WUR_ID_MAPPING_RESPONSE = `
    ${WUR_ID_MAPPING_COMPONENT_SCHEMA}:
      description: Available results response for ${WUR_ID_MAPPING_LABEL} dataset
      content:
        application/json:
          schema:
            type: array
            items:
              $ref: '#/components/schemas/${WUR_ID_MAPPING_COMPONENT_SCHEMA}'
`

const WUR_REF_DATA_RESPONSE = `
    ${WUR_REF_DATA_COMPONENT_SCHEMA}:
      description: Available results response for ${WUR_REF_DATA_LABEL} dataset
      content:
        application/json:
          schema:
            type: array
            items:
              $ref: '#/components/schemas/${WUR_REF_DATA_COMPONENT_SCHEMA}'
`

/**
 * Removes extraneous end-of-line characters
 *
 * @param {string} s
 * @returns {string}
 */
function normalise (s) {
  return s.replace(/^\n+/, '').replace(/\n+$/, '')
}

/**
 * Gets the dataset name column index
 *
 * @param {Cols}
 * @returns {number}
 */
function getDataSetNameColumn ({ dataSetNameColumn }) {
  return dataSetNameColumn
}

/**
 * Gets the field column index
 *
 * @param {Cols}
 * @returns {number}
 */
function getFieldColumn ({ fieldColumn }) {
  return fieldColumn
}

/**
 * Gets the type column index
 *
 * @param {Cols}
 * @returns {number}
 */
function getTypeColumn ({ typeColumn }) {
  return typeColumn
}

/**
 * Generates the component schema `$ref`
 *
 * @param {KeyMap} keyMap
 * @param {string} field
 * @param {string} type
 * @returns {string}
 */
function toComponentSchemaRef (keyMap, field, type) {
  const key = field.trim()

  if (Reflect.has(keyMap, key)) {
    switch (Reflect.get(keyMap, key)) {
      case 'institution_id': return '#/components/schemas/Institution'
      case 'year': return '#/components/schemas/Year'
      case 'subject_id': return '#/components/schemas/Subject'
    }
  }

  if (key === 'institution_id') return '#/components/schemas/Institution'
  if (key === 'year') return '#/components/schemas/Year'
  if (key === 'subject_id') return '#/components/schemas/Subject'

  return (type === 'Numeric')
    ? '#/components/schemas/Numeric'
    : '#/components/schemas/Text'
}

/**
 * Generates an array of `required` strings
 *
 * @param {Component[]} components
 * @returns {string[]}
 */
function transformToRequired (components) {
  return (
    components
      .map(({ field }) => `- ${field.trim()}`)
  )
}

/**
 * Generates an array of `properties` arrays of strings
 *
 * @param {Component[]} components
 * @param {KeyMap} keyMap
 * @returns {string[][]}
 */
function transformToProperties (components, keyMap) {
  return (
    components
      .map(({ field, type }) => [
        field.trim().concat(':'),
        `$ref: '${toComponentSchemaRef(keyMap, field, type)}'`
      ])
  )
}

/**
 * Transforms the array of `required` strings to a string
 *
 * @param {string[]} required
 * @param {number} keyStart
 * @returns {string}
 */
function toRequired (required, keyStart = 0) {
  return (
    required
      .map((key) => String.fromCodePoint(32).repeat(keyStart) + key)
      .join(String.fromCodePoint(10))
  )
}

/**
 * Transforms the array of `properties` arrays of strings to a string
 *
 * @param {string[][]} properties
 * @param {number} keyStart
 * @returns {string}
 */
function toProperties (properties, keyStart = 0) {
  return (
    properties
      .map(([key, ref]) => {
        const s = String.fromCodePoint(32)
        const refStart = keyStart + 2

        return [
          s.repeat(keyStart) + key,
          s.repeat(refStart) + ref
        ].join(String.fromCodePoint(10))
      }).join(String.fromCodePoint(10))
  )
}

/**
 * Creates a filter to get the dataset matching the dataset name
 *
 * @param {number} column
 * @param {string} name
 * @returns {({ [column]: name }: {}) => boolean}
 */
function getIsDataSetFor (column, name) {
  const NAME = name.toLowerCase()

  return function isDataSet ({ [column]: name }) {
    return name.toLowerCase() === NAME
  }
}

/**
 * Implements the filter to interrogate the datasets to determine whether
 * the dataset matching the dataset name is present
 *
 * @param {number} column
 * @param {string} name
 * @param {Rows} rows
 * @returns {boolean}
 */
function hasDataSet (column, name, rows) {
  const isDataSet = getIsDataSetFor(column, name)

  return (
    rows
      .some(isDataSet)
  )
}

/**
 * Implements the filter to get the dataset matching the dataset name
 *
 * @param {number} column
 * @param {string} name
 * @param {Rows} rows
 * @returns {Rows}
 */
function getDataSet (column, name, rows) {
  const isDataSet = getIsDataSetFor(column, name)

  return (
    rows
      .filter(isDataSet)
  )
}

/**
 * Transforms the dataset array to a component object
 *
 * @param {Row}
 * @returns {Component}
 */
function transformFromDataSetToComponent (fieldColumn, typeColumn, { [fieldColumn]: field, [typeColumn]: type }) {
  return {
    field,
    type
  }
}

/**
 * Transforms the datasets arrays to components objects
 *
 * @param {Cols} cols
 * @param {Rows} rows
 * @returns {Component[]}
 */
function transformFromDataSetToComponents (cols, rows) {
  const fieldColumn = getFieldColumn(cols)
  const typeColumn = getTypeColumn(cols)

  return (
    rows
      .map((row) => transformFromDataSetToComponent(fieldColumn, typeColumn, row))
  )
}

/**
 * Interrogates the rows to determine whether the `Impact Overall` dataset
 * is present
 *
 * @param {Cols} cols
 * @param {Rows} rows
 * @returns {boolean}
 */
function hasImpactOverallDataSet (cols, rows) {
  return (
    hasDataSet(getDataSetNameColumn(cols), IMPACT_OVERALL_DATASET_NAME, rows)
  )
}

/**
 * Interrogates the rows to determine whether the `WUR Portal` dataset
 * is present
 *
 * @param {Cols} cols
 * @param {Rows} rows
 * @returns {boolean}
 */
function hasWURPortalDataSet (cols, rows) {
  return (
    hasDataSet(getDataSetNameColumn(cols), WUR_PORTAL_DATASET_NAME, rows)
  )
}

/**
 * Interrogates the rows to determine whether the `WUR Citatations` dataset
 * is present
 *
 * @param {Cols} cols
 * @param {Rows} rows
 * @returns {boolean}
 */
function hasWURCitationsDataSet (cols, rows) {
  return (
    hasDataSet(getDataSetNameColumn(cols), WUR_CITATIONS_DATASET_NAME, rows)
  )
}

/**
 * Interrogates the rows to determine whether the `WUR Metrics` dataset
 * is present
 *
 * @param {Cols} cols
 * @param {Rows} rows
 * @returns {boolean}
 */
function hasWURMetricsDataSet (cols, rows) {
  return (
    hasDataSet(getDataSetNameColumn(cols), WUR_METRICS_DATASET_NAME, rows)
  )
}

/**
 * Interrogates the rows to determine whether the `WUR ID Mapping` dataset
 * is present
 *
 * @param {Cols} cols
 * @param {Rows} rows
 * @returns {boolean}
 */
function hasWURIDMappingDataSet (cols, rows) {
  return (
    hasDataSet(getDataSetNameColumn(cols), WUR_ID_MAPPING_DATASET_NAME, rows)
  )
}

/**
 * Interrogates the rows to determine whether the `WUR Ref Data` dataset
 * is present
 *
 * @param {Cols} cols
 * @param {Rows} rows
 * @returns {boolean}
 */
function hasWURRefDataDataSet (cols, rows) {
  return (
    hasDataSet(getDataSetNameColumn(cols), WUR_REF_DATA_DATASET_NAME, rows)
  )
}

/**
 * Generates the Swagger YAML `components/schemas/${componentSchema}
 *
 * @param {string} componentSchema
 * @param {Component[]} components
 * @param {KeyMap} keyMap
 * @returns {string}
 */
function toComponentSchema (componentSchema, components, keyMap) {
  return `
    ${componentSchema}:
      type: object
      required:
${toRequired(transformToRequired(components), 8)}
      properties:
${toProperties(transformToProperties(components, keyMap), 8)}
`
}

/**
 * Generates the Swagger YAML `components/schemas/ImpactOverall
 *
 * @param {Cols} cols
 * @param {Rows} rows
 * @returns {string}
 */
function toImpactOverallComponentSchema (cols, rows) {
  const column = getDataSetNameColumn(cols)

  const dataSet = (
    getDataSet(
      column,
      IMPACT_OVERALL_DATASET_NAME,
      rows
    )
  )

  const components = (
    transformFromDataSetToComponents(
      cols,
      dataSet
    )
  )

  return (
    toComponentSchema(
      IMPACT_OVERALL_COMPONENT_SCHEMA,
      components,
      IMPACT_OVERALL_KEY_MAP
    )
  )
}

/**
 * Generates the Swagger YAML `components/schemas/WURPortal
 *
 * @param {Cols} cols
 * @param {Rows} rows
 * @returns {string}
 */
function toWURPortalComponentSchema (cols, rows) {
  const column = getDataSetNameColumn(cols)

  const dataSet = (
    getDataSet(
      column,
      WUR_PORTAL_DATASET_NAME,
      rows
    )
  )

  const components = (
    transformFromDataSetToComponents(
      cols,
      dataSet
    )
  )

  return (
    toComponentSchema(
      WUR_PORTAL_COMPONENT_SCHEMA,
      components,
      WUR_PORTAL_KEY_MAP
    )
  )
}

/**
 * Generates the Swagger YAML `components/schemas/WURCitations
 *
 * @param {Cols} cols
 * @param {Rows} rows
 * @returns {string}
 */
function toWURCitationsComponentSchema (cols, rows) {
  const column = getDataSetNameColumn(cols)

  const dataSet = (
    getDataSet(
      column,
      WUR_CITATIONS_DATASET_NAME,
      rows
    )
  )

  const components = (
    transformFromDataSetToComponents(
      cols,
      dataSet
    )
  )

  return (
    toComponentSchema(
      WUR_CITATIONS_COMPONENT_SCHEMA,
      components,
      WUR_CITATIONS_KEY_MAP
    )
  )
}

/**
 * Generates the Swagger YAML `components/schemas/WURMetrics
 *
 * @param {Cols} cols
 * @param {Rows} rows
 * @returns {string}
 */
function toWURMetricsComponentSchema (cols, rows) {
  const column = getDataSetNameColumn(cols)

  const dataSet = (
    getDataSet(
      column,
      WUR_METRICS_DATASET_NAME,
      rows
    )
  )

  const components = (
    transformFromDataSetToComponents(
      cols,
      dataSet
    )
  )

  return (
    toComponentSchema(
      WUR_METRICS_COMPONENT_SCHEMA,
      components,
      WUR_METRICS_KEY_MAP
    )
  )
}

/**
 * Generates the Swagger YAML `components/schemas/WURIDMapping
 *
 * @param {Cols} cols
 * @param {Rows} rows
 * @returns {string}
 */
function toWURIDMappingComponentSchema (cols, rows) {
  const column = getDataSetNameColumn(cols)

  const dataSet = (
    getDataSet(
      column,
      WUR_ID_MAPPING_DATASET_NAME,
      rows
    )
  )

  const components = (
    transformFromDataSetToComponents(
      cols,
      dataSet
    )
  )

  return (
    toComponentSchema(
      WUR_ID_MAPPING_COMPONENT_SCHEMA,
      components,
      WUR_ID_MAPPING_KEY_MAP
    )
  )
}

/**
 * Generates the Swagger YAML `components/schemas/WURRefData`
 *
 * @param {Cols} cols
 * @param {Rows} rows
 * @returns {string}
 */
function toWURRefDataComponentSchema (cols, rows) {
  const column = getDataSetNameColumn(cols)

  const dataSet = (
    getDataSet(
      column,
      WUR_REF_DATA_DATASET_NAME,
      rows
    )
  )

  const components = (
    transformFromDataSetToComponents(
      cols,
      dataSet
    )
  )

  return (
    toComponentSchema(
      WUR_REF_DATA_COMPONENT_SCHEMA,
      components,
      WUR_REF_DATA_KEY_MAP
    )
  )
}

/**
 * Generates the Swagger YAML `paths`
 *
 * @param {Cols} cols
 * @param {Rows} rows
 * @returns {string}
 */
function getPaths (cols, rows) {
  return [
    (hasImpactOverallDataSet(cols, rows) && normalise(IMPACT_OVERALL_PATH)),
    (hasWURPortalDataSet(cols, rows) && normalise(WUR_PORTAL_PATH)),
    (hasWURCitationsDataSet(cols, rows) && normalise(WUR_CITATIONS_PATH)),
    (hasWURMetricsDataSet(cols, rows) && normalise(WUR_METRICS_PATH)),
    (hasWURIDMappingDataSet(cols, rows) && normalise(WUR_ID_MAPPING_PATH)),
    (hasWURRefDataDataSet(cols, rows) && normalise(WUR_REF_DATA_PATH))
  ].filter(Boolean).join(String.fromCharCode(10))
}

/**
 * Generates the Swagger YAML `components/schemas`
 *
 * @param {Cols} cols
 * @param {Rows} rows
 * @returns {string}
 */
function getComponentsSchemas (cols, rows) {
  return [
    (hasImpactOverallDataSet(cols, rows) && normalise(toImpactOverallComponentSchema(cols, rows))),
    (hasWURPortalDataSet(cols, rows) && normalise(toWURPortalComponentSchema(cols, rows))),
    (hasWURCitationsDataSet(cols, rows) && normalise(toWURCitationsComponentSchema(cols, rows))),
    (hasWURMetricsDataSet(cols, rows) && normalise(toWURMetricsComponentSchema(cols, rows))),
    (hasWURIDMappingDataSet(cols, rows) && normalise(toWURIDMappingComponentSchema(cols, rows))),
    (hasWURRefDataDataSet(cols, rows) && normalise(toWURRefDataComponentSchema(cols, rows)))
  ].filter(Boolean).join(String.fromCharCode(10))
}

/**
 * Generates the Swagger YAML `responses`
 *
 * @param {Cols} cols
 * @param {Rows} rows
 * @returns {string}
 */
function getResponses (cols, rows) {
  return [
    (hasImpactOverallDataSet(cols, rows) && normalise(IMPACT_OVERALL_RESPONSE)),
    (hasWURPortalDataSet(cols, rows) && normalise(WUR_PORTAL_RESPONSE)),
    (hasWURCitationsDataSet(cols, rows) && normalise(WUR_CITATIONS_RESPONSE)),
    (hasWURMetricsDataSet(cols, rows) && normalise(WUR_METRICS_RESPONSE)),
    (hasWURIDMappingDataSet(cols, rows) && normalise(WUR_ID_MAPPING_RESPONSE)),
    (hasWURRefDataDataSet(cols, rows) && normalise(WUR_REF_DATA_RESPONSE))
  ].filter(Boolean).join(String.fromCharCode(10))
}

/**
 * Transform from XLSX to YAML
 *
 * @param {{name: string, data: unknown[]}[]}
 * @returns {string}
 */
export default function transformFromXlsxToYaml ([
  {
    data: [
      head,
      ...rows
    ]
  }
]) {
  const dataSetNameColumn = head.findIndex((item) => item.toLowerCase() === 'dataset name')
  const fieldColumn = head.findIndex((item) => item.toLowerCase() === 'field')
  const typeColumn = head.findIndex((item) => item.toLowerCase() === 'type')

  const cols = {
    dataSetNameColumn,
    fieldColumn,
    typeColumn
  }

  return normalise(`
openapi: 3.0.0
info:
  description: THE datasets in JSON format
  version: "1.0.0"
  title: Indonesia API
tags:
  - name: authorised
    description: Authorised requests
paths:
${getPaths(cols, rows)}
components:
  securitySchemes:
    BasicAuth:
      type: http
      scheme: basic
  schemas:
    InstitutionQuery:
      type: string
      pattern: '^i-\\d{8}$'
    YearQuery:
      type: integer
      format: int32
      minimum: 2001
      maximum: 2023
    SubjectQuery:
      type: string
    Institution:
      type: string
      pattern: '^i-\\d{8}$'
      example: 'i-12345678'
    Year:
      type: string
      pattern: '^\\d{4}'
      example: '2001'
    Subject:
      type: string
      example: 'Engineering and Technology'
    Numeric:
      type: string
      pattern: '^\\d+\\.\\d+$'
      example: '0.0'
    Text:
      type: string
${getComponentsSchemas(cols, rows)}
    NotFound:
      type: object
      required:
        - status
        - message
      properties:
        status:
          type: number
          const: 404
        message:
          type: string
          const: 'Not Found'
    UnprocessableContent:
      type: object
      required:
        - status
        - message
      properties:
        status:
          type: number
          const: 422
        message:
          type: string
          const: 'Unprocessable Content'
  responses:
${getResponses(cols, rows)}
    Unauthorized:
      description: Authorisation credentials are missing or invalid
      headers:
        WWW_Authenticate:
          schema:
            type: string
    NotFound:
      description: Invalid path (dataset unavailable)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/NotFound'
    UnprocessableContent:
      description: Invalid query parameter
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/UnprocessableContent'
security:
  - BasicAuth: []
`).concat(String.fromCodePoint(10))
}
