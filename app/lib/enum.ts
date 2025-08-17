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

export const enum AuthMode {
  GROUP_AUTH = 1,
  PARENT_AUTH = 2,
  NODES_AUTH = 3,
}

export const enum DocType {
  Q_DEFAULT = 0,
  IMG_STREAM,   // 图片图片流文件
  IMG_OTHER_STREAM,   // 非图片转化的图片流文件
  // 不需转换可直接预览图片
  IMG_JPEG = 11,
  IMG_PNG,
  IMG_WEBP,
  IMG_GIF,
  IMG_BMP,
  IMG_SVG,
  IMG_ICO,
  IMG_CUR,
  // 需转换可预览图片
  IMG_HEIC = 26,
  IMG_TIF,
  IMG_TGA,
  IMG_PS,
  IMG_AI,
  IMG_EPS,
  IMG_WMF,
  IMG_RAW,
  // 不可预览图片
  IMG_SKETCH = 41,
  IMG_CDR,
  IMG_OTHER,
  // 可转码预览视频
  VIDEO_3GP = 51,
  VIDEO_ASF,
  VIDEO_AVI,
  VIDEO_FLASH,
  VIDEO_MKV,
  VIDEO_MP4,
  VIDEO_MOV,
  VIDEO_RM,
  VIDEO_MPG,
  VIDEO_M4V,
  VIDEO_WEBM,
  VIDEO_WMV,
  VIDEO_VOB,
  VIDEO_DAT,
  // 不可转码播放视频
  VIDEO_SUB = 80,
  VIDEO_LIST,
  VIDEO_TS,
  VIDEO_KUX,
  VIDEO_VIV,
  VIDEO_QSV,
  VIDEO_MTS,
  VIDEO_PRPROJ,
  VIDEO_AEP,
  VIDEO_AVD,
  VIDEO_VDAT,
  VIDEO_OTHER,
  // 音频文件
  AUDIO_MP3 = 101,
  AUDIO_WAV,
  AUDIO_FLAC,
  AUDIO_AMR,
  AUDIO_M4A,
  AUDIO_AAC,
  AUDIO_WMA,
  AUDIO_OGG,
  AUDIO_APE,
  AUDIO_OVE,
  AUDIO_MID,
  AUDIO_PCM,
  AUDIO_CDA,
  AUDIO_PEK,
  AUDIO_DFC,
  AUDIO_STY,
  AUDIO_RAM,
  AUDIO_PKF,
  AUDIO_3GA,
  AUDIO_MV,
  AUDIO_OTHER,
  // 可预览文本文件
  T_QUQI = 151, //曲奇文档
  T_QUQIMARKDOWN,   //曲奇markdown
  T_QUQIXMIND,   //曲奇xmind
  T_WORD,
  T_TXT,
  T_LOG,
  T_ERR,
  T_LST,
  // 不可预览文本文件
  T_WPS = 176,
  T_PAGES,
  T_RTF,
  T_MD,
  T_TEX,
  T_LRC,
  T_OTHER,
  // 可预览表格
  TABLE_QUQI = 201,   //曲奇表格
  TABLE_EXCEL,
  TABLE_CSV,
  // 不可预览表格
  TABLE_ET = 226,
  TABLE_NUMBERS,
  TABLE_OTHER,
  // 可预览演示文档
  PT_PPT = 251,
  // 不可预览演示文档
  PT_KEYNOTE = 276,
  PT_DPS,
  // 可预览电子书
  EB_PDF = 301,
  // 不可预览电子书
  EB_EPUB = 326,
  EB_MOBI,
  EB_AZW,
  EB_AZW3,
  EB_CHM,
  EB_CAJ,
  EB_PDG,
  EB_DJVU,
  EB_CEB,
  EB_PUB,
  EB_LRF,
  EB_UMD,
  EB_OTHER,
  R_RAR = 351,
}

export const enum BroadDocType  {
  QUQI_DOC = 'wiki',
  WORD = 'word',
  PPT = 'ppt',
  PDF = 'pdf',
  VIDEO = 'video',
  SHEET = 'sheet',
  AUDIO = 'audio',
  IMAGE = 'img',
  OTHRT = 'other',
}