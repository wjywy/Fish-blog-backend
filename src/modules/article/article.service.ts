import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { ArticleCreateDTO } from './dto/articleCreate.dto';
import { ArticleEditDTO } from './dto/articleEdit.dto';
import { IdDTO } from './dto/id.dto';
import { ListDTO } from './dto/list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { writeFileRecursive } from 'src/utils/writeFileRecursive';
import { AuthGuard } from '@nestjs/passport';

/**
 * Repository: 任何实体的存储库
 * MongoRepository: 具有特殊功能的存储库,仅用于MongoDB
 */
import { Repository } from 'typeorm';
import { Article } from './entity/article.entity';
import { TypeDTO } from './dto/type.dto';

@Injectable()
export class ArticleService {
  list: any[];

  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {
    this.list = [];
  }

  async getMore(listDTO: ListDTO) {
    const getList = this.articleRepository
      .createQueryBuilder('article')
      .select([
        'article.id',
        'article.title',
        'article.description',
        'article.createTime',
        'article.updateTime',
        'article.content',
        'article.types',
      ])
      .getMany();
    return getList;
  }

  // 获取标签包含前端的所有文章
  async getFront(articleType: TypeDTO) {
    const getList = this.articleRepository
      .createQueryBuilder('article')
      .select([
        'article.id',
        'article.title',
        'article.description',
        'article.createTime',
        'article.content',
        'article.types',
      ])
      .having('article.types = :types', { types: `${articleType.type}` })
      .getMany();
    return getList;
  }

  async getOne(idDto: IdDTO) {
    const { id } = idDto;
    const articleDetial = await this.articleRepository
      .createQueryBuilder('article')
      .where('article.id = :id', { id })
      .getOne();
    if (!articleDetial) {
      throw new NotFoundException('找不到文章');
    }
    const result = { info: articleDetial };
    // console.log(result, 'articleDetail');
    return result;
  }

  async deleteArticle(IdDTO: IdDTO) {
    const { id } = IdDTO;
    await this.articleRepository.delete({ id });
    return {
      info: 'delete success',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  async create(articleCreateDTO: ArticleCreateDTO) {
    const article = new Article();
    article.title = articleCreateDTO.title;
    article.description = articleCreateDTO.description;
    article.content = articleCreateDTO.content;
    article.types = articleCreateDTO.type;
    const result = await this.articleRepository.save(article);
    // console.log(result, 'result');
    return { info: result };
  }

  @UseGuards(AuthGuard('jwt'))

  // 更新接口，如果标题已经存在就直接更新，如果不存在就直接create
  async update(articleEditDTO: ArticleEditDTO) {
    const { title } = articleEditDTO;
    const articleToUpdate = await this.articleRepository.findOneBy({ title });
    // console.log(articleToUpdate, 'articleToUpdate');
    if (!articleToUpdate) {
      console.log(articleEditDTO.content);
      this.create({
        title: articleEditDTO.title,
        description: articleEditDTO.description,
        content: articleEditDTO.content,
        type: articleEditDTO.types,
      });
    } else {
      articleToUpdate.description = articleEditDTO.description;
      articleToUpdate.content = articleEditDTO.content;
      articleToUpdate.types = articleEditDTO.types;
      const result = await this.articleRepository.save(articleToUpdate);
      return { info: result };
    }
  }

  // 上传文件，调用更新接口
  @UseGuards(AuthGuard('jwt'))
  async upload(file: any, articleInfo: any) {
    /**读取buffer数据 */

    await writeFileRecursive(`./readArticle/${file.originalname}`, file.buffer);
    // console.log(file.buffer.toString());
    this.update({
      title: `${articleInfo.title}`,
      description: articleInfo.description,
      types: articleInfo.types,
      content: `${file.buffer.toString()}`,
    });
    return { info: 'success' };
  }
}
