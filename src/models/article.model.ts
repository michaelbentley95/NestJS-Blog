import { IsArray, IsOptional, IsString, MinLength } from "class-validator";

export class CreateArticleDTO {
    @IsString()
    title: string;

    @IsString()
    body: string;

    @IsString()
    description: string;

    @IsArray()
    @IsString({ each: true })
    tagList: string[];
}

export class UpdateArticleDTO {
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    body: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tagList: string[];
}

export interface GetFeedQuery {
    limit?: number;
    offset?: number;
}

export interface GetAllQuery extends GetFeedQuery {
    tag?: string;
    author?: string;
    favorited?: string;
}