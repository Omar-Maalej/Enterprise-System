import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import {
  NotFoundException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
  ) {}

  async create(file: Express.Multer.File) {
    const newFile = new File();
    newFile.path = file.path;
    newFile.title = file.originalname;
    newFile.type = file.fieldname;
    console.log(file);
    return await this.fileRepository.save(newFile);
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  async deleteFile(id: number): Promise<void> {
    const toDeleteFile = await this.fileRepository.findOneBy({ id });
    const filePath = path.join(__dirname, '..', '..', toDeleteFile.path);

    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
    } catch (error) {
      throw new NotFoundException('File not found');
    }

    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      throw new InternalServerErrorException('Unable to delete file');
    }

    await this.fileRepository.delete(id);
  }
}
