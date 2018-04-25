import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { routes } from './routes';

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false
    }),
    CommonModule
  ],
  exports: [RouterModule],
  declarations: []
})
export class RoutingModule { }
