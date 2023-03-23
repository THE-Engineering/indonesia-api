
import YAML from 'yaml'

export default function transformFromYamlToJson (yaml) {
  return (
    JSON.stringify(YAML.parse(yaml))
  )
}
