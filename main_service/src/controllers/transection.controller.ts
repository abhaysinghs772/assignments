import {
  Controller,
  Post,
  UploadedFile,
  Req,
  UseInterceptors,
  UseGuards,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransectionService } from 'src/services';
import { Permissions_customDecorator } from 'src/decorators';
import { Permission } from 'src/enums';
import { AccessGuard, PermissionGuard } from 'src/guards';

@Controller('api/v1/bhumio')
export class TransectionController {
  constructor(
    private readonly transectionService: TransectionService,
  ) {}

  //   @AccessGuard()
  @Permissions_customDecorator(Permission.createTransection)
  @UseGuards(PermissionGuard)
  @Post('/upload-doc-sign')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Req() req, @UploadedFile() file, @Body() body) {
    let { user: triggered_by } = req;
    return this.transectionService.upload_Pdf_Or_eSign(
      triggered_by,
      file,
      body,
    );
  }
}
