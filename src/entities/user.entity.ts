import { BeforeInsert, Column, Entity } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { classToClass, classToPlain, Exclude } from "class-transformer";
import { IsEmail } from "class-validator";
import { AbstractEntity } from "./abstract-entity";

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

    //TODO: add following

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
}