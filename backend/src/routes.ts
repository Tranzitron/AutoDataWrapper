import {Request, Response, Router} from 'express';
import {FetchProvider} from "./data/fetch-provider.service";

const router = Router();
let fetchProvider: FetchProvider;

router.get('/brands', async (req: Request, res: Response) => {
    res.json(await getProvider().getBrands());
});

router.get('/brand/:brandId', (req: Request, res: Response) => {
    let brandId: number = parseInt(<string>req.params.brandId);
    getProvider().getBrandWithModels(brandId).then((data: any) => {
        res.json(data);
    });
});

router.get('/brand/:brandId/model/:modelId', (req: Request, res: Response) => {
    let brandId: number = parseInt(<string>req.params.brandId);
    let modelId: number = parseInt(<string>req.params.modelId);
    getProvider().getModelWithGenerations(modelId).then((data: any) => {
        res.json(data);
    });
});
//
// router.get('/brand/:brandId/models/modelId/generations/generationId', (req: Request, res: Response) => {
//     getProvider().getTrimByGenerationId().then((data: any) => {
//         res.json(data);
//     });
// });

function getProvider() {
    if (fetchProvider) {
        return fetchProvider;
    } else {
        fetchProvider = new FetchProvider();
    }
    return fetchProvider;
}

export default router;