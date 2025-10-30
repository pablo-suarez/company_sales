import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import type { UserRepository } from '../../domain/repositories/user.repository.interface';
import { LoginUserDto } from '../dto/login-user.dto';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginUserDto): Promise<{ accessToken: string; user: any }> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
        throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await user.verifyPassword(dto.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      sub: user.id, 
      email: user.getEmail()
    };
    
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.getEmail(),
        name: user.getName()
      },
    };
  }
}