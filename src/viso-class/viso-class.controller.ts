import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { VisoClassService } from './viso-class.service';
import { CreateVisoClassDto } from './dto/create-viso-class.dto';
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

@ApiTags('class')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('class')
export class MyClassController {
  constructor(private readonly visoClassService: VisoClassService) {}

  @ApiBody({ type: CreateVisoClassDto })
  @ApiOperation({ summary: 'Cria uma nova class' })
  @ApiResponse({ type: CreateVisoClassDto })
  @Post()
  @Roles('admin')
  async create(@Body() createVisoClassDto: CreateVisoClassDto) {
    return this.visoClassService.create(createVisoClassDto);
  }

  @ApiOperation({ summary: 'Lista todas as classes' })
  @ApiResponse({ type: [CreateVisoClassDto] })
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.visoClassService.findAll(Number(page), Number(limit));
  }

  @Get('count')
  @ApiOperation({
    summary: 'Contar total de classes',
    description:
      'Retorna o número total de registros existentes na coleção de classes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Total de classes retornado com sucesso',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 125 },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido ou ausente' })
  countEnvironments() {
    return this.visoClassService.countClasses();
  }

  @Get('object-counts')
  @ApiOperation({
    summary: 'Quantidade de objetos por classe',
    description:
      'Retorna uma lista com cada classe e a quantidade de objetos associados a ela.',
  })
  @ApiResponse({
    status: 200,
    description: 'Contagem de objetos por classe retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          class_id: { type: 'string', example: '677f1f77bcf86cd799439011' },
          class_name: { type: 'string', example: 'Sensores de Temperatura' },
          total: { type: 'number', example: 42 },
        },
      },
      example: [
        {
          class_id: '677f1f77bcf86cd799439011',
          class_name: 'Classe A',
          total: 12,
        },
        {
          class_id: '677f1f77bcf86cd799439012',
          class_name: 'Classe B',
          total: 7,
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido ou ausente' })
  async countObjectsByClass() {
    return this.visoClassService.countObjectsByClass();
  }

  @Get('last')
  @ApiOperation({
    summary: 'Retorna o último registro inserido',
    description:
      'Busca a última classe cadastrada com base no campo createdAt.',
  })
  @ApiResponse({
    status: 200,
    description: 'Último registro retornado com sucesso',
    type: CreateVisoClassDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido ou ausente' })
  async findLast() {
    return this.visoClassService.findLast();
  }

  @Get('search')
  @ApiOperation({ summary: 'Busca classes por nome' })
  @ApiQuery({
    name: 'name',
    required: true,
    description: 'Nome ou parte do nome da classe',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Página (padrão 1)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limite por página (padrão 10)',
  })
  @ApiResponse({ type: [CreateVisoClassDto] })
  async findByName(
    @Query('name') name: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.visoClassService.findByName(name, Number(page), Number(limit));
  }

  @ApiParam({ name: 'id', type: String, description: 'ID da classe' })
  @ApiResponse({ type: CreateVisoClassDto })
  @ApiOperation({ summary: 'Busca uma classe pelo id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.visoClassService.findOne(id);
  }
}
