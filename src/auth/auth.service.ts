import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) throw new UnauthorizedException('Credenciais inválidas');

      const isMatch = await bcrypt.compare(pass, user.password);

      if (!isMatch) throw new UnauthorizedException('Credenciais inválidas');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthorizedException('Credenciais inválidas');
      }
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }

  login(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
