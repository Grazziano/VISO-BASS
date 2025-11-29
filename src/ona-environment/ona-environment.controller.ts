import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OnaEnvironmentService } from './ona-environment.service';
import { CreateOnaEnvironmentDto } from './dto/create-ona-environment.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('ona-environment')
@UseGuards(AuthGuard('jwt'))
@Controller('ona-environment')
export class OnaEnvironmentController {
  constructor(private readonly onaEnvironmentService: OnaEnvironmentService) {}

  @Post()
  @ApiOperation({ summary: 'Cria novo ambiente' })
  @ApiBody({ type: CreateOnaEnvironmentDto })
  create(@Body() createOnaEnvironmentDto: CreateOnaEnvironmentDto) {
    return this.onaEnvironmentService.create(createOnaEnvironmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os ambientes' })
  @ApiResponse({ status: 200, type: [CreateOnaEnvironmentDto] })
  findAll() {
    return this.onaEnvironmentService.findAll();
  }

  @Get('count')
  @ApiOperation({
    summary: 'Contar total de ambientes',
    description:
      'Retorna o número total de registros existentes na coleção de ambientes.',
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

  @Get(':id')
  @ApiOperation({ summary: 'Encontra ambiente pelo id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: CreateOnaEnvironmentDto })
  findOne(@Param('id') id: string) {
    return this.onaEnvironmentService.findOne(id);
  }
}
