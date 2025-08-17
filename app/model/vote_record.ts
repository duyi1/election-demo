export interface VoteRecord {
  id: number;
  userId: number;
  candidateId: number;
  electionId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class VoteRecordImpl implements VoteRecord {
  id: number;
  userId: number;
  candidateId: number;
  electionId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<VoteRecord>) {
    this.id = data.id || 0;
    this.userId = data.userId || 0;
    this.candidateId = data.candidateId || 0;
    this.electionId = data.electionId || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}