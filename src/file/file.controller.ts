import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileService } from './file.service';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImageToStorage } from 'src/helpers/image.storage';
import { saveDocumentToStorage } from 'src/helpers/document.storage';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JWTAuthGuard)
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image', saveImageToStorage))
  createImage(@UploadedFile() image: Express.Multer.File) {
    if (!image) {
      throw new BadRequestException('File is required');
    }
    return this.fileService.create(image);
  }

  @Post('document')
  @UseInterceptors(FileInterceptor('document', saveDocumentToStorage))
  async createDocument(@UploadedFile() document: Express.Multer.File) {
    if (!document) {
      throw new BadRequestException('File is required');
    }
    return this.fileService.create(document);
  }

  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.fileService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.fileService.deleteFile(id);
  }
}
