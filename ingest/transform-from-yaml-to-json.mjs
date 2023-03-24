
import YAML from 'yaml'

/**
 * Transform from YAML to JSON
 *
 * @param {string} yaml
 * @returns {string}
 */
export default function transformFromYamlToJson (yaml) {
  return (
    JSON.stringify(YAML.parse(yaml))
  )
}
