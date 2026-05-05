// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { CattoAuthModule } from '@ccatto/nest-auth';
import { AuthController } from './auth.controller';
import { AuthServiceNew } from './auth.service.new';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { WebAuthnService } from './webauthn.service';
import { UsersModule } from '@src/modules/users/users.module';
import { PrismaModule } from '@src/prisma/prisma.module';
import { PrismaService } from '@src/prisma/prisma.service';
import { PlayerModule } from '@src/modules/players/player.module';

@Module({
  imports: [
    CattoAuthModule.forRoot({
      jwt: { secret: process.env.JWT_SECRET! },
      prismaToken: PrismaService,
      imports: [PrismaModule],
    }),
    UsersModule,
    PlayerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthServiceNew, AuthResolver, WebAuthnService],
  exports: [AuthService, AuthServiceNew],
})
export class AuthModule {}
