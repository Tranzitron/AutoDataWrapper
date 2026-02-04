import "reflect-metadata"
import {ScraperEngine} from './ScraperEngine';
import {Brand} from "../entity/entities";
import {AppDataSource} from "../data-source";

export class FetchProvider {

    private scraper: ScraperEngine;

    constructor() {
        this.scraper = new ScraperEngine({
            headless: true,
            timeout: 60000,
        });
    }

    //#region Public Service Calls
    async getBrands(): Promise<Brand[]> {
        let dataResult: Brand[] = [];
        try {
            dataResult = await this.getStoredBrands();
            if (dataResult.length == 0) {
                const scrapedData = await this.scrapeBrands();
                let brands: Brand[] = [];
                scrapedData.forEach((item: any) => {
                    let brand: Brand = new Brand();
                    brand.name = item.name;
                    brand.url = item.url;
                    brands.push(brand);
                })
                await AppDataSource.manager.insert(Brand, brands);
                await AppDataSource.manager.save(brands);
                dataResult = brands;
            }
        } catch (e) {
            console.log(e);
        } finally {
            await this.scraper.close();
        }
        return dataResult;
    }

    // async getModelsByBrandId(brandId: number): Promise<any> {
    //     try {
    //         let dataResult: BrandJsonModel = await this.getStoredBrands();
    //         if (dataResult.brands.length == 0) {
    //             dataResult = await this.scrapeBrands();
    //             await writeToFile(dataResult, this.brandsFileName);
    //         } else {
    //             let models = dataResult.brands.filter(brand => brand.href == brandId);
    //         }
    //         return dataResult;
    //     } finally {
    //         await this.scraper.close();
    //     }
    // }

    //#endregion

    private async getStoredBrands(): Promise<Brand[]> {
        const brands = await AppDataSource.manager.find(Brand);
        return brands || [];
    }

    //#region Scraping calls
    private async scrapeBrands(): Promise<any[]> {
        const url = 'https://www.auto-data.net/en/allbrands';

        await this.scraper.initialize();
        await this.scraper.goto(url);

        return await this.scraper.page!.evaluate(() => {
            const links = document.querySelectorAll('div.brands > a');
            return Array.from(links)
                .map((a) => {
                    const url = a.getAttribute('href')?.split('/')[2];
                    const brandName = a.querySelector('strong')?.textContent?.trim();

                    return {
                        name: brandName || '',
                        url: url || ''
                    };
                })
                .filter((item) => item.url !== null);
        });
    }

    //#endregion
}
