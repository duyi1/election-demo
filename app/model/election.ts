import { ElectionStatus } from "../lib/enum";

export interface Election {
  id: number;
  status: ElectionStatus;
  startTime?: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class ElectionImpl implements Election {
  id: number;
  status: ElectionStatus;
  startTime?: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Election>) {
    this.id = data.id || 0;
    this.status = data.status || ElectionStatus.PREPARE;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}