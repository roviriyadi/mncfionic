import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseRestService } from './base-rest-service';
import { BASE_API_URL, API_PROMOTION } from '../my-config/api-config';
import { ApiResponse } from '../models/api-response';

@Injectable()
export class PromotionRest extends BaseRestService{

    constructor(public http: Http) {
        super(http);
    }

    getRows() {
        return new Promise((resolve,reject) => {
            this.httpGet(BASE_API_URL+API_PROMOTION+"GetRows",null)
            .then((response: ApiResponse)=>{
                return resolve(response);
            })
            .catch((error: ApiResponse)=>{
                return reject(error);
            });
        });
    }

}