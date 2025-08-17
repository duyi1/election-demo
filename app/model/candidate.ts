export interface Candidate {
  id: number;
  name: string;
  electionId: number;
  voteCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CandidateImpl implements Candidate {
  id: number;
  name: string;
  electionId: number;
  voteCount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Candidate>) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.electionId = data.electionId || 0;
    this.voteCount = data.voteCount || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}