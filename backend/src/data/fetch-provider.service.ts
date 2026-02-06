import "reflect-metadata"
import {ScraperEngine} from './ScraperEngine';
import {Brand, Generation, Model} from "../entity/entities";
import {AppDataSource} from "../data-source";

export class FetchProvider {

    private scraper: ScraperEngine;

    constructor() {
        this.scraper = new ScraperEngine({
            headless: true,
            timeout: 60000,
        });
    }

    //#region Service methods
    async getBrands(): Promise<Brand[]> {
        let brands: Brand[] = [];
        try {
            brands = await this.getStoredBrands();
            if (brands.length == 0) {
                const scrapedData = await this.scrapeBrands();
                let tempBrands: Brand[] = [];
                scrapedData.forEach((item: any) => {
                    let brand: Brand = new Brand();
                    brand.name = item.name;
                    brand.url = item.url;
                    brand.imageUrl = "";
                    tempBrands.push(brand);
                })
                await AppDataSource.manager.insert(Brand, tempBrands);
                await AppDataSource.manager.save(tempBrands);
                brands = tempBrands;
            }
        } catch (e) {
            console.log(e);
        } finally {
            await this.scraper.close();
        }
        return brands;
    }

    async getBrandWithModels(brandId: number): Promise<Brand | null> {
        let brand: Brand | null = null;
        try {
            brand = await this.getStoredBrandWithModels(brandId);
            if (brand == null) {
                return null;
            } else if (brand.models == null || brand.models.length == 0) {
                const scrapedData = await this.scrapeModelsByBrandUrl(brand.url);
                let models: Model[] = [];
                scrapedData.forEach((item: any) => {
                    let model: Model = new Model();
                    model.name = item.name;
                    model.url = item.url;
                    model.startYear = item.startYear;
                    model.endYear = item.endYear;
                    model.imageUrl = "";
                    model.brand = brand!;
                    models.push(model);
                })
                await AppDataSource.manager.insert(Model, models);
                await AppDataSource.manager.save(models);
                brand = await this.getStoredBrandWithModels(brandId);
            }
        } catch (e) {
            console.log(e);
        } finally {
            await this.scraper.close();
        }
        return brand;
    }

    async getModelWithGenerations(modelId: number): Promise<Model | null> {
        let model: Model | null = null;
        try {
            model = await this.getStoredModelWithGenerations(modelId);
            if (model == null || model.brand == null) {
                return null;
            } else if (model.generations == null || model.generations.length == 0) {
                const scrapedData = await this.scrapeGenerationsByModelUrl(model.url);
                let generations: Generation[] = [];
                scrapedData.forEach((item: any) => {
                    let generation: Generation = new Generation();
                    generation.name = item.name;
                    generation.url = item.url;
                    generation.startYear = item.startYear;
                    generation.endYear = item.endYear;
                    generation.chassisType = item.chassisType;
                    generation.imageUrl = "";
                    generation.model = model!;
                    generations.push(generation);
                })
                await AppDataSource.manager.insert(Generation, generations);
                await AppDataSource.manager.save(generations);
                model = await this.getModelWithGenerations(modelId);
            }
        } catch (e) {
            console.log(e);
        } finally {
            await this.scraper.close();
        }
        return model;
    }

    //#endregion

    //#region Stored methods
    private async getStoredBrands(): Promise<Brand[]> {
        const brands = await AppDataSource.manager.find(Brand);
        return brands || [];
    }

    private async getStoredBrandWithModels(brandId: number): Promise<Brand | null> {
        const brand = await AppDataSource.manager.findOne(Brand, {
            where: {
                id: brandId,
            },
            relations: {
                models: true,
            },
        });
        if (brand == null) {
            console.warn(`getStoredModelsByBrandId: brandId:${brandId} not found`);
            return null;
        }
        return brand;
    }

    private async getStoredModelWithGenerations(modelId: number): Promise<Model | null> {
        const model = await AppDataSource.manager.findOne(Model, {
            where: {
                id: modelId,
            },
            relations: {
                generations: true,
                brand: true,
            },
        });
        if (model == null) {
            console.warn(`getStoredModelWithGenerations: modelId:${modelId} not found`);
            return null;
        } else if (model.brand == null) {
            console.warn(`getStoredModelWithGenerations: No Brand for modelId:${modelId}`);
            return null;
        }
        return model;
    }

    //#endregion

    //#region Scraping methods
    private async scrapeBrands(): Promise<any[]> {
        const url = 'https://www.auto-data.net/en/allbrands';

        await this.scraper.initialize();
        await this.scraper.goto(url);

        return await this.scraper.page!.evaluate(() => {
            const links = Array.from(document.querySelectorAll('div.brands > a'));
            return links
                .map((a) => {
                    const brandName = a.querySelector('strong')?.textContent?.trim();
                    const url = a.getAttribute('href')?.split('/')[2];

                    return {
                        name: brandName || '',
                        url: url || ''
                    };
                })
                .filter((item) => item.url);
        });
    }

    private async scrapeModelsByBrandUrl(brandUrl: string): Promise<any[]> {
        const url = `https://www.auto-data.net/en/${brandUrl}`;

        await this.scraper.initialize();
        await this.scraper.goto(url);

        return await this.scraper.page!.evaluate(() => {
            const modelLinks = Array.from(document.querySelectorAll('a.modeli'));

            return modelLinks
                .map((link) => {
                    const name = link.querySelector('strong')?.textContent;
                    const url = link.getAttribute('href')?.split('/')[2];
                    const startYear = link.querySelector('div')?.textContent?.split('-')[0].trim();
                    const endYear = link.querySelector('div')?.textContent?.split('-')[1]?.trim();

                    return {
                        name: name || '',
                        url: url || '',
                        startYear: startYear || '',
                        endYear: endYear || '',
                    }
                })
                .filter((model) => model.url) // Filter out any entries without href;
        })
    }

    private async scrapeGenerationsByModelUrl(modelUrl: string): Promise<any> {
        const url = `https://www.auto-data.net/en/${modelUrl}`;

        await this.scraper.initialize();
        await this.scraper.goto(url);


        return await this.scraper.page!.evaluate(() => {
            const generationElements = Array.from(document.querySelectorAll('table.generr > tbody'));
            return generationElements.map((value, index) => {
                const top = value.querySelector('th.i > a');
                const name = top?.querySelector('strong')?.textContent.trim();
                const url = top?.getAttribute('href')?.split('/')[2];

                const bottom = value.querySelector('td.i > a');
                const yearElement = bottom?.querySelector('strong.cur');
                const startYear = yearElement?.textContent?.split('-')[0].trim();
                const endYear = yearElement?.textContent?.split('-')[1]?.trim();
                const chassisType = bottom?.querySelector('strong.chas')?.textContent.trim();

                return {
                    name: name || '',
                    url: url || '',
                    startYear: startYear || '',
                    endYear: endYear || '',
                    chassisType: chassisType || '',
                };
            }).filter((generation) => generation.url);
        });
    }

    //#endregion
}
