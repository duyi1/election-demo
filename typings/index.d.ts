import {Redis} from 'ioredis';
import CandidateRepository from '../app/repository/candidate';
import ElectionRepository from '../app/repository/election';
import VoteRecordRepository from '../app/repository/vote_record';
import CacheRepository from '../app/repository/cache';
import UserRepository from '../app/repository/user';

declare module 'egg' {
  interface Application {
    redis: Redis;
    mysql: any;
    repository: {
      user: UserRepository;
      candidate: CandidateRepository;
      election: ElectionRepository;
      vote_record: VoteRecordRepository;
      cache: CacheRepository;
    };
  }
}