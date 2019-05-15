import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Rest } from 'src/app/rest/rest';
import { Resource } from 'src/app/rest/resource';

@Injectable({
  providedIn: 'root'
})
export class DataService extends Rest<any>  {

  constructor(
    http: HttpClient,
  ) {
    super(new Resource(
      `${environment.api}`, `token`
    ), http);
  }
}
