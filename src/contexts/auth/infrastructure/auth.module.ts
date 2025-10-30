import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModel, UserSchema } from './persistence/mongoose/user.schema';
import { MongoUserRepository } from './persistence/mongoose/user.repository';
import { USER_REPOSITORY } from '../domain/repositories/user.repository.interface';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../application/use-cases/login-user.use-case';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'my-secret-test',
        signOptions: {
          expiresIn:  Number(configService.get<string>('JWT_EXPIRATION')) || 86400,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: MongoUserRepository,
    },
    RegisterUserUseCase,
    LoginUserUseCase,
    JwtStrategy,
  ],
  exports: [
    USER_REPOSITORY,
    JwtModule,
    PassportModule,
  ],
})
export class AuthModule {}