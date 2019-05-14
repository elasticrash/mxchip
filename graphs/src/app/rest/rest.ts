import { Resource } from './resourse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class Rest<T> {
    protected _resource: Resource;
    protected _httpClient: HttpClient;

    constructor(
        resource: Resource,
        httpClient: HttpClient

    ) {
        this._resource = resource;
        this._httpClient = httpClient;
    }

    public get(endpoint?: string, params?: any): Observable<any> {
        const options: { headers?: HttpHeaders, params?: any } = {
            headers: this._resource.headers()
        };
        if (params) {
            options.params = params;
        }
        return this._httpClient.get(this._resource.url + endpoint, options);
    }

    public set(body, url?) {
        const _url = url ? url : this._resource.url;
        return this._httpClient.post(_url, body, {
            headers: this._resource.headers()
        });
    }
}
