import { BeforeInsert, Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import slugify from "slug";
import { UserEntity } from "./user.entity";

@Entity('articles')
export class ArticleEntity extends AbstractEntity {

    @Column()
    title: string;
    @Column()
    description: string;
    @Column()
    slug: string;
    @Column()
    body: string;

    @ManyToMany(type => UserEntity, user => user.favorites)
    @JoinColumn()
    favoritedBy: UserEntity[]

    @ManyToOne(type => UserEntity, user => user.articles)
    author: UserEntity;

    @BeforeInsert()
    generateSlug() {
        this.slug = slugify(this.title, { lower: true }) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
    }

}