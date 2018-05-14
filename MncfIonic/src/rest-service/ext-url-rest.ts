import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ExtUrlRest {

    constructor(public http: Http) {
    }

    getExtUrl(extUrl) {
        let headers = new Headers();
        //headers.append('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8');
        headers.append("Authorization", "Basic " + btoa("tadashi:SuperHiro1"));
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let options = new RequestOptions({ headers: headers });

        return new Promise((resolve,reject) => {
            this.http.get(extUrl,options)
            .timeout(10000000)
            .map(response => response.text())
            .subscribe((html)=>{
                console.log(html);
                resolve(html);
            },(error)=>{
                console.log(error);
                reject(error);
            });
        });
    }

}