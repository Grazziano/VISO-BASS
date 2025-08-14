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
import { VisoClassService } from './viso-class.service';
import { CreateVisoClassDto } from './dto/create-viso-class.dto';
import { UpdateVisoClassDto } from './dto/update-viso-class.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('class')
export class MyClassController {
  constructor(private readonly visoClassService: VisoClassService) {}

  @Post()
  create(@Body() createVisoClassDto: CreateVisoClassDto) {
    return this.visoClassService.create(createVisoClassDto);
  }

  @Get()
  findAll() {
    return this.visoClassService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visoClassService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVisoClassDto: UpdateVisoClassDto,
  ) {
    return this.visoClassService.update(+id, updateVisoClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visoClassService.remove(+id);
  }
}
