import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async createWords(body: { words: string[] }) {
    if (!Array.isArray(body.words) || body.words.length === 0) {
        throw new BadRequestException('Body must be a non-empty array of strings');
    }

    try {
      const create = await this.prisma.word.create({ data: { words: body.words } });
      return {
        message: {
          id: create.id,
        },
        status: HttpStatus.ACCEPTED,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error creating words record', error);
    }
  }

  async selectword(id: mongoose.Types.ObjectId) {
    const getWords = await this.prisma.word.findUnique({
      where: { id: id as unknown as string },
    });

    if (!getWords) throw new HttpException('Game not found', HttpStatus.BAD_REQUEST)

    const words = getWords.words;

    if (words.length === 0) throw new HttpException('Game ended', HttpStatus.OK)

    const randomIndex = Math.floor(Math.random() * words.length);

    const randomElement = words[randomIndex];

    const gameWord = words.splice(randomIndex, 1)[0];

    const updateArray = await this.prisma.word.update({
      where: { id: id as unknown as string },
      data: { words },
    });

    return gameWord
  }

  async endGame(id: mongoose.Types.ObjectId) {
    const findGame = await this.prisma.word.findUnique({
      where: { id: id as unknown as string },
    });
    if (!findGame) throw new BadRequestException('Invalid Game Id');

    const endGame = await this.prisma.word.delete({
      where: { id: id as unknown as string },
    });

    return new HttpException('Game ended successfully', HttpStatus.OK)
  }
}
