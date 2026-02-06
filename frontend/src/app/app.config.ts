import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter, withNavigationErrorHandler, withRouterConfig} from '@angular/router';

import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withNavigationErrorHandler((e) => console.log(e)), withRouterConfig({
      canceledNavigationResolution: 'replace'
    })),
  ]
};
