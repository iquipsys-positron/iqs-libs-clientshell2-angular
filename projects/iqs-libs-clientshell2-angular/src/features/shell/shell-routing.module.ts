import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IqsNotFoundPagePageComponent } from './components/not-found-page/not-found-page.component';

const shellRoutes: Routes = [
  { path: '404', component: IqsNotFoundPagePageComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(shellRoutes)],
    exports: [RouterModule]
})
export class IqsShellRoutingModule { }
