import "reflect-metadata"
import {ScraperEngine} from './ScraperEngine';
import {Brand, Generation, Model, Trim, TrimDetails} from "../entity/entities";
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
            if (model == null) {
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
                model = await this.getStoredModelWithGenerations(modelId);
            }
        } catch (e) {
            console.log(e);
        } finally {
            await this.scraper.close();
        }
        return model;
    }

    async getGenerationWithTrims(generationId: number): Promise<Generation | null> {
        let generation: Generation | null = null;
        try {
            generation = await this.getStoredGenerationWithTrims(generationId);
            if (generation == null) {
                return null;
            } else if (generation.trims == null || generation.trims.length == 0) {
                const scrapedData = await this.scrapeTrimsByGenerationUrl(generation.url);
                let trims: Trim[] = [];
                scrapedData.forEach((item: any) => {
                    let trim: Trim = new Trim();
                    trim.name = item.name;
                    trim.url = item.url;
                    trim.startYear = item.startYear;
                    trim.endYear = item.endYear;
                    trim.generation = generation!;
                    trims.push(trim);
                })
                await AppDataSource.manager.insert(Trim, trims);
                await AppDataSource.manager.save(trims);
                generation = await this.getStoredGenerationWithTrims(generationId);
            }
        } catch (e) {
            console.log(e);
        } finally {
            await this.scraper.close();
        }
        return generation;
    }

    async getTrimWithDetails(trimId: number): Promise<Trim | null> {
        let trim: Trim | null = null;
        try {
            trim = await this.getStoredTrimWithTrimDetails(trimId);
            if (trim == null) {
                return null;
            } else if (trim.trimDetails == null) {
                const trimDetailsScraped: any = await this.scrapeTrimDetailsByTrimUrl(trim.url);
                const trimDetails = Object.assign(new TrimDetails(), trimDetailsScraped) as TrimDetails;

                await AppDataSource.manager.insert(TrimDetails, trimDetails);
                await AppDataSource.manager.save(trimDetails);
                trim = await this.getStoredTrimWithTrimDetails(trimId);
            }
        } catch (e) {
            console.log(e);
        } finally {
            await this.scraper.close();
        }
        return trim;
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
            console.warn(`getStoredModelWithGenerations: No Model for modelId:${modelId}`);
            return null;
        } else if (model.brand == null) {
            console.warn(`getStoredModelWithGenerations: No Brand for modelId:${modelId}`);
            return null;
        }

        return model;
    }

    private async getStoredGenerationWithTrims(generationId: number): Promise<Generation | null> {
        const generation = await AppDataSource.manager.findOne(Generation, {
            where: {
                id: generationId,
            },
            relations: {
                trims: true,
                model: true,
            },
        });

        if (generation == null) {
            console.warn(`getStoredGenerationWithTrims: No Generation for generationId:${generationId}`);
            return null;
        } else if (generation.model == null) {
            console.warn(`getStoredGenerationWithTrims: No Model for generationId:${generationId}`);
            return null;
        }

        return generation;
    }

    private async getStoredTrimWithTrimDetails(trimId: number): Promise<Trim | null> {
        const trim = await AppDataSource.manager.findOne(Trim, {
            where: {
                id: trimId,
            },
            relations: {
                generation: true,
                trimDetails: true,
            },
        });

        if (trim == null) {
            console.warn(`getStoredTrim: No Trim for trimId:${trimId}`);
            return null;
        }
        /*else if (trim.trimDetails == null) {
            console.warn(`getStoredTrim: No TrimDetails for trimId:${trimId}`);
            return null;
        }*/

        return trim;
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

    private async scrapeGenerationsByModelUrl(modelUrl: string): Promise<any[]> {
        const url = `https://www.auto-data.net/en/${modelUrl}`;

        await this.scraper.initialize();
        await this.scraper.goto(url);

        return await this.scraper.page!.evaluate(() => {
            const generationLinks = Array.from(document.querySelectorAll('table.generr tr.f'));
            return generationLinks
                .map((element) => {
                    const top = element.querySelector('th.i > a');
                    const name = top?.querySelector('strong')?.textContent.trim();
                    const url = top?.getAttribute('href')?.split('/')[2];

                    const bottom = element.querySelector('td.i > a');
                    const chassisType = bottom?.querySelector('strong.chas')?.textContent.trim();

                    const yearCurElement = element.querySelector('.cur');
                    const yearEndElement = element.querySelector('.end');
                    const year = (yearCurElement ?? yearEndElement)?.textContent?.trim();
                    const startYear = year?.split('-')[0].trim();
                    const endYear = year?.split('-')[1].trim();

                    return {
                        name: name || '',
                        url: url || '',
                        startYear: startYear || '',
                        endYear: endYear || '',
                        chassisType: chassisType || '',
                    }
                })
                .filter((generation) => generation.url) // Filter out any entries without href;
        })
    }

    private async scrapeTrimsByGenerationUrl(generationUrl: string): Promise<any[]> {
        const url = `https://www.auto-data.net/en/${generationUrl}`;

        await this.scraper.initialize();
        await this.scraper.goto(url);

        return await this.scraper.page!.evaluate(() => {
            const trimLinks = Array.from(document.querySelectorAll('table.carlist tr.i'));
            return trimLinks
                .map((element) => {
                    const top = element.querySelector('th.i > a');
                    const name = top?.querySelector('.tit')?.textContent.trim();
                    const url = top?.getAttribute('href')?.split('/')[2];

                    const yearCurElement = element.querySelector('.cur');
                    const yearEndElement = element.querySelector('.end');
                    const year = (yearCurElement ?? yearEndElement)?.textContent?.trim();
                    const startYear = year?.split('-')[0].trim();
                    const endYear = year?.split('-')[1].trim();

                    return {
                        name: name || '',
                        url: url || '',
                        startYear: startYear || '',
                        endYear: endYear || '',
                    }
                })
                .filter((trim) => trim.url) // Filter out any entries without href;
        })
    }

    private async scrapeTrimDetailsByTrimUrl(trimUrl: string): Promise<any> {
        const url = `https://www.auto-data.net/en/${trimUrl}`;

        await this.scraper.initialize();
        await this.scraper.goto(url);

        return await this.scraper.page!.evaluate(() => {
            const trimDetails: any = {};

            const rows = document.querySelectorAll('table.cardetailsout tbody tr');

            const cleanText = (element: Element | null): string => {
                if (!element) return '';
                return element.textContent?.trim().replace(/\s+/g, ' ') || '';
            };

            const getMainValue = (td: Element): string => {
                const text = td.childNodes[0]?.textContent?.trim() || '';
                return text.replace(/\s+/g, ' ').trim();
            };

            rows.forEach(row => {
                const th = row.querySelector('th');
                const td = row.querySelector('td');

                if (!th || !td) return;

                const label = cleanText(th).toLowerCase();
                const value = getMainValue(td);

                // Map the values to trimDetails properties
                // General information
                if (label.includes('brand')) trimDetails.brand = value;
                else if (label.includes('model') && !label.includes('code')) trimDetails.model = value;
                else if (label.includes('generation')) trimDetails.generation = value;
                else if (label.includes('modification') || label.includes('engine)')) trimDetails.modification = value;
                else if (label.includes('start of production')) trimDetails.startOfProduction = value;
                else if (label.includes('end of production')) trimDetails.endOfProduction = value;
                else if (label.includes('powertrain architecture')) trimDetails.powertrainArchitecture = value;
                else if (label.includes('body type')) trimDetails.bodyType = value;
                else if (label.includes('seats')) trimDetails.seats = value;
                else if (label.includes('doors')) trimDetails.doors = value;

                // Performance specs
                else if (label.includes('fuel consumption') && label.includes('urban') && !label.includes('extra')) trimDetails.fuelConsumptionUrban = value;
                else if (label.includes('fuel consumption') && label.includes('extra urban')) trimDetails.fuelConsumptionExtraUrban = value;
                else if (label.includes('fuel consumption') && label.includes('combined')) trimDetails.fuelConsumptionCombined = value;
                else if (label.includes('co2')) trimDetails.co2Emissions = value;
                else if (label.includes('fuel type')) trimDetails.fuelType = value;
                else if (label.includes('acceleration 0 - 100')) trimDetails.acceleration0100 = value;
                else if (label.includes('acceleration 0 - 62')) trimDetails.acceleration062 = value;
                else if (label.includes('acceleration 0 - 60')) trimDetails.acceleration060 = value;
                else if (label.includes('maximum speed')) trimDetails.maximumSpeed = value;
                else if (label.includes('emission standard')) trimDetails.emissionStandard = value;
                else if (label.includes('weight-to-power')) trimDetails.weightToPowerRatio = value;
                else if (label.includes('weight-to-torque')) trimDetails.weightToTorqueRatio = value;

                // Engine specs
                else if (label.includes('power') && !label.includes('steering')) trimDetails.power = value;
                else if (label.includes('power per litre')) trimDetails.powerPerLitre = value;
                else if (label.includes('torque')) trimDetails.torque = value;
                else if (label.includes('engine layout')) trimDetails.engineLayout = value;
                else if (label.includes('engine model') || label.includes('engine code')) trimDetails.engineModelCode = value;
                else if (label.includes('engine displacement')) trimDetails.engineDisplacement = value;
                else if (label.includes('number of cylinders')) trimDetails.numberOfCylinders = value;
                else if (label.includes('engine configuration')) trimDetails.engineConfiguration = value;
                else if (label.includes('cylinder bore')) trimDetails.cylinderBore = value;
                else if (label.includes('piston stroke')) trimDetails.pistonStroke = value;
                else if (label.includes('compression ratio')) trimDetails.compressionRatio = value;
                else if (label.includes('valves per cylinder')) trimDetails.valvesPerCylinder = value;
                else if (label.includes('fuel injection')) trimDetails.fuelInjectionSystem = value;
                else if (label.includes('engine aspiration')) trimDetails.engineAspiration = value;
                else if (label.includes('engine oil capacity')) trimDetails.engineOilCapacity = value;
                else if (label.includes('engine oil specification')) {
                    // Handle locked content
                    const lockImg = td.querySelector('img.datalock');
                    if (lockImg) {
                        trimDetails.engineOilSpecification = '?';
                    } else {
                        trimDetails.engineOilSpecification = value;
                    }
                } else if (label.includes('coolant')) trimDetails.coolantCapacity = value;

                // Space, Volume and weights
                else if (label.includes('kerb weight') || label.includes('curb weight')) trimDetails.kerbWeight = value;
                else if (label.includes('max. weight')) trimDetails.maxWeight = value;
                else if (label.includes('max load')) trimDetails.maxLoad = value;
                else if (label.includes('trunk') || label.includes('boot space')) trimDetails.trunkSpaceMin = value;
                else if (label.includes('fuel tank capacity')) trimDetails.fuelTankCapacity = value;
                else if (label.includes('max. roof load')) trimDetails.maxRoofLoad = value;
                else if (label.includes('permitted trailer load with brakes')) trimDetails.permittedTrailerLoadWithBrakes = value;
                else if (label.includes('permitted trailer load without brakes')) trimDetails.permittedTrailerLoadWithoutBrakes = value;
                else if (label.includes('permitted towbar download')) trimDetails.permittedTowbarDownload = value;

                // Dimensions
                else if (label.includes('length')) trimDetails.length = value;
                else if (label.includes('width') && !label.includes('including')) trimDetails.width = value;
                else if (label.includes('width including mirrors')) trimDetails.widthIncludingMirrors = value;
                else if (label.includes('height')) trimDetails.height = value;
                else if (label.includes('wheelbase')) trimDetails.wheelbase = value;
                else if (label.includes('front track')) trimDetails.frontTrack = value;
                else if (label.includes('rear') && label.includes('track')) trimDetails.rearTrack = value;
                else if (label.includes('ride height') || label.includes('ground clearance')) trimDetails.rideHeight = value;
                else if (label.includes('drag coefficient')) trimDetails.dragCoefficient = value;
                else if (label.includes('minimum turning circle')) trimDetails.minimumTurningCircle = value;

                // Drivetrain, brakes and suspension
                else if (label.includes('drive wheel')) trimDetails.driveWheel = value;
                else if (label.includes('number of gears') || label.includes('gearbox')) trimDetails.gearbox = value;
                else if (label.includes('front suspension')) trimDetails.frontSuspension = value;
                else if (label.includes('rear suspension')) trimDetails.rearSuspension = value;
                else if (label.includes('front brakes')) trimDetails.frontBrakes = value;
                else if (label.includes('rear brakes')) trimDetails.rearBrakes = value;
                else if (label.includes('assisting systems')) {
                    const systems = Array.from(td.querySelectorAll('br')).map(() => '');
                    const text = td.innerHTML.replace(/<br\s*\/?>/g, '|').replace(/<[^>]*>/g, '');
                    trimDetails.assistingSystems = text.replace(/\|/g, ', ').trim();
                } else if (label.includes('steering type') && !label.includes('power')) trimDetails.steeringType = value;
                else if (label.includes('power steering')) trimDetails.powerSteering = value;
                else if (label.includes('tires size') || label.includes('tyres size')) trimDetails.tiresSize = value;
                else if (label.includes('wheel rims size')) trimDetails.wheelRimsSize = value;
            });

            return trimDetails;
        });
    }

    //#endregion
}
