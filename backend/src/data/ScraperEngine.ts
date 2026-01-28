import puppeteer, {Browser, Page} from 'puppeteer';

interface ScraperOptions {
    headless?: boolean;
    timeout?: number;
}

export class ScraperEngine {
    protected browser: Browser | null = null;

    constructor(protected options: ScraperOptions = {}) {
        this.options = {
            headless: true,
            timeout: 30000,
            ...options,
        };
    }

    private _page: Page | null = null;

    get page(): Page | null {
        return this._page;
    }

    public async initialize() {
        this.browser = await puppeteer.launch({
            headless: this.options.headless,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        this._page = await this.browser.newPage();
        await this._page.setViewport({width: 1600, height: 900});
    }

    public async goto(url: string) {
        if (!this._page) await this.initialize();
        await this._page!.goto(url, {
            waitUntil: 'networkidle2',
            timeout: this.options.timeout,
        });
    }

    public async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}
