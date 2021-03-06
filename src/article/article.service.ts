import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateArticleDTO, GetAllQuery, GetFeedQuery, UpdateArticleDTO } from 'src/models/article.model';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
    constructor(@InjectRepository(ArticleEntity) private articleRepo: Repository<ArticleEntity>, @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) { }

    getAll(user: UserEntity, query: GetAllQuery) { return this.articleRepo.find() }

    async getFeed(user: UserEntity, query: GetFeedQuery) {
        const fullUser = await this.userRepo.findOne({ where: { id: user.id }, relations: ['follows'] }); //Get your user object with follows populated
        const findOptions = { ...query, where: fullUser.follows.map(follow => ({ author: follow.id })) }; //Map follows object to list of author id's for where clause
        return this.articleRepo.find(findOptions)
    }

    findBySlug(slug: string): Promise<ArticleEntity> {
        return this.articleRepo.findOne({ where: { slug: slug } });
    }

    async createArticle(user: UserEntity, data: CreateArticleDTO): Promise<ArticleEntity> {
        const article = this.articleRepo.create(data);
        article.author = user;
        await article.save();
        return article.toArticle(user);
    }

    private ensureOwnership(user: UserEntity, article: ArticleEntity): boolean {
        return article.author.id == user.id;
    }

    async updateArticle(slug: string, user: UserEntity, data: UpdateArticleDTO) {
        const article = await this.findBySlug(slug);
        if (this.ensureOwnership(user, article)) {
            this.articleRepo.update({ slug: slug }, data);
            return (await this.findBySlug(slug)).toArticle(user);
        }
        throw new UnauthorizedException();
    }

    async deleteArticle(slug: string, user: UserEntity) {
        const article = await this.findBySlug(slug);
        if (this.ensureOwnership(user, article)) {
            await this.articleRepo.remove(article);
        }
        throw new UnauthorizedException();
    }
}
