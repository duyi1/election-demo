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

export function validateHKID(hkid: string): boolean {
  // 验证香港身份证格式: 字母+6位数字+(1位数字)
  const hkidPattern = /^[A-Z]{1}[0-9]{6}\([0-9]{1}\)$/;
  return hkidPattern.test(hkid);
}