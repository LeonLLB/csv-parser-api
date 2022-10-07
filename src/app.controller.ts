import { Body, Controller, HttpStatus, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

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
  exportCSV(@Body() input: {[x:string]:any}[]){
    return this.appService.formatCSV(input)
  }
}
