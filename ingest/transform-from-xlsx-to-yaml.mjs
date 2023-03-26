/**
 * @module #ingest/transform-xlsx-to-yaml
 */

/**
 * Params
 *
 * @typedef {Object} Params
 * @property {boolean} hasImpactOverall
 * @property {boolean} hasWURPortal
 * @property {boolean} hasWURCitations
 * @property {boolean} hasWURMetrics
 * @property {boolean} hasWURIDMapping
 * @property {boolean} hasWURRefData
 */

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
 * Property
 *
 * @typedef {string[]} Property
 */

/**
 * Properties
 *
 * @typedef {Property[]} Properties
 */

/**
 * KeyMap
 *
 * @typedef {Object.<string, string>} KeyMap
 */

/**
 * IsDataSet filter
 *
 * @typedef {({ [column]: name }: {}) => boolean} IsDataSet
 */

import XLSX from 'node-xlsx'

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
          description: An optional query parameter for filtering on institution
          required: false
          schema:
            $ref: '#/components/schemas/InstitutionQuery'
        - in: query
          name: year
          description: An optional query parameter for filtering on year
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
          description: An optional query parameter for filtering on institution
          required: false
          schema:
            $ref: '#/components/schemas/InstitutionQuery'
        - in: query
          name: year
          description: An optional query parameter for filtering on year
          required: false
          schema:
            $ref: '#/components/schemas/YearQuery'
        - in: query
          name: subject_id
          description: An optional query parameter for filtering on subject
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
          description: An optional query parameter for filtering on institution
          required: false
          schema:
            $ref: '#/components/schemas/InstitutionQuery'
        - in: query
          name: year
          description: An optional query parameter for filtering on year
          required: false
          schema:
            $ref: '#/components/schemas/YearQuery'
        - in: query
          name: subject_id
          description: An optional query parameter for filtering on subject
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
          description: An optional query parameter for filtering on institution
          required: false
          schema:
            $ref: '#/components/schemas/InstitutionQuery'
        - in: query
          name: year
          description: An optional query parameter for filtering on year
          required: false
          schema:
            $ref: '#/components/schemas/YearQuery'
        - in: query
          name: subject_id
          description: An optional query parameter for filtering on subject
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
          description: An optional query parameter for filtering on institution
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
          description: An optional query parameter for filtering on institution
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
 * @param {string} s - The line
 * @returns {string} The line
 */
function normalise (s) {
  return s.replace(/^\n+/, '').replace(/\n+$/, '')
}

/**
 * Destructures and returns the `dataSetNameColumn` column index
 *
 * @param {Cols} - XLSX worksheet columns descriptor
 * @returns {number} The `dataSetNameColumn` column index
 */
function getDataSetNameColumn ({ dataSetNameColumn }) {
  return dataSetNameColumn
}

/**
 * Destructures and returns the `fieldColumn` column index
 *
 * @param {Cols} - XLSX worksheet columns descriptor
 * @returns {number} The `fieldColumn` column index
 */
function getFieldColumn ({ fieldColumn }) {
  return fieldColumn
}

/**
 * Destructures and returns the `typeColumn` column index
 *
 * @param {Cols} - XLSX worksheet columns descriptor
 * @returns {number} The `typeColumn` column index
 */
function getTypeColumn ({ typeColumn }) {
  return typeColumn
}

/**
 * Generates the component schema `$ref`
 *
 * @param {KeyMap} keyMap - Describes the mapping of dataset values to request query parameters
 * @param {string} field - The field name
 * @param {string} type - The field type
 * @returns {string} YAML component schema `$ref`
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
 * @param {Component[]} components - The component descriptors
 * @returns {string[]} An array of `required` strings
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
 * @param {Component[]} components - The component descriptors
 * @param {KeyMap} keyMap - Describes the mapping of dataset values to request query parameters
 * @returns {Property[]} An array of `properties` arrays of strings
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
 * @param {string[]} required - The array of `required` strings
 * @param {number} keyStart - Indentation start position
 * @returns {string} YAML `required`
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
 * @param {Property[]} properties - The array `properties` arrays of strings
 * @param {number} keyStart - Indentation start position
 * @returns {string} YAML `properties`
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
 * @param {number} column - The column index
 * @param {string} name - The dataset name
 * @returns {IsDataSet} A filter
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
 * @param {number} column - The column index
 * @param {string} name - The dataset name
 * @param {Rows} rows - XLSX worksheet rows
 * @returns {boolean} Whether the dataset matching the dataset name is present
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
 * @param {number} column - The column index
 * @param {string} name - The dataset name
 * @param {Rows} rows - XLSX worksheet rows
 * @returns {Rows} XLSX worksheet rows matching the dataset name
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
 * @param {number} fieldColumn - A column index
 * @param {number} typeColumn - A column index
 * @param {Row} - An XLSX worksheet row
 * @returns {Component} A component descriptor
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
 * @param {Cols} cols - XLSX worksheet columns descriptor
 * @param {Rows} rows - XLSX worksheet rows
 * @returns {Component[]} An array of component descriptors
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
 * Interrogates `cols` and `rows` to determine whether the `Impact Overall` dataset
 * is present
 *
 * @param {Cols} cols - XLSX worksheet columns descriptor
 * @param {Rows} rows - XLSX worksheet rows
 * @returns {boolean} Whether the `Impact Overall` dataset is present
 */
function hasImpactOverallDataSet (cols, rows) {
  return (
    hasDataSet(getDataSetNameColumn(cols), IMPACT_OVERALL_DATASET_NAME, rows)
  )
}

/**
 * Interrogates `cols` and `rows` to determine whether the `WUR Portal` dataset
 * is present
 *
 * @param {Cols} cols - XLSX worksheet columns descriptor
 * @param {Rows} rows - XLSX worksheet rows
 * @returns {boolean} Whether the `WUR Portal` dataset is present
 */
function hasWURPortalDataSet (cols, rows) {
  return (
    hasDataSet(getDataSetNameColumn(cols), WUR_PORTAL_DATASET_NAME, rows)
  )
}

/**
 * Interrogates `cols` and `rows` to determine whether the `WUR Citatations` dataset
 * is present
 *
 * @param {Cols} cols - XLSX worksheet columns descriptor
 * @param {Rows} rows - XLSX worksheet rows
 * @returns {boolean} Whether the `WUR Citatations` dataset is present
 */
function hasWURCitationsDataSet (cols, rows) {
  return (
    hasDataSet(getDataSetNameColumn(cols), WUR_CITATIONS_DATASET_NAME, rows)
  )
}

/**
 * Interrogates `cols` and `rows` to determine whether the `WUR Metrics` dataset
 * is present
 *
 * @param {Cols} cols - XLSX worksheet columns descriptor
 * @param {Rows} rows - XLSX worksheet rows
 * @returns {boolean} Whether the `WUR Metrics` dataset is present
 */
function hasWURMetricsDataSet (cols, rows) {
  return (
    hasDataSet(getDataSetNameColumn(cols), WUR_METRICS_DATASET_NAME, rows)
  )
}

/**
 * Interrogates `cols` and `rows` to determine whether the `WUR ID Mapping` dataset
 * is present
 *
 * @param {Cols} cols - XLSX worksheet columns descriptor
 * @param {Rows} rows - XLSX worksheet rows
 * @returns {boolean} Whether the `WUR ID Mapping` dataset is present
 */
function hasWURIDMappingDataSet (cols, rows) {
  return (
    hasDataSet(getDataSetNameColumn(cols), WUR_ID_MAPPING_DATASET_NAME, rows)
  )
}

/**
 * Interrogates `cols` and `rows` to determine whether the `WUR Ref Data` dataset
 * is present
 *
 * @param {Cols} cols - XLSX worksheet columns descriptor
 * @param {Rows} rows - XLSX worksheet rows
 * @returns {boolean} Whether the `WUR Ref Data` dataset is present
 */
function hasWURRefDataDataSet (cols, rows) {
  return (
    hasDataSet(getDataSetNameColumn(cols), WUR_REF_DATA_DATASET_NAME, rows)
  )
}

/**
 * Generates the Swagger YAML `components/schemas/${componentSchema}` definition
 *
 * @param {string} componentSchema - The component schema name
 * @param {Component[]} components - An array of components
 * @param {KeyMap} keyMap - Describes the mapping of dataset values to request query parameters
 * @returns {string} The Swagger YAML `components/schemas/${componentSchema}` definition
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
 * Generates the Swagger YAML `components/schemas/ImpactOverall` definition
 *
 * @param {Cols} cols - XLSX worksheet columns descriptor
 * @param {Rows} rows - XLSX worksheet rows
 * @returns {string} The Swagger YAML `components/schemas/ImpactOverall` definition
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
 * Generates the Swagger YAML `components/schemas/WURPortal` definition
 *
 * @param {Cols} cols - XLSX worksheet columns descriptor
 * @param {Rows} rows - XLSX worksheet rows
 * @returns {string} The Swagger YAML `components/schemas/WURPortal` definition
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
 * Generates the Swagger YAML `components/schemas/WURCitations` definition
 *
 * @param {Cols} cols - XLSX worksheet columns descriptor
 * @param {Rows} rows - XLSX worksheet rows
 * @returns {string} The Swagger YAML `components/schemas/WURCitations` definition
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
 * Generates the Swagger YAML `components/schemas/WURMetrics` definition
 *
 * @param {Cols} cols - XLSX worksheet columns descriptor
 * @param {Rows} rows - XLSX worksheet rows
 * @returns {string} The Swagger YAML `components/schemas/WURMetrics` definition
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
 * Generates the Swagger YAML `components/schemas/WURIDMapping` definition
 *
 * @param {Cols} cols - XLSX worksheet columns descriptor
 * @param {Rows} rows - XLSX worksheet rows
 * @returns {string} The Swagger YAML `components/schemas/WURIDMapping` definition
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
 * Generates the Swagger YAML `components/schemas/WURRefData` definition
 *
 * @param {Cols} cols - XLSX worksheet columns descriptor
 * @param {Rows} rows - XLSX worksheet rows
 * @returns {string} The Swagger YAML `components/schemas/WURRefData` definition
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
 * Generates the Swagger YAML `paths` definition
 *
 * @param {Params} - Describes which datasets are present
 * @returns {string} The Swagger YAML `paths` definition
 */
function getPaths ({
  hasImpactOverall,
  hasWURPortal,
  hasWURCitations,
  hasWURMetrics,
  hasWURIDMapping,
  hasWURRefData
}) {
  return [
    (hasImpactOverall && normalise(IMPACT_OVERALL_PATH)),
    (hasWURPortal && normalise(WUR_PORTAL_PATH)),
    (hasWURCitations && normalise(WUR_CITATIONS_PATH)),
    (hasWURMetrics && normalise(WUR_METRICS_PATH)),
    (hasWURIDMapping && normalise(WUR_ID_MAPPING_PATH)),
    (hasWURRefData && normalise(WUR_REF_DATA_PATH))
  ].filter(Boolean).join(String.fromCharCode(10))
}

/**
 * Generates the Swagger YAML `components/schemas` definition
 *
 * @param {Params} - Describes which datasets are present
 * @param {Cols} cols - XLSX worksheet columns descriptor
 * @param {Rows} rows - XLSX worksheet rows
 * @returns {string} The Swagger YAML `components/schemas` definition
 */
function getComponentsSchemas ({
  hasImpactOverall,
  hasWURPortal,
  hasWURCitations,
  hasWURMetrics,
  hasWURIDMapping,
  hasWURRefData
}, cols, rows) {
  return [
    (hasImpactOverall && normalise(toImpactOverallComponentSchema(cols, rows))),
    (hasWURPortal && normalise(toWURPortalComponentSchema(cols, rows))),
    (hasWURCitations && normalise(toWURCitationsComponentSchema(cols, rows))),
    (hasWURMetrics && normalise(toWURMetricsComponentSchema(cols, rows))),
    (hasWURIDMapping && normalise(toWURIDMappingComponentSchema(cols, rows))),
    (hasWURRefData && normalise(toWURRefDataComponentSchema(cols, rows)))
  ].filter(Boolean).join(String.fromCharCode(10))
}

/**
 * Generates the Swagger YAML `responses` definition
 *
 * @param {Params} - Describes which datasets are present
 * @returns {string} The Swagger YAML `responses` definition
 */
function getResponses ({
  hasImpactOverall,
  hasWURPortal,
  hasWURCitations,
  hasWURMetrics,
  hasWURIDMapping,
  hasWURRefData
}) {
  return [
    (hasImpactOverall && normalise(IMPACT_OVERALL_RESPONSE)),
    (hasWURPortal && normalise(WUR_PORTAL_RESPONSE)),
    (hasWURCitations && normalise(WUR_CITATIONS_RESPONSE)),
    (hasWURMetrics && normalise(WUR_METRICS_RESPONSE)),
    (hasWURIDMapping && normalise(WUR_ID_MAPPING_RESPONSE)),
    (hasWURRefData && normalise(WUR_REF_DATA_RESPONSE))
  ].filter(Boolean).join(String.fromCharCode(10))
}

/**
 * Transform from XLSX to YAML
 *
 * @param {Buffer|string} xlsx - The XLSX document
 * @returns {string} YAML
 */
export default function transformFromXlsxToYaml (xlsx) {
  const [
    {
      data: [
        head,
        ...rows
      ]
    }
  ] = XLSX.parse(xlsx)

  const dataSetNameColumn = head.findIndex((item) => item.toLowerCase() === 'dataset name')
  const fieldColumn = head.findIndex((item) => item.toLowerCase() === 'field')
  const typeColumn = head.findIndex((item) => item.toLowerCase() === 'type')

  const cols = {
    dataSetNameColumn,
    fieldColumn,
    typeColumn
  }

  const params = {
    hasImpactOverall: hasImpactOverallDataSet(cols, rows),
    hasWURPortal: hasWURPortalDataSet(cols, rows),
    hasWURCitations: hasWURCitationsDataSet(cols, rows),
    hasWURMetrics: hasWURMetricsDataSet(cols, rows),
    hasWURIDMapping: hasWURIDMappingDataSet(cols, rows),
    hasWURRefData: hasWURRefDataDataSet(cols, rows)
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
${getPaths(params)}
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
${getComponentsSchemas(params, cols, rows)}
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
${getResponses(params)}
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
