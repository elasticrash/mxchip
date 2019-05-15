import { NgModule } from '@angular/core';
import { RestService } from './rest.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule
  ],
  declarations: [],
  providers: [RestService],
  exports: []
})
export class RestModule { }
