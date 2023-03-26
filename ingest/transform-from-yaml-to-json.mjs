/**
 * @module #ingest/transform-from-yaml-to-json
 */

import YAML from 'yaml'

/**
 * Transform from YAML to JSON
 *
 * @param {string} yaml - The YAML document
 * @returns {string} JSON
 */
export default function transformFromYamlToJson (yaml) {
  return (
    JSON.stringify(YAML.parse(yaml))
  )
}
