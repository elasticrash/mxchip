import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Resource {
    private _url;
    private _token;

    public headers() {
        return new HttpHeaders().set('Authorization', `Bearer ${this._token}`);
    }

    get url() {
        return this._url;
    }

    set url(url) {
        this._url = url;
    }

    get token() {
        return this._token;
    }

    set token(token) {
        this._token = token;
    }

    constructor(url: string, token: string) {
        this.url = url;
        this.token = token;
    }
}
