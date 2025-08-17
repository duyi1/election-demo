import UserRepository from '../repository/user';
import CandidateRepository from '../repository/candidate';
import ElectionRepository from '../repository/election';
import VoteRecordRepository from '../repository/vote_record';
import CacheRepository from '../repository/cache';

const app: any = {
   get repository() {
    return {
      user: this.getRepository(UserRepository),
      candidate: this.getRepository(CandidateRepository),
      election: this.getRepository(ElectionRepository),
      vote_record: this.getRepository(VoteRecordRepository),
      cache: this.getRepository(CacheRepository)
    };
  }
};

export default app;
