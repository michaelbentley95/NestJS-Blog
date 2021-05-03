import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { classToPlain, Exclude } from "class-transformer";
import { IsEmail } from "class-validator";
import { AbstractEntity } from "./abstract-entity";
import { ProfileResponse } from "src/models/user.model";
import { ArticleEntity } from "./article.entity";

@Entity('users')
export class UserEntity extends AbstractEntity {
    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column({ unique: true })
    username: string;

    @Column({ default: '' })
    bio: string;

    @Column({ default: null, nullable: true })
    image: string | null;

    @Column()
    @Exclude()
    password: string;

    @JoinTable()
    @ManyToMany(type => UserEntity, user => user.follows)
    followers: UserEntity[];

    @ManyToMany(type => UserEntity, user => user.followers)
    follows: UserEntity[];

    @ManyToMany(type => ArticleEntity, article => article.favoritedBy)
    favorites: UserEntity[];

    @OneToMany(type => ArticleEntity, article => article.author)
    articles: ArticleEntity[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async comparePassword(attempt: string) {
        return await bcrypt.compare(attempt, this.password);
    }

    toJSON() {
        return classToPlain(this);
    }

    toProfile(user?: UserEntity): ProfileResponse {
        let following = null;
        if (user) {
            following = this.followers.some(follower => follower.id === user.id);
        }
        const profile: any = this.toJSON();
        delete profile.followers;
        return { ...profile, following };
    }
}