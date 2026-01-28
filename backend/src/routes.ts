import {Request, Response, Router} from 'express';
import {FetchProvider} from "./data/fetch-provider.service";

const router = Router();
let fetchProvider: FetchProvider;

router.get('/getAllBrands', (req: Request, res: Response) => {
    getProvider().getBrands().then((data: any) => {
        res.json(data);
    });
});

function getProvider() {
    if (fetchProvider) {
        return fetchProvider;
    } else {
        fetchProvider = new FetchProvider();
    }
    return fetchProvider;
}

export default router;