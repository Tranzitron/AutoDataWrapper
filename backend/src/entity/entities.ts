import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

//TODO TRY EntityBaseWithDate extends EntiyBase, for startYear & endYear
export abstract class EntityBase {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name: string = "";

    @Column()
    url: string = "";

    @UpdateDateColumn()
    updatedAt!: Date;
}

@Entity()
export class Brand extends EntityBase {

    @Column({nullable: true})
    imageUrl?: string;

    @OneToMany(() => Model, (model) => model.brand, {onDelete: "CASCADE"})
    models!: Model[]

}

@Entity()
export class Model extends EntityBase {

    @Column()
    startYear: Date = new Date();

    @Column()
    endYear: Date = new Date();

    @Column()
    imageUrl: string = "";

    @ManyToOne(() => Brand, (brand) => brand.models)
    brand!: Brand;

    @OneToMany(() => Generation, (generation) => generation.model, {onDelete: "CASCADE"})
    generations!: Generation[]

}

@Entity()
export class Generation extends EntityBase {

    @Column()
    startYear: Date = new Date();

    @Column()
    endYear: Date = new Date();

    @Column()
    imageUrl: string = "";

    @ManyToOne(() => Model, (model) => model.generations)
    model!: Model;

    @OneToMany(() => Trim, (trim) => trim.generation, {onDelete: "CASCADE"})
    trims!: Trim[];

}

@Entity()
export class Trim extends EntityBase {

    @Column()
    startYear: Date = new Date();

    @Column()
    endYear: Date = new Date();

    @ManyToOne(() => Generation, (generation) => generation.trims)
    generation!: Generation;

}

export interface BrandJsonModel {
    scrapedAt: string,
    sourceUrl: string,
    brands: BrandViewModel[],
}

export interface BrandViewModel {
    href: string
    name: string
}