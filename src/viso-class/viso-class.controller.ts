import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { VisoClassService } from './viso-class.service';
import { CreateVisoClassDto } from './dto/create-viso-class.dto';
import { VisoClassResponseDto } from './dto/viso-class-response.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('class')
@UseGuards(AuthGuard('jwt'))
@Controller('class')
export class MyClassController {
  constructor(private readonly visoClassService: VisoClassService) {}

  @ApiBody({ type: CreateVisoClassDto })
  @ApiOperation({ summary: 'Cria uma nova class' })
  @ApiResponse({ type: CreateVisoClassDto })
  @Post()
  async create(@Body() createVisoClassDto: CreateVisoClassDto) {
    return this.visoClassService.create(createVisoClassDto);
  }

  @ApiOperation({ summary: 'Lista todas as classes' })
  @ApiResponse({ type: [CreateVisoClassDto] })
  @Get()
  async findAll(): Promise<VisoClassResponseDto[]> {
    return this.visoClassService.findAll();
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

  @ApiParam({ name: 'id', type: String, description: 'ID da classe' })
  @ApiResponse({ type: CreateVisoClassDto })
  @ApiOperation({ summary: 'Busca uma classe pelo id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.visoClassService.findOne(id);
  }
}
