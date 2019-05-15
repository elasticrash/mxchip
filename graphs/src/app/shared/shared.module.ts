import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { material } from './material';

@NgModule({
  imports: [
    CommonModule,
    ...material
  ],
  declarations: [],
  exports: [...material]
})
export class SharedModule { }
