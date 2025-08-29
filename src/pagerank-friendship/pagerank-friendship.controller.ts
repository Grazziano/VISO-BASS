import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PagerankFriendshipService } from './pagerank-friendship.service';
import { CreatePagerankFriendshipDto } from './dto/create-pagerank-friendship.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('pagerank-friendship')
export class PagerankFriendshipController {
  constructor(
    private readonly pagerankFriendshipService: PagerankFriendshipService,
  ) {}

  @Post()
  create(@Body() createPagerankFriendshipDto: CreatePagerankFriendshipDto) {
    return this.pagerankFriendshipService.create(createPagerankFriendshipDto);
  }

  @Get()
  findAll() {
    return this.pagerankFriendshipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagerankFriendshipService.findOne(+id);
  }
}
