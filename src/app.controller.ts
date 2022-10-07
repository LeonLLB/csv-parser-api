import { Body, Controller, Get, Header, HttpStatus, ParseFilePipeBuilder, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import {Response} from 'express'
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  //READS CSV
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))  
  importCSV(
    @UploadedFile(
      new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: new RegExp('.csv$')
      })  
      .addMaxSizeValidator({
        maxSize: 1024 * 1024 * 10 //10MB
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      }),    
    ) file: Express.Multer.File,
  ){
    return this.appService.parseCSV(file)
  }

  //GENERATES CSV
  @Post('export')  
  @Header('Content-Type','text/csv')
  @Header('Content-Disposition','attachment; filename="example.csv"')
  exportCSV(
    @Body() input: {[x:string]:any}[],
    @Res() res: Response
  ){
    return this.appService.formatCSV(input)
    .then(buffer=> res.send(buffer))
  }  
}
