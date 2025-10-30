import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.value-objects';
import { RegisterUserDto } from '../dto/register-user.dto';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import type { UserRepository } from '../../domain/repositories/user.repository.interface';


@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    
    if (existingUser) {
      throw new ConflictException('Email already used');
    }

    const user = User.create(
      Uuid.create().getValue(),
      dto.email,
      dto.password,
      dto.name,
    );

    return await this.userRepository.save(user);
  }
}