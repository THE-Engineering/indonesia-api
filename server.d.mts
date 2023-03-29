declare module '#config' {
  type BasicAuth = import('#config/defaults').BasicAuth

  export const AWS_REGION: string
  export const AWS_BUCKET_NAME: string
  export const AWS_QUEUE_URL: string
  export const BASIC_AUTH_USERS: BasicAuth
  export const PORT: number
}

declare module '#config/args' {
  type BasicAuth = import('#config/defaults').BasicAuth

  export interface Args {
    XLSX_DIRECTORY: string;
    SOURCE_DIRECTORY: string;
    TARGET_DIRECTORY: string;
    DATA_MODEL_FILE_NAME: string;
    SWAGGER_YAML_FILE_PATH: string;
    SWAGGER_JSON_FILE_PATH: string;
    IMPACT_OVERALL_DATASET_NAME: string;
    WUR_PORTAL_DATASET_NAME: string;
    WUR_CITATIONS_DATASET_NAME: string;
    WUR_METRICS_DATASET_NAME: string;
    WUR_ID_MAPPING_DATASET_NAME: string;
    WUR_REF_DATA_DATASET_NAME: string;
    IMPACT_OVERALL_COMPONENT_SCHEMA: string;
    WUR_PORTAL_COMPONENT_SCHEMA: string;
    WUR_CITATIONS_COMPONENT_SCHEMA: string;
    WUR_METRICS_COMPONENT_SCHEMA: string;
    WUR_ID_MAPPING_COMPONENT_SCHEMA: string;
    WUR_REF_DATA_COMPONENT_SCHEMA: string;
    IMPACT_OVERALL_LABEL: string;
    WUR_PORTAL_LABEL: string;
    WUR_CITATIONS_LABEL: string;
    WUR_METRICS_LABEL: string;
    WUR_ID_MAPPING_LABEL: string;
    WUR_REF_DATA_LABEL: string;
    IMPACT_OVERALL_FILE_NAME: string;
    WUR_PORTAL_FILE_NAME: string;
    WUR_CITATIONS_FILE_NAME: string;
    WUR_METRICS_FILE_NAME: string;
    WUR_ID_MAPPING_FILE_NAME: string;
    WUR_REF_DATA_FILE_NAME: string;
    SCHEMA_MIN_YEAR: number;
    SCHEMA_MAX_YEAR: number;
    BASIC_AUTH_USERS: BasicAuth;
    PORT: number;
  }

  export type ArgsMap = Map<string, (string | number | BasicAuth)>

  export const args: Args

  const argsMap: ArgsMap

  export default argsMap
}

declare module '#config/data-model' {
  export interface KeyMap {
    [key: string]: 'institution_id' | 'year' | 'subject_id';
  }

  export const XLSX_DIRECTORY: string
  export const DATA_MODEL_FILE_NAME: string
  export const DATA_MODEL_FILE_PATH: string
  export const SWAGGER_YAML_FILE_PATH: string
  export const SWAGGER_JSON_FILE_PATH: string
  export const IMPACT_OVERALL_DATASET_NAME: string
  export const WUR_PORTAL_DATASET_NAME: string
  export const WUR_CITATIONS_DATASET_NAME: string
  export const WUR_METRICS_DATASET_NAME: string
  export const WUR_ID_MAPPING_DATASET_NAME: string
  export const WUR_REF_DATA_DATASET_NAME: string
  export const IMPACT_OVERALL_COMPONENT_SCHEMA: string
  export const WUR_PORTAL_COMPONENT_SCHEMA: string
  export const WUR_CITATIONS_COMPONENT_SCHEMA: string
  export const WUR_METRICS_COMPONENT_SCHEMA: string
  export const WUR_ID_MAPPING_COMPONENT_SCHEMA: string
  export const WUR_REF_DATA_COMPONENT_SCHEMA: string
  export const IMPACT_OVERALL_LABEL: string
  export const WUR_PORTAL_LABEL: string
  export const WUR_CITATIONS_LABEL: string
  export const WUR_METRICS_LABEL: string
  export const WUR_ID_MAPPING_LABEL: string
  export const WUR_REF_DATA_LABEL: string
  export const IMPACT_OVERALL_KEY_MAP: KeyMap
  export const WUR_PORTAL_KEY_MAP: KeyMap
  export const WUR_CITATIONS_KEY_MAP: KeyMap
  export const WUR_METRICS_KEY_MAP: KeyMap
  export const WUR_ID_MAPPING_KEY_MAP: KeyMap
  export const WUR_REF_DATA_KEY_MAP: KeyMap
}

declare module '#config/data' {
  export interface KeyMap {
    institution_id?: string;
    year?: string;
    subject_id?: string;
  }

  export const SOURCE_DIRECTORY: string
  export const TARGET_DIRECTORY: string
  export const IMPACT_OVERALL_FILE_NAME: string
  export const IMPACT_OVERALL_FILE_PATH: string
  export const WUR_PORTAL_FILE_NAME: string
  export const WUR_PORTAL_FILE_PATH: string
  export const WUR_CITATIONS_FILE_NAME: string
  export const WUR_CITATIONS_FILE_PATH: string
  export const WUR_METRICS_FILE_NAME: string
  export const WUR_METRICS_FILE_PATH: string
  export const WUR_ID_MAPPING_FILE_NAME: string
  export const WUR_ID_MAPPING_FILE_PATH: string
  export const WUR_REF_DATA_FILE_NAME: string
  export const WUR_REF_DATA_FILE_PATH: string
  export const IMPACT_OVERALL_KEY_MAP: KeyMap
  export const WUR_PORTAL_KEY_MAP: KeyMap
  export const WUR_CITATIONS_KEY_MAP: KeyMap
  export const WUR_METRICS_KEY_MAP: KeyMap
  export const WUR_ID_MAPPING_KEY_MAP: KeyMap
  export const WUR_REF_DATA_KEY_MAP: KeyMap
}

declare module '#config/defaults' {
  export interface BasicAuth {
    username?: string;
    password?: string;
  }

  export const DEFAULT_XLSX_DIRECTORY: string
  export const DEFAULT_SOURCE_DIRECTORY: string
  export const DEFAULT_TARGET_DIRECTORY: string
  export const DEFAULT_DATA_MODEL_FILE_NAME: string
  export const DEFAULT_SWAGGER_YAML_FILE_PATH: string
  export const DEFAULT_SWAGGER_JSON_FILE_PATH: string
  export const DEFAULT_IMPACT_OVERALL_DATASET_NAME: string
  export const DEFAULT_WUR_PORTAL_DATASET_NAME: string
  export const DEFAULT_WUR_CITATIONS_DATASET_NAME: string
  export const DEFAULT_WUR_METRICS_DATASET_NAME: string
  export const DEFAULT_WUR_ID_MAPPING_DATASET_NAME: string
  export const DEFAULT_WUR_REF_DATA_DATASET_NAME: string
  export const DEFAULT_IMPACT_OVERALL_COMPONENT_SCHEMA: string
  export const DEFAULT_WUR_PORTAL_COMPONENT_SCHEMA: string
  export const DEFAULT_WUR_CITATIONS_COMPONENT_SCHEMA: string
  export const DEFAULT_WUR_METRICS_COMPONENT_SCHEMA: string
  export const DEFAULT_WUR_ID_MAPPING_COMPONENT_SCHEMA: string
  export const DEFAULT_WUR_REF_DATA_COMPONENT_SCHEMA: string
  export const DEFAULT_IMPACT_OVERALL_LABEL: string
  export const DEFAULT_WUR_PORTAL_LABEL: string
  export const DEFAULT_WUR_CITATIONS_LABEL: string
  export const DEFAULT_WUR_METRICS_LABEL: string
  export const DEFAULT_WUR_ID_MAPPING_LABEL: string
  export const DEFAULT_WUR_REF_DATA_LABEL: string
  export const DEFAULT_IMPACT_OVERALL_FILE_NAME: string
  export const DEFAULT_WUR_PORTAL_FILE_NAME: string
  export const DEFAULT_WUR_CITATIONS_FILE_NAME: string
  export const DEFAULT_WUR_METRICS_FILE_NAME: string
  export const DEFAULT_WUR_ID_MAPPING_FILE_NAME: string
  export const DEFAULT_WUR_REF_DATA_FILE_NAME: string
  export const DEFAULT_SCHEMA_MIN_YEAR: number
  export const DEFAULT_SCHEMA_MAX_YEAR: number
  export const DEFAULT_PORT: number
}

declare module '#config/schema' {
  export const SCHEMA_INSTITUTION_ID: RegExp
  export const SCHEMA_MIN_YEAR: number
  export const SCHEMA_MAX_YEAR: number
}

declare module '#ingest/data-model' {
  type FSWatcher = import('chokidar').FSWatcher

  export default async function ingestDataModel(): Promise<FSWatcher>
}

declare module '#ingest/data' {
  type FSWatcher = import('chokidar').FSWatcher

  export default async function ingestData(): Promise<FSWatcher>
}

declare module '#ingest/from-queue' {
  export async function run(): Promise<void>

  export default function ingestFromQueue(): void
}

declare module '#ingest/transform-from-csv-to-json' {
  export default async function transformFromCsvToJson (sourcePath: string, targetPath: string): Promise<string>
}

declare module '#ingest/transform-from-xlsx-to-yaml' {
  export default function transformFromXlsxToYaml(xlsx: Buffer | string): string
}

declare module '#ingest/transform-from-yaml-to-json' {
  export default function transformFromYamlToJson(yaml: string): string
}

declare module '#server/common' {
  export interface CommonError {
    status: number;
    message: string;
  }

  export const NOT_FOUND: CommonError
  export const UNPROCESSABLE_CONTENT: CommonError
}

declare module '#server/middleware/get-file-data-middleware' {
  export interface KeyMap {
    institution_id?: string;
    year?: string;
    subject_id?: string;
  }

  export interface RequestQuery {
    institution_id?: string;
    year?: string;
    subject_id?: string;
  }

  export interface ResponseLocals {
    filePath?: string;
  }

  type ExpressRequest = import('express').Request<{}, {}, {}, RequestQuery, {}>
  type ExpressResponse = import('express').Response<{}, ResponseLocals>
  type NextFunction = import('express').NextFunction

  export type Middleware = (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => void

  export default function getFileDataMiddleware(fromPath: string, keyMap: KeyMap): Middleware
}

declare module '#server/middleware/get-file-path-middleware' {
  export interface RequestQuery {
    institution_id?: string;
    year?: string;
    subject_id?: string;
  }

  export interface ResponseLocals {
    filePath?: string;
  }

  type ExpressRequest = import('express').Request<{}, {}, {}, RequestQuery, {}>
  type ExpressResponse = import('express').Response<{}, ResponseLocals>
  type NextFunction = import('express').NextFunction

  export type Middleware = (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => void

  export default function getFilePathMiddleware(fromPath: string): Middleware
}

declare module '#server/middleware/get-has-file-path-middleware' {
  type ExpressRequest = import('express').Request<{}, {}, {}, {}, {}>
  type ExpressResponse = import('express').Response<{}, {}>
  type NextFunction = import('express').NextFunction

  export type Middleware = (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => void

  export default function getHasFilePathMiddleware(fromPath: string): Middleware
}

declare module '#server/middleware/get-schema-middleware' {
  type ExpressRequest = import('express').Request<{}, {}, {}, {}, {}>
  type ExpressResponse = import('express').Response<{}, {}>
  type NextFunction = import('express').NextFunction
  type ObjectSchema = import('joi').ObjectSchema

  export type Middleware = (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => void

  export default function getSchemaMiddleware (schema: ObjectSchema): Middleware
}

declare module '#server/render-route' {
  export interface ResponseLocals {
    filePath: string
  }

  type ExpressRequest = import('express').Request
  type ExpressResponse = import('express').Response<{}, ResponseLocals>

  export default function renderRoute(req: ExpressRequest, res: ExpressResponse): void
}

declare module '#utils/dispatch-sqs-delete-message' {
  type Message = import('@aws-sdk/client-sqs').Message

  export default async function dispatchSQSDeleteMessage(message: Message): Promise<void>
}

declare module '#utils/gen-s3' {
  export interface S3 {
    configurationId: string;
    object?: {key: string}
  }

  type Message = import('@aws-sdk/client-sqs').Message

  export default function genS3(message: Message): void
}

declare module '#utils/gen-sqs-receieve-message' {
  export default async function genSQSReceiveMessage(): Promise<void>
}

declare module '#utils/get-s3-object' {
  export default async function getS3Object(key: string): Promise<Buffer>
}

declare module '#utils/get-s3-objects' {
  type ListObjectsCommandOutput = import('@aws-sdk/client-s3/dist-types/commands').ListObjectsCommandOutput

  export default async function getS3Objects(): Promise<ListObjectsCommandOutput>
}

declare module '#utils/handle-error' {
  export default function handleError (e: Error): void
}

declare module '#utils/handle-file-path-error' {
  export default function handleFilePathError (e: Error): void
}

declare module '#utils/to-json-file-path' {
  export default function toJsonFilePath (fromPath: string, toPath: string): string
}

declare module '#utils/to-query-file-path' {
  export default function toQueryFilePath (filePath: string, queryValue: string): string
}
