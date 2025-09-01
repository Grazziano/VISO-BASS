import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { VisoClassService } from './viso-class.service';
import { CreateVisoClassDto } from './dto/create-viso-class.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('class')
@UseGuards(AuthGuard('jwt'))
@Controller('class')
export class MyClassController {
  constructor(private readonly visoClassService: VisoClassService) {}

  @ApiBody({ type: CreateVisoClassDto })
  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({ type: CreateVisoClassDto })
  @Post()
  create(@Body() createVisoClassDto: CreateVisoClassDto) {
    return this.visoClassService.create(createVisoClassDto);
  }

  @ApiOperation({ summary: 'Get all classes' })
  @ApiResponse({ type: [CreateVisoClassDto] })
  @Get()
  findAll() {
    return this.visoClassService.findAll();
  }

  @ApiParam({ name: 'id', type: String, description: 'ID of the class' })
  @ApiResponse({ type: CreateVisoClassDto })
  @ApiOperation({ summary: 'Get a class by ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visoClassService.findOne(id);
  }
}
