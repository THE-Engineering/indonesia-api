import {
  logError
} from '#config'

const {
  env: {
    NODE_ENV
  } = {}
} = process

export default function hasLogError () {
  return (
    NODE_ENV === 'production' ||
    logError
  )
}
