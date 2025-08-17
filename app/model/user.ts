export interface User {
  id: number;
  email: string;
  hkid: string;
  hasVoted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class UserImpl implements User {
  id: number;
  email: string;
  hkid: string;
  hasVoted: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<User>) {
    this.id = data.id || 0;
    this.email = data.email || '';
    this.hkid = data.hkid || '';
    this.hasVoted = data.hasVoted || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}