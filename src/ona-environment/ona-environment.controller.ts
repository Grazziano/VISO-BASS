import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OnaEnvironmentService } from './ona-environment.service';
import { CreateOnaEnvironmentDto } from './dto/create-ona-environment.dto';
import { UpdateOnaEnvironmentDto } from './dto/update-ona-environment.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('ona-environment')
export class OnaEnvironmentController {
  constructor(private readonly onaEnvironmentService: OnaEnvironmentService) {}

  @Post()
  create(@Body() createOnaEnvironmentDto: CreateOnaEnvironmentDto) {
    return this.onaEnvironmentService.create(createOnaEnvironmentDto);
  }

  @Get()
  findAll() {
    return this.onaEnvironmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.onaEnvironmentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOnaEnvironmentDto: UpdateOnaEnvironmentDto,
  ) {
    return this.onaEnvironmentService.update(+id, updateOnaEnvironmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.onaEnvironmentService.remove(+id);
  }
}
