import "reflect-metadata"
import {ScraperEngine} from './ScraperEngine';
import {Brand, Model} from "../entity/entities";
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
                .filter((item) => item.url !== null);
        });
    }

    private async scrapeModelsByBrandUrl(brandUrl: string): Promise<any[]> {
        const url = `https://www.auto-data.net/en/${brandUrl}`;

        await this.scraper.initialize();
        await this.scraper.goto(url);

        const modelsData = await this.scraper.page!.evaluate(() => {
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
        });

        return modelsData
    }

    //#endregion
}
