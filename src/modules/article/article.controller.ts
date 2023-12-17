import { Controller, Body, Get, Post, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleCreateDTO } from './dto/articleCreate.dto';
import { IdDTO } from './dto/id.dto';
import { ListDTO } from './dto/list.dto';
import { TypeDTO } from './dto/type.dto';
import { ArticleEditDTO } from './dto/articleEdit.dto';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get('list')
  getMore(@Query() listDTO: ListDTO) {
    return this.articleService.getMore(listDTO);
  }

  @Get('frontList')
  getFront(@Query() typeDTO: TypeDTO) {
    return this.articleService.getFront(typeDTO);
  }

  @Get('info')
  getOne(@Query() idDTO: IdDTO) {
    return this.articleService.getOne(idDTO);
  }

  @Post('create')
  create(@Body() articleCreateDTO: ArticleCreateDTO) {
    return this.articleService.create(articleCreateDTO);
  }

  @Post('edit')
  update(@Body() articleEditDTO: ArticleEditDTO) {
    return this.articleService.update(articleEditDTO);
  }

  @Post('delete')
  delete(@Body() idDTO: IdDTO) {
    return this.articleService.deleteArticle(idDTO);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('uploadFile'))
  upload(@Body() articleInfo: any, @UploadedFile() file) {
    // console.log(articleInfo, 'infos');
    // console.log(file, 'file');
    return this.articleService.upload(file, articleInfo);
  }
}
