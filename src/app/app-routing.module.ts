import { SuccessfulTendererAnalysisComponent } from './views/successful-tenderer-analysis/successful-tenderer-analysis.component';
import { Page404Component } from './views/page404/page404.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'successful-tenderer-analysis',
    pathMatch: 'full'
  },
  {
    path: 'successful-tenderer-analysis',
    component: SuccessfulTendererAnalysisComponent
  },
  {
    path: '404',
    component: Page404Component
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
