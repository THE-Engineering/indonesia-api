import args from './args.mjs'

export const AWS_REGION = args.get('AWS_REGION')
export const AWS_BUCKET_NAME = args.get('AWS_BUCKET_NAME')
export const AWS_QUEUE_URL = args.get('AWS_QUEUE_URL')

export const BASIC_AUTH_USERS = args.get('BASIC_AUTH_USERS')
export const PORT = args.get('PORT')
