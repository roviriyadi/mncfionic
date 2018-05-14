import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { Promotion } from '../../models/promotion';
import { PromotionRest } from '../../rest-service/promotion-rest';
import { ApiResponse } from '../../models/api-response';
import { NotificationListPage } from '../notification-list/notification-list';
import { DbService } from '../../storage/db-service';
import { Notifikasi } from '../../models/notifikasi';
import { Notification } from 'ionic-native/node_modules/rxjs/Notification';
import { Events } from 'ionic-angular/util/events';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { UserProfilePage } from '../user-profile/user-profile';
import { GuidePage } from '../guide/guide';
import { AboutPage } from '../about/about';
import { HelpPage } from '../help/help';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { PopListPage } from '../../components/pop-list/pop-list';
import { PromotionDetailPage } from '../promotion-detail/promotion-detail';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { ApprovalPage } from '../approval/approval';
import { ApprovalRequest } from '../../models/approval-request';
import { MyLoading } from '../../share-function/my-loading';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
  
  public user: User;
  public promotionList: Promotion[] = null;
  public unreadNotification: number = 0;
  private dbNotifikasi: DbService = new DbService();
  private dbPromotions: DbService = new DbService();
  private dbApprovalRequest: DbService = new DbService();
  private confirmedExit: boolean = false;
  private approvalNewCount: number = 0;
  private refresherCount: any;

  constructor(
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private events: Events,
    private promotionRest: PromotionRest,
    private popoverCtrl: PopoverController
  ) {

    this.user = this.navParams.get("user");
    
    if(this.user===undefined){
      this.user = new User();
    }

    /*
    this.events.subscribe('receiverHome', (data: any, type: string, callback : Function) => {
      if(type==="refresh-notifikasi"){
        this.refreshNotification();
        this.refreshDataCount();
      }else if(type==="refresh-user"){
        this.user = data as User;
        this.refreshNotification();
        this.refreshDataCount();
      }
    });
    */

  }

  async prepareDatabase(){
    await this.dbNotifikasi.prepareDb("notifikasi");
    await this.dbPromotions.prepareDb("promotion");
    await this.dbApprovalRequest.prepareDb("approval-request");
  }

  async ionViewDidLoad() {

    this.registerRefresher();

    await this.prepareDatabase();

    if(this.user.kode){
      this.refreshNotification();
      this.refreshDataCount();
    }
    this.downloadPromotion();
  }

  async downloadPromotion(){
    return new Promise((resolve,reject)=>{
      this.promotionRest.getRows()
      .then((response: ApiResponse)=>{
        if(response.success){
          this.promotionList = response.data as Promotion[];
          this.promotionList.forEach(async (item: Promotion,index: number)=>{
            await this.dbPromotions.getRow(item.kode)
            .then(async (data: Promotion)=>{
              if(!data){
                item._id = item.kode;
                await this.dbPromotions.create(item);
              }else{
                let toupdate = Object.assign(data,item);
                await this.dbPromotions.update(toupdate);
              }
            });
          });
          resolve();
        }else{
          resolve();
        }
      }).catch(async (error)=>{
        await this.dbPromotions.getRows().then((data: Promotion[])=>{
          if(data && data.length>0){
            this.promotionList = data;
          }
        });
        resolve();
      });
    });
  }

  refreshNotification(): void{

    this.dbNotifikasi.getRows()
    .then((data: Notifikasi[])=>{
      let unread : Notifikasi[] = [];
      unread = data.filter((item: Notifikasi)=>{
        return item.dibaca === false && item.tipe === "MESSAGE";
      });
      this.unreadNotification = unread.length;
    });

  }

  onViewNotification(): void{
    if(this.user.kode){
      this.navCtrl.push(NotificationListPage,{user : this.user , callback: ()=>{
        this.refreshNotification();
      }});
    }else{
      this.onNotLoggedInfo();
    }
  }

  ngOnDestroy() {
    //this.events.unsubscribe('receiverHome');
    clearInterval(this.refresherCount);
  }

  onLogin(): void{
    this.navCtrl.setRoot(LoginPage);
  }

  onRegister(): void{
    this.navCtrl.setRoot(RegisterPage);
  }

  onGuide(): void{
    this.navCtrl.push(GuidePage);
  }

  onHelp(): void{
    this.navCtrl.push(HelpPage);
  }

  onAbout(): void{
    this.navCtrl.push(AboutPage);
  }

  onPromoDetail(data): void{
    this.navCtrl.push(PromotionDetailPage,{ promotion: data });
  }

  onUserProfile(): void {
    if(this.user.kode){
      this.navCtrl.setRoot(UserProfilePage,{user:this.user});
    }else{
      this.onNotLoggedInfo();
    }
  }

  onMore(myEvent) {

    let popupList = [
      {name: "About",icon:"information-circle",color:"facebook",event : ()=>{ this.onAbout() }},
      {name: "Help",icon:"help-circle",color:"pinterest",event : ()=>{ this.onHelp() }}
    ];

    let popover = this.popoverCtrl.create(PopListPage,{
        options:{
            list: popupList
        }
    });

    popover.present({ev: myEvent});

  }

  onNotLoggedInfo(){

    let toast = this.toastCtrl.create({
      message: 'Please Login first..!',
      duration: 2000,
      position: 'top'
    });

    toast.present();
  }

  onMenuApproval(): void{
    this.navCtrl.setRoot(ApprovalPage,{ user: this.user });
  }

  refreshDataCount(){ 
    this.dbApprovalRequest.getRows().then((data: ApprovalRequest[])=>{
      this.approvalNewCount = data.filter((item: ApprovalRequest,index: number)=>{
        return item.kodeStatus=="NEW";
      }).length;
    });
  }

  registerRefresher(){
    this.refresherCount = setInterval(async()=>{
      if(MyLoading.newMessage){
        MyLoading.newMessage = false;
        this.refreshDataCount();
        this.refreshNotification();
      }
    },2000);
  }

}