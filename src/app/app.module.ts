import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { SuccessfulTendererAnalysisComponent } from './views/successful-tenderer-analysis/successful-tenderer-analysis.component';
import { Page404Component } from './views/page404/page404.component';
import { HttpClientModule } from '@angular/common/http';

import { AngularMaterialModules } from './plugins/angular-material';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SuccessfulTendererAnalysisComponent,
    Page404Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ...AngularMaterialModules
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
