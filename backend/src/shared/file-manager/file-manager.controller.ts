import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  Res,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { FileManagerService } from './file-manager.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { FilesValidationPipe } from '../../libs/pipes';
import { type Response } from 'express';
import { Public, SkipTransform } from '../../libs/decorators';
import { JwtGuard } from '../auth';
import { UploaderService } from './driver';
import { FileMetadataViewModel } from '../../common/viewmodels/file-metadata.viewmodel';

@UseGuards(JwtGuard)
@Controller('file-managers')
export class FileManagerController {
  constructor(
    private readonly fileUploadService: UploaderService,
    private readonly fileManagerService: FileManagerService,
  ) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(FilesValidationPipe)
    file: Express.Multer.File,
  ) {
    const fileUploaded = await this.fileUploadService.uploadFile(file);

    return this.fileManagerService.create(fileUploaded);
  }

  @Post('uploads')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files' },
      { name: 'images' },
      { name: 'videos' },
      { name: 'documents' },
    ]),
  )
  async uploads(
    @UploadedFiles(FilesValidationPipe)
    files: Record<string, Array<Express.Multer.File>>,
  ) {
    const filesUploaded = await this.fileUploadService.uploadFile(files);
    const fileMetadata = await this.fileManagerService.createMany(
      filesUploaded as Record<string, any>[],
    );

    return FileMetadataViewModel.fromEntities(fileMetadata);
  }

  @Post('upload/documents')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'documents' },
    ]),
  )
  async uploadDocuments(
    @UploadedFiles(FilesValidationPipe)
    files: Record<string, Array<Express.Multer.File>>,
  ) {
    const filesUploaded = await this.fileUploadService.uploadFile(files);
    const fileMetadata = await this.fileManagerService.createMany(
      filesUploaded as Record<string, any>[],
    );

    return FileMetadataViewModel.fromEntities(fileMetadata);
  }

  @Get(':filename')
  @Public()
  @SkipTransform()
  async findOne(
    @Param('filename') filename: string,
    @Query() query: any,
    @Res() res: Response,
  ) {
    const { fieldName, ...fileMetadata } =
      await this.fileManagerService.findOne(filename);

    let url = fieldName
      ? `${fieldName}/${fileMetadata.filename}`
      : fileMetadata.filename;

    // ------------------- Get thumbnail video -------------------
    // if ('thumbnail' in query && fileMetadata?.thumbnail) {
    //   url = `thumbnails/${fileMetadata?.thumbnail}`;
    // }

    const file = await this.fileUploadService.getFile(url);

    return file instanceof Buffer ? res.end(file) : file.pipe(res);
  }

  @Delete(':filename')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('filename') filename: string) {
    return this.fileManagerService.remove(filename);
  }
}
