// apps/backend/src/auth/auth.service.ts
// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../users/users.service';
import { UsersService } from '@src/modules/users/users.service';

interface LoginUser {
  username: string;
  userId: string;
}

interface ValidatedUserResult {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<ValidatedUserResult | null> {
    // Assuming username is actually an email
    const user = await this.usersService.findOne({ email: username });
    if (user && user.password === password) {
      // In production, use bcrypt to compare hashed passwords
      return {
        id: user.id,
        email: user.email,
        name: user.name || null,
        role: user.role,
      };
    }
    return null;
  }

  // async validateUser(username: string, password: string): Promise<any> {
  //   const user = await this.usersService.findOne(username);
  //   if (user && user.password === password) { // In production, use bcrypt to compare hashed passwords
  //     const { password, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  async login(user: LoginUser) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
