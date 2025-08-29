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

@UseGuards(AuthGuard('jwt'))
@Controller('object')
export class VisoObjectController {
  constructor(private readonly visoObjectService: VisoObjectService) {}

  @Post()
  create(
    @Body() createVisoObjectDto: CreateVisoObjectDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = req.user;
    return this.visoObjectService.create(createVisoObjectDto, user);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const { userId } = req.user;
    return this.visoObjectService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visoObjectService.findOne(id);
  }
}
