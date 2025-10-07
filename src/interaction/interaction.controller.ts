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
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('interaction')
@UseGuards(AuthGuard('jwt'))
@Controller('interaction')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Post()
  @ApiBody({ type: CreateInteractionDto })
  @ApiOperation({ summary: 'Cria nova interação' })
  @ApiResponse({
    status: 201,
    description: 'A interação foi criada com sucesso',
  })
  @Throttle({ medium: { limit: 10, ttl: 10000 } }) // 10 criações por 10 segundos
  create(@Body() createInteractionDto: CreateInteractionDto) {
    return this.interactionService.create(createInteractionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as interações' })
  @ApiResponse({
    status: 200,
    description: 'Retorna todas as interações',
    schema: {
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
  findAll() {
    return this.interactionService.findAll();
  }

  @Get('count-by-day')
  @ApiOperation({
    summary: 'Lista o número de interações por dia no período especificado',
  })
  @ApiQuery({
    name: 'period',
    enum: ['week', 'month'],
    required: false,
    description: 'Define o período (week ou month)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna o número de interações por dia no período especificado',
    schema: {
      example: [
        { _id: '2025-09-08', total: 5 },
        { _id: '2025-09-09', total: 12 },
        { _id: '2025-09-12', total: 3 },
      ],
    },
  })
  async countByDay(@Query('period') period: 'week' | 'month' = 'week') {
    return this.interactionService.countInteractionsByDay(period);
  }

  @Get('time-series')
  @ApiOperation({
    summary:
      'Lista o número interações agregadas em formato de série temporal (para montar gráficos)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna interações agregadas em formato de série temporal (ideal para montar gráficos)',
    schema: {
      example: [
        { date: '2025-09-01', interactions: 12 },
        { date: '2025-09-02', interactions: 8 },
        { date: '2025-09-03', interactions: 15 },
      ],
    },
  })
  async getInteractionsTimeSeries(@Query('range') range: '7d' | '30d' = '7d') {
    return this.interactionService.getTimeSeries(range);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'ID da interação' })
  @ApiOperation({ summary: 'Listar uma interação específica' })
  @ApiResponse({ status: 200, description: 'Retorna uma interação específica' })
  findOne(@Param('id') id: string) {
    return this.interactionService.findOne(id);
  }
}
