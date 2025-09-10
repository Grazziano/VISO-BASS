import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PagerankFriendshipService } from './pagerank-friendship.service';
import { CreatePagerankFriendshipDto } from './dto/create-pagerank-friendship.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('pagerank-friendship')
@UseGuards(AuthGuard('jwt'))
@Controller('pagerank-friendship')
export class PagerankFriendshipController {
  constructor(
    private readonly pagerankFriendshipService: PagerankFriendshipService,
  ) {}

  @ApiBody({ type: CreatePagerankFriendshipDto })
  @ApiOperation({ summary: 'Create a pagerank-friendship' })
  @ApiResponse({ status: 200, type: CreatePagerankFriendshipDto })
  @Post()
  create(@Body() createPagerankFriendshipDto: CreatePagerankFriendshipDto) {
    return this.pagerankFriendshipService.create(createPagerankFriendshipDto);
  }

  @ApiOperation({ summary: 'Get all pagerank-friendships' })
  @ApiResponse({ status: 200, type: [CreatePagerankFriendshipDto] })
  @Get()
  findAll() {
    return this.pagerankFriendshipService.findAll();
  }

  @ApiOperation({ summary: 'Get most relevant pagerank-friendships' })
  @ApiResponse({ status: 200, type: [CreatePagerankFriendshipDto] })
  @ApiResponse({ status: 200, type: [CreatePagerankFriendshipDto] })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Get('relevant')
  async getRelevant(@Query('limit') limit: number = 10) {
    return this.pagerankFriendshipService.findMostRelevant(limit);
  }

  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the pagerank-friendship',
  })
  @ApiOperation({ summary: 'Get a pagerank-friendship' })
  @ApiResponse({ status: 200, type: CreatePagerankFriendshipDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagerankFriendshipService.findOne(id);
  }
}
