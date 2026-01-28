import {ScraperEngine} from './ScraperEngine';
import {BrandJsonModel} from './models';
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

    async getBrands(): Promise<BrandJsonModel> {
        try {
            let dataResult: BrandJsonModel = await this.readBrandLinks();
            if (dataResult.brands.length == 0) {
                dataResult = await this.scrapeBrandLinks();
                await writeToFile(dataResult, this.brandsFileName);
            }
            return dataResult;
        } finally {
            await this.scraper.close();
        }
    }

    private async readBrandLinks(): Promise<BrandJsonModel> {
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

    private async scrapeBrandLinks(): Promise<BrandJsonModel> {
        const url = 'https://www.auto-data.net/en/allbrands';

        await this.scraper.initialize();
        await this.scraper.goto(url);

        const brandLinks = await this.scraper.page!.evaluate(() => {
            const links = document.querySelectorAll('div.brands > a');

            return Array.from(links)
                .map((a) => {
                    const href = a.getAttribute('href');
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
}
