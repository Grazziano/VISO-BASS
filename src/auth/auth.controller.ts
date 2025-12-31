import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  UseGuards,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from './types/jwt-payload.interface';
import { IOwner } from 'src/owners/interfaces/owner.interface';
import { OwnersService } from 'src/owners/owners.service';
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
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { UpdateMeDto } from './dto/update-me.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private ownersService: OwnersService,
  ) {}

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
          minLength: 8,
          description:
            'Senha forte: mínimo 8 caracteres com maiúsculas, minúsculas, números e símbolo',
          example: 'V1so@Bass!',
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

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Atualizar perfil do próprio usuário',
    description: 'Permite atualizar nome e email do usuário autenticado.',
  })
  @ApiBody({ type: UpdateMeDto })
  @ApiBadRequestResponse({ description: 'Dados inválidos' })
  @Patch('me')
  async updateMe(
    @Request() req: AuthenticatedRequest,
    @Body() body: UpdateMeDto,
  ) {
    const id = req.user.userId;
    return this.ownersService.updateMe(id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Atualizar senha do próprio usuário',
    description:
      'Permite alterar a senha do usuário autenticado, exigindo a senha atual.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['currentPassword', 'newPassword'],
      properties: {
        currentPassword: { type: 'string' },
        newPassword: {
          type: 'string',
          minLength: 8,
          description:
            'Senha forte: mínimo 8 caracteres com maiúsculas, minúsculas, números e símbolo',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Senha atual incorreta ou nova senha fraca',
  })
  @Patch('me/password')
  async updateMyPassword(
    @Request() req: AuthenticatedRequest,
    @Body()
    body: { currentPassword: string; newPassword: string },
  ) {
    const id = req.user.userId;
    return this.ownersService.changePassword(
      id,
      body.currentPassword,
      body.newPassword,
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Listar usuários (admin)',
    description: 'Retorna a lista de usuários sem o campo de senha.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista retornada com sucesso',
  })
  @Get('users')
  async listUsers() {
    return this.ownersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Atualizar papel de usuário (admin)',
    description: 'Atualiza o papel de um usuário para admin ou user.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: { type: 'string', enum: ['admin', 'user'] },
      },
      required: ['role'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Papel atualizado com sucesso',
  })
  @Patch('users/:id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() body: { role: string },
  ) {
    return this.ownersService.updateRole(id, body.role);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Buscar usuários (admin)',
    description: 'Busca usuários por nome ou email.',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultados retornados com sucesso',
  })
  @Get('users/search')
  async searchUsers(@Query('q') q: string) {
    return this.ownersService.searchUsers(q);
  }
}
