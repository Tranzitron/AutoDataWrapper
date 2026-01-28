// interface ModelsScraperOptions {
//   debug?: boolean;
//   headless?: boolean;
//   timeout?: number;
// }

// export class ModelsScraper {
//   private scraper: ScraperEngine;
//   private readonly debug: boolean;
//   private readonly debugBrands: { name: string; href: string }[];
//
//   constructor(options: ModelsScraperOptions = {}) {
//     this.scraper = new ScraperEngine({
//       headless: options.headless ?? true,
//       timeout: options.timeout ?? 60000,
//     });
//     this.debug = options.debug ?? false;
//     this.debugBrands = [
//       // { name: 'Audi', href: '/en/audi-brand-41' },
//       {name: 'BMW', href: '/en/bmw-brand-86'},
//       // { name: 'Volkswagen', href: '/en/volkswagen-brand-80' },
//     ];
//   }
//
//   public async execute() {
//     try {
//       const brands = this.debug ? this.debugBrands : await getBrandsOrFetch();
//       console.log(`Processing ${brands.length} brands...`);
//
//       for (const brand of brands) {
//         console.log(`Scraping models for ${brand.name}...`);
//         await this.scrapeBrandModels(brand);
//         await new Promise((resolve) => setTimeout(resolve, 2000));
//       }
//     } finally {
//       await this.scraper.close();
//     }
//   }
//
//   private async scrapeBrandModels(brand: { name: string; href: string }) {
//     const fullUrl = `https://www.auto-data.net${brand.href}`;
//
//     await this.scraper.initialize();
//     await this.scraper.goto(fullUrl);
//
//     const modelsData = await this.scraper.page!.evaluate(() => {
//       const modelLinks = Array.from(document.querySelectorAll('a.modeli'));
//
//       return {
//         brandTitle: document.title.split('|')[0].trim(),
//         models: modelLinks
//           .map((link) => ({
//             name: link.querySelector('strong')?.textContent || '?',
//             href: link.getAttribute('href') || '',
//             startYear:
//               link.querySelector('div')?.textContent?.split('-')[0].trim() ||
//               '',
//             stopYear:
//               link.querySelector('div')?.textContent?.split('-')[1]?.trim() ||
//               '',
//           }))
//           .filter((model) => model.href), // Filter out any entries without href
//       };
//     });
//
//     console.log(`Brand ${modelsData.brandTitle}:`);
//     console.log(modelsData.models);
//     return modelsData;
//   }
// }

// export class BrandProvider {
//   private scraper: ScraperEngine;
//   private fileName: string = 'brand-links.json';
//
//   constructor(options: ModelsScraperOptions = {}) {
//     this.scraper = new ScraperEngine({
//       headless: options.headless ?? true,
//       timeout: options.timeout ?? 60000,
//     });
//   }
//
//   public async getBrands() {
//     try {
//       let dataResult: BrandJsonModel = await this.readBrandLinks();
//       if (dataResult.brands.length == 0) {
//         dataResult = await this.scrapeBrandLinks();
//         await writeToFile(dataResult, this.fileName);
//       }
//       return dataResult.brands;
//     } finally {
//       await this.scraper.close();
//     }
//   }
//
//   private async readBrandLinks(): Promise<BrandJsonModel> {
//     const filePath = path.join(process.cwd(), 'output', this.fileName);
//     let data = await fs.readFile(filePath, 'utf-8');
//     let jsonData: BrandJsonModel = JSON.parse(data);
//     return jsonData || [];
//   }
//
//   private async scrapeBrandLinks(): Promise<BrandJsonModel> {
//     const url = 'https://www.auto-data.net/en/allbrands';
//
//     await this.scraper.initialize();
//     await this.scraper.goto(url);
//
//     const brandLinks = await this.scraper.page!.evaluate(() => {
//       const links = document.querySelectorAll('div.brands > a');
//
//       return Array.from(links)
//         .map((a) => {
//           const href = a.getAttribute('href');
//           const brandName = a.querySelector('strong')?.textContent?.trim();
//
//           return {
//             href: href,
//             name: brandName || '',
//           };
//         })
//         .filter((item) => item.href !== null);
//     });
//
//     return {
//       scrapedAt: new Date().toISOString(),
//       sourceUrl: url,
//       brands: brandLinks,
//     };
//   }
// }
