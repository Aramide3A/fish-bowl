import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GameService } from './game.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  ping() {
    return HttpStatus.OK
  }

  @Post()
  @ApiOperation({
    summary: 'Submit array of words',
  })
  @ApiBody({
    description: 'Array of words for game',
    examples: {
      example1: {
        summary: 'An array of words',
        value: { words: ['Go', 'come', 'batman', 'Dc'] },
      },
    },
  })
  @ApiOkResponse({ description: 'Returns GameID' })
  newGame(@Body() body: { words: string[] }) {
    return this.gameService.createWords(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Get random word from array' })
  @ApiParam({
    name: 'id',
    description: 'The game id of game to be played',
    example: '675fc7e40dd2db88a4b2e491',
  })
  @ApiOkResponse({ description: 'Returns a single random word' })
  startGame(@Param('id') id) {
    return this.gameService.selectword(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'End game' })
  @ApiParam({
    name: 'id',
    description: 'The game id of game to end',
    example: '675fc7e40dd2db88a4b2e491',
  })
  endGame(@Param('id') id) {
    return this.gameService.endGame(id);
  }
}
