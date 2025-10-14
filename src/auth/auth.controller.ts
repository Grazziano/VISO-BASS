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
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Registrar novo usuário',
    description:
      'Cria uma nova conta de usuário no sistema. O email deve ser único.',
  })
  @ApiBody({
    description: 'Dados do usuário para registro',
    schema: {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: {
          type: 'string',
          description: 'Nome completo do usuário',
          example: 'João Silva',
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'Email único do usuário',
          example: 'joao.silva@email.com',
        },
        password: {
          type: 'string',
          minLength: 6,
          description: 'Senha do usuário (mínimo 6 caracteres)',
          example: 'minhasenha123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        name: { type: 'string', example: 'João Silva' },
        email: { type: 'string', example: 'joao.silva@email.com' },
        role: { type: 'string', example: 'user' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou email já existe',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Email já está em uso' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiTooManyRequestsResponse({
    description: 'Muitas tentativas de registro. Limite: 2 por segundo',
  })
  @Throttle({ short: { limit: 2, ttl: 1000 } }) // 2 registros por segundo
  @Post('register')
  async register(@Body() body: IOwner) {
    return this.authService['ownersService'].create(body);
  }

  @ApiOperation({
    summary: 'Fazer login',
    description:
      'Autentica o usuário e retorna um token JWT para acesso aos endpoints protegidos.',
  })
  @ApiBody({
    description: 'Credenciais de login',
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          description: 'Email do usuário',
          example: 'joao.silva@email.com',
        },
        password: {
          type: 'string',
          description: 'Senha do usuário',
          example: 'minhasenha123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Token JWT para autenticação',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        // user: {
        //   type: 'object',
        //   properties: {
        //     _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        //     name: { type: 'string', example: 'João Silva' },
        //     email: { type: 'string', example: 'joao.silva@email.com' },
        //     role: { type: 'string', example: 'user' },
        //   },
        // },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Credenciais inválidas' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiTooManyRequestsResponse({
    description: 'Muitas tentativas de login. Limite: 5 por minuto',
  })
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 tentativas de login por minuto
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obter dados do usuário logado',
    description:
      'Retorna as informações do usuário autenticado baseado no token JWT.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário retornados com sucesso',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        name: { type: 'string', example: 'João Silva' },
        email: { type: 'string', example: 'joao.silva@email.com' },
        role: { type: 'string', example: 'user' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT inválido ou expirado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @Get('me')
  async me(@Request() req: AuthenticatedRequest) {
    const data = await this.authService.me(req.user);
    return data;
  }
}
