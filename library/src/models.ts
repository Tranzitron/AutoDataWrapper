export interface Brand {
    id: number;
    name: string;
    url: string;
    updatedAt: Date;
    imageUrl?: string;
    models: Model[];
}

export interface Model {
    id: number;
    name: string;
    url: string;
    updatedAt: Date;
    startYear: Date;
    endYear: Date;
    imageUrl: string;
    brand: Brand;
    generations: Generation[];
}

export interface Generation  {
    id: number;
    name: string;
    url: string;
    updatedAt: Date;
    startYear: Date;
    endYear: Date;
    imageUrl: string;
    model: Model;
    trims: Trim[];
}

export interface Trim  {
    id: number;
    name: string;
    url: string;
    updatedAt: Date;
    startYear: Date;
    endYear: Date;
    generation: Generation;
}