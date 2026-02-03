import {ScraperEngine} from './ScraperEngine';
import {BrandJsonModel} from '../../../library/src/models';
import {fileExistsAsync, writeToFile} from './fileWriter';
import path from 'path';
import fs from 'fs/promises';

export class FetchProvider {
    private scraper: ScraperEngine;
    private brandsFileName: string = 'brand-links.json';

    constructor() {
        this.scraper = new ScraperEngine({
            headless: true,
            timeout: 60000,
        });
    }

    //#region Public Service Calls
    async getBrands(): Promise<BrandJsonModel> {
        try {
            let dataResult: BrandJsonModel = await this.getStoredBrands();
            if (dataResult.brands.length == 0) {
                dataResult = await this.scrapeBrands();
                await writeToFile(dataResult, this.brandsFileName);
            }
            return dataResult;
        } finally {
            await this.scraper.close();
        }
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

    //#region Stored calls
    private async getStoredBrands(): Promise<BrandJsonModel> {
        const filePath = path.join(process.cwd(), 'output', this.brandsFileName);
        let data: string = '';
        if (await fileExistsAsync(filePath)) {
            data = await fs.readFile(filePath, 'utf-8');
        }

        if (!data.trim()) {
            return {
                scrapedAt: "",
                sourceUrl: "",
                brands: [],
            };
        }
        let jsonData: BrandJsonModel = JSON.parse(data);
        return jsonData || [];
    }

    //#endregion

    //#region Scraping calls
    private async scrapeBrands(): Promise<BrandJsonModel> {
        const url = 'https://www.auto-data.net/en/allbrands';

        await this.scraper.initialize();
        await this.scraper.goto(url);

        const brandLinks = await this.scraper.page!.evaluate(() => {
            const links = document.querySelectorAll('div.brands > a');

            return Array.from(links)
                .map((a) => {
                    const href = a.getAttribute('href')?.split('/')[2];
                    const brandName = a.querySelector('strong')?.textContent?.trim();

                    return {
                        href: href || '',
                        name: brandName || '',
                    };
                })
                .filter((item) => item.href !== null);
        });

        return {
            scrapedAt: new Date().toISOString(),
            sourceUrl: url,
            brands: brandLinks,
        };
    }

    //#endregion
}
