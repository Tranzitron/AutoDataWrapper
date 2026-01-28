export interface Models {
  id?: number;
  brand_id: number;
  name: string;
  url: string;
  updated_at?: Date;
  is_active?: boolean;
}

export interface Brand {
  id?: number;
  name: string;
  url: string;
  updated_at?: Date;
  is_active?: boolean;
}

export interface BrandJsonModel {
  scrapedAt: string,
  sourceUrl: string,
  brands: {
    href: string,
    name: string,
  }[],
}

export interface BrandViewModel {
  href: string
  name: string
}
