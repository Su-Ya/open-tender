import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { StatisticalComponent } from './views/statistical/statistical.component';
import { SuccessfulTendererAnalysisComponent } from './views/successful-tenderer-analysis/successful-tenderer-analysis.component';
import { Page404Component } from './views/page404/page404.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    StatisticalComponent,
    SuccessfulTendererAnalysisComponent,
    Page404Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
