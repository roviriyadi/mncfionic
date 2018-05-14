import { Injectable } from '@angular/core';
import { Http, Headers , RequestOptions } from '@angular/http';
import { JsonConvert , OperationMode ,ValueCheckingMode } from "json2typescript"
import 'rxjs/add/operator/map';
import { BaseRestService } from './base-rest-service';
import { Observable } from 'rxjs/Observable';
import { BASE_API_URL, API_NOTIFIKASI } from '../my-config/api-config';
import { ApiResponse } from '../models/api-response';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable()
export class NotifikasiRest extends BaseRestService{

    constructor(public http: Http) {
        super(http);
    }

    getRowsNew(userId: string) {
        return new Promise((resolve,reject) => {
            return this.httpGet(BASE_API_URL+API_NOTIFIKASI+"GetNew?user="+userId,null)
            .then((response: ApiResponse)=>{
                return resolve(response);
            })
            .catch((error: ApiResponse)=>{
                return reject(error);
            });
        });
    }

    updatePickup(kode: string) {
        return new Promise((resolve,reject) => {
            this.httpPost(BASE_API_URL+API_NOTIFIKASI+"UpdatePickup?kode="+kode,null,null)
            .then((response: ApiResponse)=>{
                return resolve(response);
            })
            .catch((error: ApiResponse)=>{
                return reject(error);
            });
        });
    }
}