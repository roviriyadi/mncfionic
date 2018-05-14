import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ApiResponse } from '../models/api-response';
import { JsonConvert } from "json2typescript";
import { BASE_API_URL, API_CHECK_CONNECT } from '../my-config/api-config';

@Injectable()
export class CekKoneksiRest {

    private http: Http;
    private jsonConvert: JsonConvert = new JsonConvert();

    constructor(http: Http) {
        this.http = http;
    }

    async isConnect(){
        return new Promise((resolve,reject) => {
          this.http.get(BASE_API_URL+API_CHECK_CONNECT)
          .timeout(7000)
          .subscribe((data)=> {
            resolve(this.jsonConvert.deserialize(JSON.parse(data['_body']),ApiResponse));
          },(error)=>{
            let response = new ApiResponse();
            response.success=false;
            response.message="Not connected to server..!";
            reject(response);
          });
        });
    }

}