import { AfterLoad, BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
const slug = require("slug");
import { UserEntity } from "./user.entity";
import { classToPlain } from "class-transformer";

@Entity('articles')
export class ArticleEntity extends AbstractEntity {

    @Column()
    title: string;
    @Column()
    description: string;
    @Column({ unique: true })
    slug: string;
    @Column()
    body: string;

    @ManyToMany(type => UserEntity, user => user.favorites, { eager: true })
    @JoinTable()
    favoritedBy: UserEntity[]

    favoriteCount: number;

    @ManyToOne(type => UserEntity, user => user.articles, { eager: true })
    author: UserEntity;

    @Column('simple-array')
    tagList: string[];

    @AfterLoad()
    async countFavorites() {
        // const { count } = await UserEntity.createQueryBuilder('favorite')
        //     .where('favorites.id = :id', { id: this.id })
        //     .select('COUNT(*)', 'count')
        //     .getRawOne()

        this.favoriteCount = 0;
    }

    @BeforeInsert()
    generateSlug() {
        this.slug = slug(this.title, { lower: true }) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
    }

    toJSON() {
        return classToPlain(this);
    }

    toArticle(user?: UserEntity) {
        let favorited = null;
        if (user && this.favoritedBy) {
            favorited = this.favoritedBy.some(favorited => favorited.id === user.id);
        }
        const article: any = this.toJSON();
        delete article.favoritedBy;
        return { ...article, favorited };
    }
}