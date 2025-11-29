import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VisoObjectService } from './viso-object.service';
import { CreateVisoObjectDto } from './dto/create-viso-object.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from 'src/auth/types/jwt-payload.interface';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseVisoObjectDto } from './dto/response-viso-object.dto';

@ApiTags('object')
@UseGuards(AuthGuard('jwt'))
@Controller('object')
export class VisoObjectController {
  constructor(private readonly visoObjectService: VisoObjectService) {}

  @ApiBody({ type: CreateVisoObjectDto })
  @ApiOperation({ summary: 'Cria um novo objeto' })
  @ApiResponse({ status: 201, type: CreateVisoObjectDto })
  @Post()
  async create(
    @Body() createVisoObjectDto: CreateVisoObjectDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ResponseVisoObjectDto> {
    const user = req.user;
    return this.visoObjectService.create(createVisoObjectDto, user);
  }

  @ApiOperation({ summary: 'Lista todos os objetos' })
  @ApiResponse({ status: 200, type: [ResponseVisoObjectDto] })
  @Get()
  async findAll(): Promise<ResponseVisoObjectDto[]> {
    return this.visoObjectService.findAll();
  }

  @Get('count')
  @ApiOperation({
    summary: 'Contar total de objetos',
    description:
      'Retorna o número total de registros existentes na coleção de objetos.',
  })
  @ApiResponse({
    status: 200,
    description: 'Total de objetos retornado com sucesso',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 125 },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido ou ausente' })
  countEnvironments() {
    return this.visoObjectService.countObjects();
  }

  @ApiParam({ name: 'id', type: String, description: 'Object ID' })
  @ApiOperation({ summary: 'Busca um objeto por ID' })
  @ApiResponse({ status: 200, type: ResponseVisoObjectDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseVisoObjectDto> {
    return this.visoObjectService.findOne(id);
  }
}
