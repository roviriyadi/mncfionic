import { Injectable } from '@angular/core';
import { JsonConvert , OperationMode ,ValueCheckingMode } from "json2typescript"
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';


export class DbService {

    private data: any;
    private db: PouchDB.Database;
    private dbName: string;

    private jsonConvert: JsonConvert = new JsonConvert();

    constructor(){

        PouchDB.plugin(PouchFind);

        //this.dbName = dbName;
        //this.createDb();

        this.data = [];

        this.jsonConvert.operationMode = OperationMode.DISABLE; // print some debug data
        this.jsonConvert.ignorePrimitiveChecks = true; // don't allow assigning number to string etc.
        this.jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL; // never allow null
    }

    async prepareDb(dbName: string){
        return new Promise(async (resolve,reject)=>{
            this.dbName = dbName;
            await this.createDb();
            resolve();
        });
    }

    async createDb(){
        return new Promise((resolve,reject)=>{
            this.db = new PouchDB(this.dbName);
            resolve();
        });
    }
    
    async getRows() {

        return new Promise(resolve => {
            return this.db.allDocs({
                include_docs: true
            }).then((result) => {
                this.data = [];
                result.rows.map((row) => {
                    this.data.push(row.doc);
                });

                resolve(this.data);

            }).catch((error) => {
                console.log(error);
                resolve(null);
            });
        });

    }

    async getRow(id: string) {
        return new Promise(resolve => {
            
            return this.db.get(id).then((doc) => {
                resolve(doc);
            }).catch((error) => {
                resolve(null);
            });

        });

    }
    
    async create(data: any){
        return new Promise((resolve,reject) => {
            this.db.post(this.jsonConvert.serialize(data)).then((result)=>{
                resolve(true);
            }).catch((err)=>{
                console.log(err);
                resolve(false);
            });
        });
    }
    
    async update(data: any) {
        return new Promise((resolve,reject) => {
            this.db.put(this.jsonConvert.serialize(data)).then((result)=>{
                resolve(true);
            }).catch((err)=>{
                console.log(err);
                reject(false);
            });
        });
    }
    
    async delete(data: any){
        return new Promise((resolve,reject) => {
            return this.db.remove(this.jsonConvert.serialize(data)).then(()=>{
                resolve(true);
            }).catch((err) => {
                console.log(err);
                reject(false);
            });
        });
    }

    async dropDb(){
        return new Promise((resolve,reject) => {
            return this.db.destroy().then(() => {
                this.createDb();
                resolve(true);
            }).catch((err) => {
                console.log(err);
                reject(false);
            });
        });
    }

    async isExist(id: string){
        return new Promise(resolve => {
            return this.db.get(id).then((doc) => {
                resolve(true);
            }).catch((error) => {
                resolve(false);
            });
        });

    }

    async getRowsCount() {
        return new Promise(resolve => {
            return this.db.allDocs().then((result) => {
                resolve(result.total_rows);
            }).catch((error) => {
                resolve(0);
            });
        });

    }
}