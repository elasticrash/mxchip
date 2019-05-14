import { HttpHeaders } from '@angular/common/http';

export class Resource {
    private _url: any;
    private _token: any;

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


    constructor(resource: Resource) {
        this.url = resource.url;
        this.token = resource.token;
    }
}
