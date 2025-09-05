import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OwnersService } from '../owners/owners.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private ownersService: OwnersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    try {
      const user = await this.ownersService.findByEmail(email);

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

  async me(user: JwtPayload) {
    return this.ownersService.findByEmail(user.email);
  }
}
