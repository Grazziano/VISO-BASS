import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OnaEnvironmentService } from './ona-environment.service';
import { CreateOnaEnvironmentDto } from './dto/create-ona-environment.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('ona-environment')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('ona-environment')
export class OnaEnvironmentController {
  constructor(private readonly onaEnvironmentService: OnaEnvironmentService) {}

  @Post()
  @ApiOperation({ summary: 'Cria novo ambiente' })
  @ApiBody({ type: CreateOnaEnvironmentDto })
  @Roles('admin')
  create(@Body() createOnaEnvironmentDto: CreateOnaEnvironmentDto) {
    return this.onaEnvironmentService.create(createOnaEnvironmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os ambientes' })
  @ApiResponse({ status: 200, type: [CreateOnaEnvironmentDto] })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.onaEnvironmentService.findAll(Number(page), Number(limit));
  }

  @Get('count')
  @ApiOperation({
    summary: 'Contar total de ambientes',
    description: 'Retorna o número total de ambientes registrados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Total de ambientes retornado com sucesso',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 125 },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido ou ausente' })
  countEnvironments() {
    return this.onaEnvironmentService.countEnvironments();
  }

  @Get('objects-count')
  @ApiOperation({
    summary: 'Agrega número de objetos por ambiente',
    description:
      'Retorna a contagem de objetos por ambiente. Se `environmentId` for informado, retorna apenas a contagem desse ambiente.',
  })
  @ApiQuery({
    name: 'environmentId',
    type: String,
    required: false,
    description: 'ID do ambiente para filtrar (opcional)',
    example: '68c3a1a9bd91370247719ab1',
  })
  @ApiResponse({
    status: 200,
    description:
      'Contagem de objetos agregada por ambiente retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        environments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              environmentId: { type: 'string' },
              objectsCount: { type: 'number' },
            },
          },
        },
        totalObjects: { type: 'number' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido ou ausente' })
  getObjectsCount(@Query('environmentId') environmentId?: string) {
    return this.onaEnvironmentService.countObjectsAggregation(environmentId);
  }

  @Get('last')
  @ApiOperation({
    summary: 'Retorna o último ambiente criado',
    description:
      'Busca e retorna o registro mais recente da coleção de ambientes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Último ambiente retornado com sucesso',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '68c3a1a9bd91370247719ab1' },
        env_name: { type: 'string', example: 'Sala 01' },
        env_description: {
          type: 'string',
          example: 'Ambiente principal da IoT',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-09-11T15:53:45.314Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-09-11T15:53:45.314Z',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido ou ausente' })
  getLastEnvironment() {
    return this.onaEnvironmentService.findLast();
  }

  @Get('search')
  @ApiOperation({ summary: 'Busca ambientes por nome do objeto' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Nome (ou trecho) do objeto associado ao ambiente',
    type: String,
  })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de ambientes filtrados',
  })
  search(
    @Query('name') name?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.onaEnvironmentService.search({
      name,
      page: typeof page === 'string' ? Number(page) : page,
      limit: typeof limit === 'string' ? Number(limit) : limit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Encontra ambiente pelo id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: CreateOnaEnvironmentDto })
  findOne(@Param('id') id: string) {
    return this.onaEnvironmentService.findOne(id);
  }
}
