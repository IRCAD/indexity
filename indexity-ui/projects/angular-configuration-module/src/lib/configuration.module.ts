import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { HttpClientModule } from '@angular/common/http';
import { CONFIGURATION_MODULE_OPTIONS } from './configuration.token';
import { ConfigurationModuleOptions } from './configuration-module-options.interface';

export const serviceInitializerFactory = (
  configurationService: ConfigurationService,
) => () => configurationService.loadConfig().toPromise();

// https://github.com/ng-packagr/ng-packagr/issues/696
// @dynamic
@NgModule({
  imports: [HttpClientModule],
})
export class ConfigurationModule {
  static forRoot(options: ConfigurationModuleOptions): ModuleWithProviders {
    return {
      ngModule: ConfigurationModule,
      providers: [
        ConfigurationService,
        {
          provide: CONFIGURATION_MODULE_OPTIONS,
          useValue: options,
        },
        {
          provide: APP_INITIALIZER,
          useFactory: serviceInitializerFactory,
          deps: [ConfigurationService],
          multi: true,
        },
      ],
    };
  }
}
