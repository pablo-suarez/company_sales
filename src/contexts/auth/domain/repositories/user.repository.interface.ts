import { BaseRepository } from '../../../../shared/domain/repositories/base.repository.interface';
import { User } from '../entities/user.entity';

export interface UserRepository extends BaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}

export const USER_REPOSITORY = 'USER_REPOSITORY';
