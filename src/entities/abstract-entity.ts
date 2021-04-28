import { BaseEntity, CreateDateColumn, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class AbstractEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
}