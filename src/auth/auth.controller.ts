import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from './types/jwt-payload.interface';
import { IOwner } from 'src/owners/interfaces/owner.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @Throttle({ short: { limit: 2, ttl: 1000 } }) // 2 registros por segundo
  @Post('register')
  async register(@Body() body: IOwner) {
    return this.authService['ownersService'].create(body);
  }

  @ApiOperation({ summary: 'Efetua login' })
  @ApiResponse({ status: 200, description: 'Usuário logado com sucesso' })
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 tentativas de login por minuto
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Retorna os dados do usuário logado' })
  @ApiResponse({ status: 200, description: 'Usuário logado com sucesso' })
  @Get('me')
  async me(@Request() req: AuthenticatedRequest) {
    const data = await this.authService.me(req.user);
    return data;
  }
}
