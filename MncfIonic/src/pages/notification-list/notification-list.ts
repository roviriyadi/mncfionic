import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { Notifikasi } from '../../models/notifikasi';
import { Notification } from 'ionic-native/node_modules/rxjs/Notification';
import { DateTime } from 'ionic-angular/components/datetime/datetime';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { DbService } from '../../storage/db-service';
import { NotifikasiRest } from '../../rest-service/notifikasi-rest';
import { ApiResponse } from '../../models/api-response';
import { MyAlert } from '../../share-function/my-alert';
import { Events } from 'ionic-angular/util/events';
import { NotificationDetailPage } from '../notification-detail/notification-detail';
import { KonsumenListPage } from '../konsumen-list/konsumen-list';

/**
 * Generated class for the NotificationListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification-list',
  templateUrl: 'notification-list.html'
})
export class NotificationListPage implements OnInit{
  
  private isBusy: boolean = false;
  private user: User;
  public dataList: Notifikasi[] = [];
  private showOptions: boolean = false;
  private selectedMessageId : string[] = [];
  private dbNotifikasi: DbService = new DbService();
  private callback: Function;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private notifikasiRest: NotifikasiRest,
    private alertCtrl: AlertController,
    private events: Events
  ) {
    
    this.user = this.navParams.get("user");
    this.callback = this.navParams.get("callback");
    this.dbNotifikasi.prepareDb("notifikasi");

  }

  ngOnInit(): void {
    this.loadData(null);
  }

  loadData(callback): void{
    this.dataList = [];
    this.dbNotifikasi.getRows().then((data: Notifikasi[])=>{
      this.dataList = data;
      if(callback){
        callback();
      }
    });
  }

  onFinish():void{
    this.showOptions = false;
    this.selectedMessageId = [];
  }

  onSync(refresher): void{

    this.isBusy = true;

    this.notifikasiRest.getRowsNew(this.user.kode).then((response: ApiResponse)=>{
      if(response.success){
        
        let list = response.data as Notifikasi[];

        if(list.length === 0){
          refresher.complete();
          this.isBusy = false;
        }

        list.forEach((item: Notifikasi,index)=>{
          this.dbNotifikasi.getRow(item.kode).then((data:Notifikasi)=>{
            if(!data){
              this.notifikasiRest.updatePickup(item.kode).then((response: ApiResponse)=>{
                if(response.success){
                  item._id = item.kode;
                  item.dibaca = false;
                  this.dbNotifikasi.create(item).then((success: boolean)=>{
                    if(index+1 === list.length){
                      this.loadData(()=>{
                        refresher.complete();
                        this.isBusy = false;
                      });
                    }
                  });
                }
              });
            }
          });
        });
      }else{
          refresher.complete();
          this.isBusy = false;
          MyAlert.info(this.alertCtrl,response.message);
      }
    });
  }

  onLongPress(target,data: Notifikasi): void{
    if(!this.isBusy){
      this.showOptions = true;
      this.selMessage(data.kode);
    }
  }

  onTap(target,data: Notifikasi){
    if(this.showOptions && !this.isBusy){
      this.selMessage(data.kode);
    }
  }

  onMsgTap(data: Notifikasi): void{
    if(this.showOptions && !this.isBusy){
      this.selMessage(data.kode);
    }
  }

  selMessage(elId): void{
    let el = document.getElementById(elId);

    if(el.classList.contains("selected-message")){
      el.classList.remove("selected-message");
      this.selectedMessageId.splice(this.selectedMessageId.indexOf(elId),1);
    }else{
      el.classList.add("selected-message");
      this.selectedMessageId.push(elId);
    }

    if(this.selectedMessageId.length==0){
      this.showOptions = false;
    }
  }

  removeEl(elId): void{
    let el = document.getElementById(elId);
    el.remove();
  }

  onDelete(): void{
    this.selectedMessageId.forEach((kode,index)=>{
      this.dbNotifikasi.getRow(kode).then((data)=>{
        this.dbNotifikasi.delete(data).then((success: boolean)=> {
          if(success){
            this.removeEl(kode);
          }
          if(index+1 === this.selectedMessageId.length){
            this.loadData(()=>{
              this.onFinish();
            });
          }
        });
      });
    });
  }

  onHasRead(): void{
    this.selectedMessageId.forEach((kode,index)=>{
      this.dbNotifikasi.getRow(kode).then((data: Notifikasi)=>{
        data.dibaca = true;
        this.dbNotifikasi.update(data).then((success: boolean)=> {
          if(index+1 === this.selectedMessageId.length){
            this.loadData(()=>{
              this.onFinish();
            });
          }
        });
      });
    });
  }

  setRead(kode): void {
    this.dbNotifikasi.getRow(kode).then((data: Notifikasi)=>{
      data.dibaca = true;
      this.dbNotifikasi.update(data);
    });
  }

  ionViewWillLeave(): void{
    this.events.publish("notifikasi", null , "reload");
    if(this.callback){
      this.callback();
    }
  }

  callbackPop = (params) => {
    return new Promise((resolve, reject) => {
        this.loadData(null);
        resolve();
    });
  }

  onDetail(data: Notifikasi): void{
    if(!this.showOptions){
      if(data.tipe === "MESSAGE"){
        this.navCtrl.push(NotificationDetailPage,{ notifikasi: data , callback: this.callbackPop},{animate: true, direction: 'forward'});
      }else{
        this.navCtrl.pop();
        this.events.publish("receiverRoot", data , data.tipe);
      }
    }
  }

}