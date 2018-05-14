import { Http, Response, Headers , RequestOptions } from '@angular/http';
import { ApiResponse } from "../models/api-response";
import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";
import { HttpHeader } from '../models/http-header';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/timeout';
import { Observable } from 'rxjs/Observable';
import { CekKoneksiRest } from './cek-koneksi-rest';

@Injectable()
export class BaseRestService {

  private jsonConvert: JsonConvert = new JsonConvert();
  private cekKoneksi: CekKoneksiRest;

  constructor(public http: Http) {
    this.cekKoneksi= new CekKoneksiRest(http);
    this.jsonConvert.operationMode = OperationMode.DISABLE; // print some debug data
    this.jsonConvert.ignorePrimitiveChecks = true; // don't allow assigning number to string etc.
    this.jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL; // never allow null
  }

  buildRequestOptions(xheaders: HttpHeader[]) : RequestOptions{
    let hdr = new Headers();
    hdr.append('Content-Type', 'application/json charset=utf-8');
    hdr.append('Accept', 'application/json charset=utf-8');

    if(xheaders){
      xheaders.forEach((item)=>{
        hdr.append(item.key,item.value);
      });
    }

    return new RequestOptions({headers:hdr});
  }

  handleError(error): ApiResponse {
    let response = new ApiResponse();
    response.success=false;

    if(error.status===0){
      response.message="Server down..!";
    }else if(error.status===404){
      response.message="Not connected to server..!";
    }else if(error.name==="TimeoutError"){        
      response.message="Failed process, timedout..!";
    }else{
      response.message = error.message;
    }

    return response;
  }

  httpGet(url: string, xheaders: HttpHeader[],timeout:number=700000){
    return new Promise(async (resolve,reject) => {
      this.cekKoneksi.isConnect().then((response: ApiResponse)=>{
        this.http.get(url,this.buildRequestOptions(xheaders))
        .timeout(700000)
        .subscribe((data) => {
          resolve(this.jsonConvert.deserialize(JSON.parse(data['_body']),ApiResponse));
        },(error)=>{
          reject(this.handleError(error));
        });
      }).catch((response: Response)=>{
        reject(response);
      });
    
    });

  }

  httpPost(url: string, xheaders: HttpHeader[], data: any){
    return new Promise((resolve,reject) => {
      this.cekKoneksi.isConnect().then((response: ApiResponse)=>{
        this.http.post(url,(data? JSON.stringify(data) : {}),this.buildRequestOptions(xheaders))
        .timeout(700000)
        .subscribe((data) => {
          resolve(this.jsonConvert.deserialize(JSON.parse(data['_body']),ApiResponse));
        },(error)=>{
          reject(this.handleError(error));
        });
      }).catch((response: Response)=>{
        reject(response);
      });
    });
  }

  httpPut(url: string, xheaders: HttpHeader[], data: any){
    return new Promise((resolve,reject) => {
      this.cekKoneksi.isConnect().then((response: ApiResponse)=>{
        this.http.put(url,JSON.stringify(data),this.buildRequestOptions(xheaders))
        .timeout(700000)
        .subscribe((data) => {
          resolve(this.jsonConvert.deserialize(JSON.parse(data['_body']),ApiResponse));
        },(error)=>{
          reject(this.handleError(error));
        });
      }).catch((response: Response)=>{
        reject(response);
      });
    });
  }

  httpDelete(url: string, xheaders: HttpHeader[]){
    return new Promise((resolve,reject) => {
      this.cekKoneksi.isConnect().then((response: ApiResponse)=>{
        this.http.delete(url, this.buildRequestOptions(xheaders))
        .timeout(700000)
        .subscribe((data) => {
          resolve(this.jsonConvert.deserialize(JSON.parse(data['_body']),ApiResponse));
        },(error)=>{
          reject(this.handleError(error));
        });
      }).catch((response: Response)=>{
        reject(response);
      });
    });
  }

}