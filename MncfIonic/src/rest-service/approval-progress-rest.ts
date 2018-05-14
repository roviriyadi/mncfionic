import { Injectable } from '@angular/core';
import { Http, Headers , RequestOptions } from '@angular/http';
import { JsonConvert , OperationMode ,ValueCheckingMode } from "json2typescript"
import 'rxjs/add/operator/map';
import { BaseRestService } from './base-rest-service';
import { Observable } from 'rxjs/Observable';
import { BASE_API_URL, API_APPROVAL_PROGRESS } from '../my-config/api-config';
import { ApiResponse } from '../models/api-response';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable()
export class ApprovalProgressRest extends BaseRestService{

    constructor(public http: Http) {
        super(http);
    }

    getRows(kodeApproval,kodeReferensi) {
        return new Promise((resolve,reject) => {
            this.httpGet(BASE_API_URL+API_APPROVAL_PROGRESS+"GetRows?kodeApproval="+kodeApproval+"&kodeReferensi="+kodeReferensi,null)
            .then((response: ApiResponse)=>{
                return resolve(response);
            })
            .catch((error: ApiResponse)=>{
                return reject(error);
            });
        });
    }

}