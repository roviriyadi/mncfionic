import { Injectable } from '@angular/core';
import { Http, Headers , RequestOptions } from '@angular/http';
import { JsonConvert , OperationMode ,ValueCheckingMode } from "json2typescript"
import 'rxjs/add/operator/map';
import { BaseRestService } from './base-rest-service';
import { Observable } from 'rxjs/Observable';
import { BASE_API_URL, API_APPROVAL_REQUEST } from '../my-config/api-config';
import { ApiResponse } from '../models/api-response';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable()
export class ApprovalRequestRest extends BaseRestService{

    constructor(public http: Http) {
        super(http);
    }

    getRows() {
        return new Promise((resolve,reject) => {
            this.httpGet(BASE_API_URL+API_APPROVAL_REQUEST+"GetRows",null)
            .then((response: ApiResponse)=>{
                return resolve(response);
            })
            .catch((error: ApiResponse)=>{
                return reject(error);
            });
        });
    }

    getRow(kode) {
        return new Promise((resolve,reject) => {
            this.httpGet(BASE_API_URL+API_APPROVAL_REQUEST+"GetRow?kodeReferensi="+kode,null)
            .then((response: ApiResponse)=>{
                return resolve(response);
            })
            .catch((error: ApiResponse)=>{
                return reject(error);
            });
        });
    }

    postResult(data) {
        return new Promise((resolve,reject) => {
            this.httpPost(BASE_API_URL+API_APPROVAL_REQUEST+"PostResult",null,data)
            .then((response: ApiResponse)=>{
                return resolve(response);
            })
            .catch((error: ApiResponse)=>{
                return reject(error);
            });
        });
    }

    getCurrentLevel(kodeReferensi: string,kodeUser: string) {
        return new Promise((resolve,reject) => {
            this.httpGet(BASE_API_URL+API_APPROVAL_REQUEST+"GetCurrentLevel?kodeReferensi="+kodeReferensi+"&kodeUser="+kodeUser,null)
            .then((response: ApiResponse)=>{
                return resolve(response);
            })
            .catch((error: ApiResponse)=>{
                return reject(error);
            });
        });
    }

}