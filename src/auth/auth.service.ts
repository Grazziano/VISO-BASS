import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { OwnersService } from '../owners/owners.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private ownersService: OwnersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    try {
      this.logger.debug(`Tentativa de validação de usuário: ${email}`);

      const user = await this.ownersService.findByEmail(email);

      if (!user) {
        this.logger.warn(`Usuário não encontrado: ${email}`);
        throw new UnauthorizedException('Credenciais inválidas');
      }

      const isMatch = await bcrypt.compare(pass, user.password);

      if (!isMatch) {
        this.logger.warn(`Senha incorreta para usuário: ${email}`);
        throw new UnauthorizedException('Credenciais inválidas');
      }

      this.logger.log(`Usuário validado com sucesso: ${email}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Erro na validação do usuário ${email}: ${error.message}`,
          error.stack,
        );
        throw new UnauthorizedException('Credenciais inválidas');
      }
      this.logger.error(`Erro desconhecido na validação do usuário ${email}`);
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }

  login(user: any) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const payload = { email: user.email, sub: user._id };

      this.logger.log(
        `Login realizado com sucesso para usuário: ${user.email}`,
      );

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      this.logger.error(
        `Erro no login para usuário ${user.email}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async me(user: JwtPayload) {
    try {
      this.logger.debug(`Buscando informações do usuário: ${user.email}`);
      const userInfo = await this.ownersService.findByEmail(user.email);

      if (userInfo) {
        this.logger.debug(`Informações do usuário encontradas: ${user.email}`);
      }

      return userInfo;
    } catch (error) {
      this.logger.error(
        `Erro ao buscar informações do usuário ${user.email}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
