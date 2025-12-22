import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('interaction')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('JWT-auth')
@Controller('interaction')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar nova interação',
    description:
      'Registra uma nova interação entre dois objetos VISO no sistema. A interação representa uma comunicação ou troca de dados entre dispositivos IoT.',
  })
  @ApiBody({
    type: CreateInteractionDto,
    description: 'Dados da interação a ser criada',
    examples: {
      exemplo1: {
        summary: 'Interação com feedback positivo',
        description: 'Exemplo de uma interação bem-sucedida entre dois objetos',
        value: {
          inter_obj_i: '507f1f77bcf86cd799439011',
          inter_obj_j: '507f1f77bcf86cd799439012',
          inter_start: '2024-01-15T10:30:00.000Z',
          inter_end: '2024-01-15T10:35:00.000Z',
          inter_feedback: true,
          inter_service: 1,
        },
      },
      exemplo2: {
        summary: 'Interação com feedback negativo',
        description: 'Exemplo de uma interação que falhou ou teve problemas',
        value: {
          inter_obj_i: '507f1f77bcf86cd799439013',
          inter_obj_j: '507f1f77bcf86cd799439014',
          inter_start: '2024-01-15T11:00:00.000Z',
          inter_end: '2024-01-15T11:02:00.000Z',
          inter_feedback: false,
          inter_service: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Interação criada com sucesso',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439015' },
        inter_obj_i: { type: 'string', example: '507f1f77bcf86cd799439011' },
        inter_obj_j: { type: 'string', example: '507f1f77bcf86cd799439012' },
        inter_start: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:30:00.000Z',
        },
        inter_end: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-15T10:35:00.000Z',
        },
        inter_feedback: { type: 'boolean', example: true },
        inter_service: { type: 'number', example: 1 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        __v: { type: 'number', example: 0 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Dados da interação inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['inter_obj_i deve ser um ObjectId válido'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido ou ausente' })
  @ApiTooManyRequestsResponse({
    description: 'Limite de criação excedido: 10 interações por 10 segundos',
  })
  @Throttle({ medium: { limit: 10, ttl: 10000 } }) // 10 criações por 10 segundos
  @Roles('admin')
  create(@Body() createInteractionDto: CreateInteractionDto) {
    return this.interactionService.create(createInteractionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas as interações',
    description:
      'Retorna uma lista completa de todas as interações registradas no sistema, incluindo detalhes sobre os objetos envolvidos e métricas da interação.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de interações retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '68c2f089ec97807527b1108e' },
          inter_obj_i: { type: 'string', example: '68c2f083ec97807527b10291' },
          inter_obj_j: { type: 'string', example: '68c2f083ec97807527b102ce' },
          inter_start: {
            type: 'string',
            format: 'date-time',
            example: '2025-09-11T15:53:45.314Z',
          },
          inter_end: {
            type: 'string',
            format: 'date-time',
            example: '2025-09-11T15:54:14.985Z',
          },
          inter_feedback: { type: 'boolean', example: false },
          inter_service: { type: 'number', example: 4 },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-09-11T15:53:45.338Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-09-11T15:53:45.338Z',
          },
          __v: { type: 'number', example: 0 },
        },
      },
      example: [
        {
          _id: '68c2f089ec97807527b1108e',
          inter_obj_i: '68c2f083ec97807527b10291',
          inter_obj_j: '68c2f083ec97807527b102ce',
          inter_start: '2025-09-11T15:53:45.314Z',
          inter_end: '2025-09-11T15:54:14.985Z',
          inter_feedback: false,
          inter_service: 4,
          __v: 0,
          createdAt: '2025-09-11T15:53:45.338Z',
          updatedAt: '2025-09-11T15:53:45.338Z',
        },
        {
          _id: '68c2f089ec97807527b1108f',
          inter_obj_i: '68c2f083ec97807527b103eb',
          inter_obj_j: '68c2f083ec97807527b10118',
          inter_start: '2025-09-11T15:53:45.314Z',
          inter_end: '2025-09-11T15:54:04.060Z',
          inter_feedback: true,
          inter_service: 5,
          __v: 0,
          createdAt: '2025-09-11T15:53:45.338Z',
          updatedAt: '2025-09-11T15:53:45.338Z',
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido ou ausente' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.interactionService.findAll(Number(page), Number(limit));
  }

  @Get('count-by-day')
  @ApiOperation({
    summary: 'Contar interações por dia',
    description:
      'Retorna estatísticas do número de interações agrupadas por dia dentro do período especificado. Útil para análise de tendências e padrões de uso.',
  })
  @ApiQuery({
    name: 'period',
    enum: ['week', 'month'],
    required: false,
    description: 'Período para análise das interações',
    example: 'week',
    schema: {
      type: 'string',
      enum: ['week', 'month'],
      default: 'week',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas de interações por dia retornadas com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Data no formato YYYY-MM-DD',
            example: '2025-09-08',
          },
          total: {
            type: 'number',
            description: 'Número total de interações no dia',
            example: 5,
          },
        },
      },
      example: [
        { _id: '2025-09-08', total: 5 },
        { _id: '2025-09-09', total: 12 },
        { _id: '2025-09-12', total: 3 },
      ],
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido ou ausente' })
  async countByDay(@Query('period') period: 'week' | 'month' = 'week') {
    return this.interactionService.countInteractionsByDay(period);
  }

  @Get('time-series')
  @ApiOperation({
    summary: 'Obter dados de série temporal',
    description:
      'Retorna dados de interações organizados em série temporal para análise de padrões ao longo do tempo. Permite visualização de tendências e picos de atividade.',
  })
  @ApiQuery({
    name: 'range',
    enum: ['7d', '30d'],
    required: false,
    description: 'Período para análise da série temporal',
    example: '7d',
    schema: {
      type: 'string',
      enum: ['7d', '30d'],
      default: '7d',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Dados de série temporal retornados com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            format: 'date',
            description: 'Data da medição',
            example: '2025-09-08',
          },
          interactions: {
            type: 'number',
            description: 'Número de interações na data',
            example: 15,
          },
        },
      },
      example: [
        { date: '2025-09-01', interactions: 12 },
        { date: '2025-09-02', interactions: 8 },
        { date: '2025-09-03', interactions: 15 },
      ],
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido ou ausente' })
  async getInteractionsTimeSeries(@Query('range') range: '7d' | '30d' = '7d') {
    return this.interactionService.getTimeSeries(range);
  }

  @Get('count')
  @ApiOperation({
    summary: 'Contar total de interações',
    description:
      'Retorna o número total de registros existentes na coleção de interações.',
  })
  @ApiResponse({
    status: 200,
    description: 'Total de interações retornado com sucesso',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 125 },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido ou ausente' })
  async countInteractions() {
    return this.interactionService.countInteractions();
  }

  @Get('last')
  @ApiOperation({
    summary: 'Buscar último registro inserido',
    description:
      'Retorna o registro mais recente inserido na coleção de interações.',
  })
  @ApiResponse({
    status: 200,
    description: 'Última interação retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '68c2f089ec97807527b1108e' },
        inter_obj_i: { type: 'string', example: '68c2f083ec97807527b10291' },
        inter_obj_j: { type: 'string', example: '68c2f083ec97807527b102ce' },
        inter_start: { type: 'string', format: 'date-time' },
        inter_end: { type: 'string', format: 'date-time' },
        inter_feedback: { type: 'boolean' },
        inter_service: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido ou ausente' })
  async getLast() {
    return this.interactionService.findLast();
  }

  @Get('search')
  @ApiOperation({
    summary: 'Buscar interações por nome dos objetos',
    description:
      'Filtra interações cujo objeto de origem ou destino corresponda ao nome informado.',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Nome (ou trecho) do objeto envolvido na interação',
  })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de interações filtradas',
  })
  search(
    @Query('name') name?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.interactionService.search({
      name,
      page: typeof page === 'string' ? Number(page) : page,
      limit: typeof limit === 'string' ? Number(limit) : limit,
    });
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID único da interação no formato ObjectId do MongoDB',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiOperation({
    summary: 'Buscar interação por ID',
    description:
      'Retorna os detalhes completos de uma interação específica baseado no seu ID único.',
  })
  @ApiResponse({
    status: 200,
    description: 'Interação encontrada com sucesso',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '68c2f089ec97807527b1108e' },
        inter_obj_i: { type: 'string', example: '68c2f083ec97807527b10291' },
        inter_obj_j: { type: 'string', example: '68c2f083ec97807527b102ce' },
        inter_start: {
          type: 'string',
          format: 'date-time',
          example: '2025-09-11T15:53:45.314Z',
        },
        inter_end: {
          type: 'string',
          format: 'date-time',
          example: '2025-09-11T15:54:14.985Z',
        },
        inter_feedback: { type: 'boolean', example: false },
        inter_service: { type: 'number', example: 4 },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-09-11T15:53:45.338Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-09-11T15:53:45.338Z',
        },
        __v: { type: 'number', example: 0 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'ID da interação inválido',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'ID inválido' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Interação não encontrada',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Interação não encontrada' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido ou ausente' })
  findOne(@Param('id') id: string) {
    return this.interactionService.findOne(id);
  }
}
