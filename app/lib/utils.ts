import { BroadDocType, DocType } from './enum';

export function getMaxSize(sizeArray: number[]) {
  sizeArray.sort((a, b) => {
    return a - b;
  });
  return sizeArray[sizeArray.length - 1];
}

export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export function hashString(content: string, algorithm: string) {
  const crypto = require('crypto');
  const hash = crypto.createHash(algorithm);
  hash.update(content);
  return hash.digest('hex');
}

export function currentDataFormat(date: Date, fmt) {
  const o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'H+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
}

export function createRandomNum(digit: number) {
  const random = Math.floor((Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, digit - 1));
  return random;
}

export function createRandomString(length: number) {
  const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (var i = length; i > 0; --i) 
      result += str[Math.floor(Math.random() * str.length)];
  return result;
}

export function docTypeStringTransfer(docType: number) {
  if (docType >= DocType.IMG_JPEG && docType <= DocType.IMG_RAW) {
    return BroadDocType.IMAGE;
  }
  if (docType >= DocType.VIDEO_3GP && docType <= DocType.VIDEO_DAT) {
    return BroadDocType.VIDEO;
  }
  if (docType >= DocType.AUDIO_MP3 && docType <= DocType.AUDIO_MV) {
    return BroadDocType.AUDIO;
  }
  if (docType == DocType.T_QUQI) {
    return BroadDocType.QUQI_DOC;
  }
  if (docType == DocType.TABLE_EXCEL || docType == DocType.TABLE_QUQI) {
    return BroadDocType.SHEET;
  }
  if (docType == DocType.T_WORD) {
    return BroadDocType.WORD;
  }
  if (docType == DocType.PT_PPT) {
    return BroadDocType.PPT;
  }
  if (docType == DocType.EB_PDF) {
    return BroadDocType.PDF;
  }
  return BroadDocType.OTHRT;
}

export function getCosUrlDomianFromBucket(bucket: string) {
  const bucketDomianMap = {
    "demoquqicom-1253287318":"demodl1.quqi.com",
    "uploaddemo-1253287318":"demodl2.quqi.com",
    "quqicom-1253287318":"dl1.quqi.com",
    "upload-1253287318":"dl2.quqi.com"
  }
  return bucketDomianMap[bucket];
}