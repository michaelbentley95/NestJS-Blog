import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { CreateArticleDTO, UpdateArticleDTO } from 'src/models/article.model';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
    constructor(private articleService: ArticleService) { }

    @Get('/:slug')
    @UseGuards(new OptionalAuthGuard())
    async findBySlug(@Param('slug') slug: string, @User() user: UserEntity) {
        return { article: await (await this.articleService.findBySlug(slug)).toArticle(user) };
    }

    @Post()
    @UseGuards(AuthGuard())
    async createArticle(@User() user: UserEntity, @Body(ValidationPipe) data: { article: CreateArticleDTO }) {
        return { article: await this.articleService.createArticle(user, data.article) };
    }

    @Put('/:slug')
    @UseGuards(AuthGuard())
    async updateArticle(@Param('slug') slug: string, @User() user: UserEntity, @Body(ValidationPipe) data: { article: UpdateArticleDTO }) {
        return { article: await this.articleService.updateArticle(slug, user, data.article) };
    }

    @Delete('/:slug')
    @UseGuards(AuthGuard())
    async deleteArticle(@Param('slug') slug: string, @User() user: UserEntity) {
        return { article: await this.articleService.deleteArticle(slug, user) };
    }
}
