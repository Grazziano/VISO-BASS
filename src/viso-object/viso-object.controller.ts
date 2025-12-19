import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { VisoObjectService } from './viso-object.service';
import { CreateVisoObjectDto } from './dto/create-viso-object.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from 'src/auth/types/jwt-payload.interface';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ResponseVisoObjectDto } from './dto/response-viso-object.dto';

@ApiTags('object')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('object')
export class VisoObjectController {
  constructor(private readonly visoObjectService: VisoObjectService) {}

  @ApiBody({ type: CreateVisoObjectDto })
  @ApiOperation({ summary: 'Cria um novo objeto' })
  @ApiResponse({ status: 201, type: CreateVisoObjectDto })
  @Post()
  @Roles('admin')
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
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{
    items: ResponseVisoObjectDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.visoObjectService.findAll(page, limit);
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

  @Get('status-counts')
  @ApiOperation({
    summary: 'Quantidade de objetos por status',
    description:
      'Retorna contagem de objetos agrupada por status (online, offline, manutenção).',
  })
  @ApiResponse({
    status: 200,
    description: 'Contagem por status retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          status_code: { type: 'number', example: 1 },
          status: { type: 'string', example: 'online' },
          total: { type: 'number', example: 42 },
        },
      },
      example: [
        { status_code: 1, status: 'online', total: 15 },
        { status_code: 2, status: 'offline', total: 7 },
        { status_code: 3, status: 'manutenção', total: 3 },
      ],
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido ou ausente' })
  async countByStatus() {
    return this.visoObjectService.countObjectsByStatus();
  }

  @Get('search')
  @ApiOperation({ summary: 'Busca avançada de objetos' })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'brand', required: false, type: String })
  @ApiQuery({ name: 'model', required: false, type: String })
  @ApiQuery({ name: 'mac', required: false, type: String })
  @ApiQuery({ name: 'ownerId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: Number })
  @ApiQuery({ name: 'access', required: false, type: Number })
  @ApiQuery({ name: 'location', required: false, type: Number })
  @ApiQuery({ name: 'qualification', required: false, type: Number })
  @ApiQuery({ name: 'functionIncludes', required: false, type: [String] })
  @ApiQuery({ name: 'restrictionIncludes', required: false, type: [String] })
  @ApiQuery({ name: 'limitationIncludes', required: false, type: [String] })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, type: [ResponseVisoObjectDto] })
  async search(
    @Query('name') name?: string,
    @Query('brand') brand?: string,
    @Query('model') model?: string,
    @Query('mac') mac?: string,
    @Query('ownerId') ownerId?: string,
    @Query('status') status?: string,
    @Query('access') access?: string,
    @Query('location') location?: string,
    @Query('qualification') qualification?: string,
    @Query('functionIncludes') functionIncludes?: string | string[],
    @Query('restrictionIncludes') restrictionIncludes?: string | string[],
    @Query('limitationIncludes') limitationIncludes?: string | string[],
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{
    items: ResponseVisoObjectDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const parseList = (v?: string | string[]) =>
      Array.isArray(v)
        ? v
        : typeof v === 'string' && v.length > 0
          ? v
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
          : undefined;

    return this.visoObjectService.search({
      name,
      brand,
      model,
      mac,
      ownerId,
      status: typeof status === 'string' ? Number(status) : undefined,
      access: typeof access === 'string' ? Number(access) : undefined,
      location: typeof location === 'string' ? Number(location) : undefined,
      qualification:
        typeof qualification === 'string' ? Number(qualification) : undefined,
      functionIncludes: parseList(functionIncludes),
      restrictionIncludes: parseList(restrictionIncludes),
      limitationIncludes: parseList(limitationIncludes),
      page: typeof page === 'string' ? Number(page) : undefined,
      limit: typeof limit === 'string' ? Number(limit) : undefined,
    });
  }

  @Get('last')
  @ApiOperation({
    summary: 'Retorna o último objeto cadastrado',
    description: 'Busca o último registro inserido com base no createdAt.',
  })
  @ApiResponse({
    status: 200,
    type: ResponseVisoObjectDto,
    description: 'Último objeto retornado com sucesso',
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido ou ausente' })
  async findLast(): Promise<unknown> {
    return this.visoObjectService.findLast();
  }

  @ApiParam({ name: 'id', type: String, description: 'Object ID' })
  @ApiOperation({ summary: 'Busca um objeto por ID' })
  @ApiResponse({ status: 200, type: ResponseVisoObjectDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseVisoObjectDto> {
    return this.visoObjectService.findOne(id);
  }
}
