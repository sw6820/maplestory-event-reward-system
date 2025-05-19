import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

interface User {
  id: string;
  username: string;
  password: string; // hashed
  role: string;
}

@Injectable()
export class AuthService {
  private users: User[] = []; // 실제 구현에서는 DB 사용

  constructor(private readonly jwtService: JwtService) { }

  async signup(username: string, password: string, role = 'USER') {
    const hash = await bcrypt.hash(password, 10);
    const user = { id: Date.now().toString(), username, password: hash, role };
    this.users.push(user);
    return { id: user.id, username: user.username, role: user.role };
  }

  async validateUser(username: string, password: string) {
    const user = this.users.find((u) => u.username === username);
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password);
    return match ? user : null;
  }

  async login(user: User) {
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
