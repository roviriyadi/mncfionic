import { Injectable } from '@angular/core';
import { Http, Headers , RequestOptions } from '@angular/http';
import { JsonConvert , OperationMode ,ValueCheckingMode } from "json2typescript"
import 'rxjs/add/operator/map';
import { BaseRestService } from './base-rest-service';
import { Observable } from 'rxjs/Observable';
import { BASE_API_URL, API_USER } from '../my-config/api-config';
import { ApiResponse } from '../models/api-response';
import { User } from '../models/user';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable()
export class UserRest extends BaseRestService{

    constructor(public http: Http) {
        super(http);
    }

    validateLogin(user: string,password: string) {
        return new Promise((resolve,reject) => {
            this.httpGet(BASE_API_URL+API_USER+"ValidateLogin?user="+user+"&password="+password,null,15000)
            .then((response: ApiResponse)=>{
                return resolve(response);
            })
            .catch((error: ApiResponse)=>{
                return reject(error);
            });
        });
    }

    register(user: User) {
        user.password = Md5.hashStr(user.password).toString();
        user.confirmPassword = user.password;
        return new Promise((resolve,reject) => {
            this.httpPost(BASE_API_URL+API_USER+"Register",null,user).then((response: ApiResponse)=>{
                return resolve(response);
            })
            .catch((error: ApiResponse)=>{
                return reject(error);
            });
        });
    }

    sendEmailVerifikasi(user: User){
        return new Promise((resolve,reject) => {
            this.httpPost(BASE_API_URL+API_USER+"SendEmailVerifikasi",null,user)
            .then((response: ApiResponse)=>{
                return resolve(response);
            })
            .catch((error: ApiResponse)=>{
                return reject(error);
            });
        });
    }

    verifikasi(user: User) {
        return new Promise((resolve,reject) => {
            this.httpPost(BASE_API_URL+API_USER+"Verifikasi",null,user)
            .then((response: ApiResponse)=>{
                return resolve(response);
            })
            .catch((error: ApiResponse)=>{
                return reject(error);
            });
        });
    }

    getMobileUser(user: string) {
        return new Promise((resolve,reject) => {
            this.httpGet(BASE_API_URL+API_USER+"GetMobileUser?user="+user,null)
            .then((response: ApiResponse)=>{
                return resolve(response);
            })
            .catch((error: ApiResponse)=>{
                return reject(error);
            });
        });
    }

}