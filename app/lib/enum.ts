export const enum CacheKey {
  CODE_INFO = 'DOWNLOAD_ASSISTANT:CODE_INFO',
  CODE_TOKEN = 'DOWNLOAD_ASSISTANT:CODE_TOKEN',
  RESOURCE_ENCRYPTED_INFO = 'DOWNLOAD_ASSISTANT:RESOURCE_ENCRYPTED_INFO',
  NODE_INFO = 'DOWNLOAD_ASSISTANT:NODE_INFO',
  QUQI_DB = 'DOWNLOAD_ASSISTANT:QUQI_DB',
  NODE_LIST = 'DOWNLOAD_ASSISTANT:NODE_LIST',
}

export const enum CacheTTL {
  CODE_INFO = 3600 * 24 * 2,
  CODE_TOKEN = 3600 * 12,
  RESOURCE_ENCRYPTED_INFO = 7200,
  NODE_INFO = 7200,
  QUQI_DB = 3600 * 24,
}

export const enum ExpireTime {
  ACCESS_CODE = 3600 * 24 * 180,
  CODE_TOKEN = 3600 * 12,
  DOWNLOAD_URL = 7200,
}

export const enum TableName {
  ACCESS_CODE = 'access_code',
  CDN_INFO = 'cdn_info',
  SYS_SERVICE = 'sys_service',
  TREE_NODE = 'tree_node',
  TREE_VERSION = 'tree_doc_version',
}

export const enum ElectionStatus {
  PREPARE = 0,
  STARTED = 1,
  ENDED = 2,
}

