// app/service/user/auth_service.ts
import { Service } from 'egg';

export default class UserAuthService extends Service {
  /**
   * 用户注册
   */
  public async register(email: string, hkid: string): Promise<any> {
    // 验证邮箱格式
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: '邮箱格式不正确' };
    }

    // 验证香港身份证格式
    const hkidRegex = /^[A-Z]{1}[0-9]{6}\([0-9]{1}\)$/;
    if (!hkidRegex.test(hkid)) {
      return { success: false, message: '香港身份证格式不正确，格式如:A123456(7)' };
    }

    // 检查邮箱是否已注册
    const existingUserByEmail = await this.ctx.app.repository.user.findByEmail(email);
    if (existingUserByEmail) {
      return { success: false, message: '邮箱已被注册' };
    }

    // 检查身份证是否已注册
    const existingUserByHKID = await this.ctx.app.repository.user.findByHKID(hkid);
    if (existingUserByHKID) {
      return { success: false, message: '该身份证已被注册' };
    }

    // 创建用户
    const user = await this.ctx.app.repository.user.create(email, hkid);
    
    return { 
        id: user.id,
        email: user.email,
        hkid: user.hkid
      };
  }
}