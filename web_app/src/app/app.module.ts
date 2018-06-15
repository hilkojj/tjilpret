import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { MaterializeModule } from 'angular2-materialize';

import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './/app-routing.module';
import { ThemeService } from './services/theme/theme.service';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MaterializeModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (themeService: ThemeService) => () => themeService.load(),
      deps: [ThemeService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
