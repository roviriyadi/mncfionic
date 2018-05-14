import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, MenuController, Nav, Events, LoadingController, ModalController, Loading, AlertController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { System } from '../models/system';
import { User } from '../models/user';
import { DbService } from '../storage/db-service';
import { MyAlert } from '../share-function/my-alert';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { ApiResponse } from '../models/api-response';
import { Subscription } from 'rxjs/Subscription';
import { NotifikasiRest } from '../rest-service/notifikasi-rest';
import { Notifikasi } from '../models/notifikasi';
import { SplashPage } from '../pages/splash/splash';
import { VerifikasiPage } from '../pages/verifikasi/verifikasi';
import { DataSource } from '../models/data-source';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { App } from 'ionic-angular/components/app/app';
import { IonicApp } from 'ionic-angular/components/app/app-root';
import { Modal } from 'ionic-angular/components/modal/modal';
import { Page } from 'ionic-angular/navigation/nav-util';
import { MyLoading } from '../share-function/my-loading';
import { AboutPage } from '../pages/about/about';
import { ApprovalGroup } from '../models/approval-group';
import { ApprovalStatus } from '../models/approval-status';
import { ApprovalPage } from '../pages/approval/approval';
import { ApprovalGroupRest } from '../rest-service/approval-group-rest';
import { ApprovalStatusRest } from '../rest-service/approval-status-rest';
import { ApprovalRequest } from '../models/approval-request';
import { ApprovalDetailPage } from '../pages/approval-detail/approval-detail';
import { ApprovalRequestRest } from '../rest-service/approval-request-rest';
import { ApprovalInfoGroup } from '../models/approval-info-group';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { BackgroundMode } from '@ionic-native/background-mode';
import { not } from '@angular/compiler/src/output/output_ast';
import * as $ from 'jquery';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { CekKoneksiRest } from '../rest-service/cek-koneksi-rest';
import { FileOpener } from '@ionic-native/file-opener';
import { Http } from '@angular/http';
import { API_APPLCHECKLIST, BASE_API_URL } from '../my-config/api-config';

@Component({
  templateUrl: 'app.html'
})

export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;

  private loadingExist: boolean = false;
  private interValNotifFG: any ;
  private interValNotifBG: any ;
  private myModal: Modal;
  private allowExit: boolean = false;
  private rootPage = HomePage;
  //private pages: any;
  private leftMenuTitle: string;
  private loading: Loading;

  private prospectingCount: number = 0;
  private canvasingCount: number = 0;
  private referensiCount: number = 0;
  private approvalNewCount: number = 0;

  private onResumeSubscription: Subscription;
  private onPauseSubscription: Subscription;

  private loggedUser : boolean = false;
  private user: User = new User();
  private system: System;
  private dbSystem: DbService = new DbService(); //("system");
  private dbUser: DbService = new DbService(); //("user");
  private dbKota: DbService = new DbService();
  //private dbMarketingStaff: DbService = new DbService();
  private dbNotifikasi: DbService = new DbService();
  private dbStatusProspecting: DbService = new DbService();
  private dbDataSource: DbService = new DbService();
  private dbCalonKonsumen: DbService = new DbService();
  private dbProspectingFollowup: DbService = new DbService();
  private dbApprovalGroup: DbService = new DbService();
  private dbApprovalRequest: DbService = new DbService();
  private dbApprovalStatus: DbService = new DbService();
  private dbKonsumenNego : DbService = new DbService();
  private dbSysCompany: DbService = new DbService();
  private dbSysProject: DbService = new DbService();
  private totalRefKonsumen: number = 0;
  private totalCanvasing: number = 0;
  private totalProspecting: number = 0;

  private notifikasiRest: NotifikasiRest;
  private approvalGroupRest: ApprovalGroupRest;
  private approvalStatusRest: ApprovalStatusRest;
  private approvalRequestRest: ApprovalRequestRest
  private cekKoneksi: CekKoneksiRest;
  private fileTransfer: FileTransferObject = this.transfer.create();

  constructor(
    public platform: Platform,
    private app: App,
    private ionicApp: IonicApp,
    private http: Http,
    private menu: MenuController,
    private events: Events,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private splashScreen: SplashScreen,
    private toastCtrl: ToastController,
    private localNotifications: LocalNotifications,
    private backgroundMode: BackgroundMode,
    private transfer: FileTransfer,
    private file: File,
    private fileOpener: FileOpener
  ) {

    this.notifikasiRest = new NotifikasiRest(this.http);
    this.approvalGroupRest = new ApprovalGroupRest(this.http);
    this.approvalStatusRest = new ApprovalStatusRest(this.http);
    this.approvalRequestRest = new ApprovalRequestRest(this.http);
    this.cekKoneksi = new CekKoneksiRest(this.http);

  }

  ngOnInit(){
    this.initializeApp();
  }

  registerSubscriber(){
    this.events.subscribe('receiverRoot', (data: any, type: string, callback : Function) => {

      if(type==="login"){

        this.user = data as User;

        this.dbSystem.getRow("1").then((data: System)=>{
          if(!data){
            this.system = new System();
            this.system._id = "1";
            this.system.loginOtomatis = true;
            this.system.userTerakhir = this.user.kode;
            this.dbSystem.create(this.system);
          }else{
            data.userTerakhir = this.user.kode;
            this.system.loginOtomatis = true;
            this.system = data;
            this.dbSystem.update(data);
          }
        });

        this.loggedUser = true;
        //this.bindMenu();
        //this.nav.setRoot(HomePage,{user:this.user});
        //MyAlert.info(this.alertCtrl,'Selamat datang '+this.user.nama);
        //this.events.publish("receiverHome", this.user , "refresh-user");
        //this.events.publish("receiverHome", null , "refresh-notifikasi");
      }else if(type==="refresh-user"){
        this.dbUser.getRow(this.user.kode).then((data: User)=>{
            this.user = data;
        });
        this.dbSystem.getRow("1").then((data: System)=>{
            this.system = data;
        });
        //this.nav.setRoot(HomePage,{user:this.user});
      }else if(type==="show-loading"){
        this.showloading();
      }else if(type=="hide-loading"){
        if(callback){
          this.loading.onDidDismiss(() => {
            callback();
          });
        }
        this.hideloading();
      }else if(type==="verify"){
        this.user = data as User;
        this.modalCtrl.create(VerifikasiPage,{ email: this.user.email }).present();
      }else if(type === "APPROVAL"){
        let notif = data as Notifikasi;
        this.clickBackgroundNotifikasi(notif.kodeReferensi,notif.kode);
      }

    });
  }

  onInitUser(user: User){
    this.user = user;
    this.dbSystem.getRow("1").then((data: System)=>{
      if(!data){
        this.system = new System();
        this.system._id = "1";
        this.system.loginOtomatis = true;
        this.system.userTerakhir = this.user.kode;
        this.dbSystem.create(this.system);
      }else{
        data.userTerakhir = this.user.kode;
        this.system = data;
        this.system.loginOtomatis = true;
        this.dbSystem.update(data);
      }
    });

    this.loggedUser = true;
  }

  refreshDataCount(){ 
    this.dbApprovalRequest.getRows().then((data: ApprovalRequest[])=>{
      this.approvalNewCount = data.filter((item: ApprovalRequest,index: number)=>{
        return item.kodeStatus=="NEW";
      }).length;
    });
  }

  async downloadNotifikasi(){ 

    return new Promise((resolve,reject)=>{

      this.notifikasiRest.getRowsNew(this.user.kode)
      .then(async (response: ApiResponse)=>{
        if(response.success){

          //let pushList: any[] = [];
          let list = response.data as Notifikasi[];

          await list.forEach(async (item: Notifikasi,index)=>{
            await this.dbNotifikasi.getRow(item.kode)
            .then(async (data:Notifikasi)=>{
              if(!data){
                await this.notifikasiRest.updatePickup(item.kode)
                .then(async (response: ApiResponse)=>{
                  if(response.success){
                    item._id = item.kode;
                    item.dibaca = false;
                    await this.dbNotifikasi.create(item).then((success:boolean)=>{
                      MyLoading.newMessage = true;
                      this.scheduleNotifications(item);
                      /*
                      pushList.push({
                        id: Math.floor(1000 + Math.random() * 9000),
                        title: item.judul,
                        text: item.keteranganSingkat,
                        at: new Date(new Date().getTime()+100),
                        firstAt: new Date(new Date().getTime()+100),
                        sound: this.setSound(),
                        data: item
                      });
                      */
                    });
                  }
                });
              }
            });

            if(item.tipe==="APPROVAL"){
              await this.dbApprovalRequest.getRow(item.kodeReferensi+"_"+item.kode)
              .then(async (approvalReq:ApprovalRequest)=>{
                if(!approvalReq){
                  await this.downloadApproval(item.kodeReferensi,item.kode,true,null);
                }
              });
            }

            if(index+1===list.length){
              //this.events.publish("receiverHome", {} , "refresh-notifikasi");
              resolve();
            }

          });

          //this.scheduleNotifications(pushList);

          //if(list.length===0){
            //this.events.publish("receiverHome", {} , "refresh-notifikasi");
            //resolve();
          //}

        }
      }).catch((error)=>{
        resolve();
      });
    });
  }

  async downloadApproval(kodeApproval: string,kodeNotifikasi: string, isBackground: boolean,callback){
    return new Promise(async (resolve,reject)=>{
      
      if(callback){
        callback();
      }

      let approvalID = kodeApproval+"_"+kodeNotifikasi;
      //alert(approvalID);
      let apprReq = await this.dbApprovalRequest.getRow(approvalID) as ApprovalRequest;

      if(isBackground && apprReq && apprReq.kodeStatus!="NEW"){
        apprReq.kodeStatus = "NEW";
        await this.dbApprovalRequest.update(apprReq);
      }else if(isBackground && !apprReq){
        this.approvalRequestRest.getRow(kodeApproval)
        .then((response: ApiResponse)=>{
          //alert(JSON.stringify(response));
          if(response.success){
            let item = response.data as ApprovalRequest;
            item._id = approvalID;
            item.kodeStatus = "NEW";
            this.dbApprovalRequest.create(item);
          }
        });
      }else if(!isBackground && !apprReq){
        
        MyLoading.showLoading(this.events);
        
        this.approvalRequestRest.getRow(kodeApproval)
        .then((response: ApiResponse)=>{
          if(response.success){
            let item = response.data as ApprovalRequest;
            item._id = item.kode;
            item.kodeStatus = "NEW";
            this.dbApprovalRequest.create(item)
            .then((success:boolean)=>{
              if(success){
                MyLoading.hideLoading(this.events,null);
                this.nav.push(ApprovalDetailPage,{ user: this.user , approval: item });
              }else if(!success){
                MyLoading.hideLoading(this.events,null);
              }
            });
          }else{
              MyLoading.hideLoading(this.events,null);
          }
        }).catch((error: ApiResponse)=>{
            MyLoading.hideLoading(this.events,null);
            MyAlert.infoNotConnect(this.alertCtrl);
        });
      }else if(!isBackground && apprReq){
        this.nav.push(ApprovalDetailPage,{ user: this.user , approval: apprReq });
      }

    });
  }

  async initializeApp() {

    this.showloading();

    await this.prepareDatabase();
    await this.dbSystem.getRow("1").then((data: System)=>{

      this.system = data;
      if(data && data.loginOtomatis){
        this.dbUser.getRow(data.userTerakhir).then((data: User)=>{
            this.user = data;
            this.loggedUser = true;
            this.nav.setRoot(HomePage,{user: this.user});

            /*
            setTimeout(async()=>{
              if(this.user.kode){
                await this.downloadNotifikasi();
              }
              this.refreshDataCount();
              this.events.publish("receiverHome", this.user , "refresh-user");
            },1000);
            */
        });
      }else{
        this.nav.setRoot(HomePage);
      }
    });

    this.platform.ready().then((ready) => {

      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);

      if(this.localNotifications.hasPermission){
        this.localNotifications.registerPermission();
      }

      this.localNotifications.on('click',(notification,state)=>{
        let notif : Notifikasi = notification.data as Notifikasi;
        //this.clickBackgroundNotifikasi(notif.kodeReferensi,notif.kode);
        //this.events.publish("receiverRoot", notif , notif.tipe);
        this.onApproval();
      });

      this.registerBackButtonExit();

      this.onResumeSubscription = this.platform.resume.subscribe(async () => {
        // disable background mode
        this.backgroundMode.disable();
        this.bindIntervalForeGround();
        //await this.downloadNotifikasi();
        //this.events.publish("receiverHome", null , "refresh-notifikasi");
      });

      this.onPauseSubscription = this.platform.pause.subscribe(async () => {
        // enable background mode
        //this.onBackgroundApp(true);
        //await this.downloadNotifikasi();
        //this.events.publish("receiverHome", null , "refresh-notifikasi");
      });

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //StatusBar.styleDefault();
      StatusBar.styleLightContent();
      //localStorage.setItem("mailChimpLocal", "false");
    });

    this.registerSubscriber();
    
    /*
    this.backgroundMode.enable();
    this.backgroundMode.setDefaults({
      title:'IProve MNC Finance',
      text: 'MNC Finance Approval Mobile Apps',
      hidden: false
    });
    this.backgroundMode.on('activate').subscribe(()=>{
      this.bindIntervalBackground();
    });
    */

    await this.onSyncApprovalGroup();
    await this.onSyncApprovalStatus();

    this.bindIntervalForeGround();
    this.hideloading();

  }

  bindIntervalForeGround(){
    //this.clearIntervalBackGround();
    this.interValNotifFG = setInterval(async ()=>{
      if(this.user.kode){
        await this.downloadNotifikasi();
        this.refreshDataCount();

        if(await this.dbApprovalStatus.getRowsCount() == 0){
          this.onSyncApprovalStatus();
        }

        if(await this.dbApprovalGroup.getRowsCount() == 0){
          this.onSyncApprovalGroup();
        }

        //this.events.publish("receiverHome", {} , "refresh-notifikasi");
      }
    },10000);
  }

  setRead(kode): void {
    this.dbNotifikasi.getRow(kode).then((data: Notifikasi)=>{
      data.dibaca = true;
      this.dbNotifikasi.update(data);
    });
  }

  async prepareDatabase(){
    await this.dbSystem.prepareDb("system");
    await this.dbUser.prepareDb("user");
    await this.dbKota.prepareDb("kota");
    //await this.dbMarketingStaff.prepareDb("marketing-staff");
    await this.dbNotifikasi.prepareDb("notifikasi");
    await this.dbStatusProspecting.prepareDb("status-prospecting");
    await this.dbDataSource.prepareDb("data-source");
    await this.dbCalonKonsumen.prepareDb("calon-konsumen");
    await this.dbProspectingFollowup.prepareDb("calon-konsumen");
    await this.dbApprovalGroup.prepareDb("approval-group");
    await this.dbKonsumenNego.prepareDb("konsumen-nego");
    await this.dbApprovalStatus.prepareDb("approval-status");
    await this.dbApprovalRequest.prepareDb("approval-request");
    await this.dbSysCompany.prepareDb("sys-company");
    await this.dbSysProject.prepareDb("sys-project");
  }

  openPage(page): void {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    /*
    this.nav.setRoot(ItemsPage, {
      componentName: page.theme
    });
    */
  }

  onLogout(): void{
    this.dbSystem.getRow("1").then((data: System)=>{
      this.loggedUser = false;
      data.loginOtomatis = false;

      this.dbSystem.update(data).then((success: boolean)=>{
        if(success){
          this.user = new User();
          this.nav.setRoot(HomePage);
          //clearInterval(this.interValNotifFG);
        }
      });
    });
  }

  userProfile(): void{
    this.nav.setRoot(UserProfilePage,{user:this.user});
  }

  onLogin(): void{
    //this.nav.setRoot(LoginPage);
    let params = {callback:(user: User)=>{
      this.onInitUser(user);
      this.nav.setRoot(HomePage,{user:user});
    }};
    this.showModal(LoginPage,params);
  }

  onRegister(): void{
    //this.nav.setRoot(RegisterPage);
    let params = {callback:(user: User)=>{
      this.onVerifikasi(user);
    }};
    this.showModal(RegisterPage,params);
  }

  onVerifikasi(user: User) {
    //this.modalCtrl.create(VerifikasiPage, { callback: this.callbackVerify },{showBackdrop:true}).present();
    let params = {
      email: (user?user.email:null),
      callback:(user: User)=>{
        this.onInitUser(user);
        this.nav.setRoot(HomePage,{user:user});
      }
    };

    this.showModal(VerifikasiPage,params);
  }

  showloading(): void{
    if(!this.loadingExist){

      this.loading = this.loadingCtrl.create({
        spinner: "bubbles",
        content: 'Loading...!',
        enableBackdropDismiss: false
      });

      this.loading.onDidDismiss(()=>{
        this.loadingExist = false;
      });

      this.loading.present();
    }
  }

  hideloading(): void{
    this.loading.dismissAll();
  }

  goHome(): void {
    this.nav.setRoot(HomePage,{user:this.user});
    if(this.menu.isOpen()){
      this.menu.close();
    }
  }

  onApproval(): void{
    this.nav.setRoot(ApprovalPage,{ user: this.user });
  }

  async onSyncApprovalGroup(){
    return new Promise((resolve,reject)=>{
      this.approvalGroupRest.getRows()
      .then((response: ApiResponse)=>{
        if(response.success){
          let listGroup = response.data as ApprovalGroup[];
          listGroup.forEach(async (value: ApprovalGroup,index: number)=>{
            await this.dbApprovalGroup.getRow(value.kode)
            .then(async (result: ApprovalGroup)=>{
              if(!result){
                value._id = value.kode;
                await this.dbApprovalGroup.create(value);
              }else{
                result.nama = value.nama;
                result.icon = value.icon;
                await this.dbApprovalGroup.update(result);
              }
              if(index+1 == listGroup.length){
                resolve();
              };
            });
          });
          if(listGroup.length==0){
            resolve();
          }
        }else{
          resolve();
        }
      }).catch((error)=>{
        resolve();
      });
    });
  }

  async onSyncApprovalStatus(){
    return new Promise((resolve,reject)=>{
      this.approvalStatusRest.getRows()
      .then((response: ApiResponse)=>{
        if(response.success){
          let listStatus = response.data as ApprovalStatus[];
          listStatus.forEach(async (value: ApprovalStatus,index: number)=>{
            await this.dbApprovalStatus.getRow(value.kode)
            .then(async (result: ApprovalStatus)=>{
              if(!result){
                value._id = value.kode;
                await this.dbApprovalStatus.create(value);
              }else{
                result.nama = value.nama;
                result.icon = value.icon;
                //result.kodeStatus = value.kodeStatus;
                await this.dbApprovalStatus.update(result);
              }
              if(index+1 == listStatus.length){
                resolve();
              };
            });
          });
          if(listStatus.length==0){
            resolve();
          }
        }else{
          resolve();
        }
      }).catch((error)=>{
        resolve();
      });
    });
  }

  ngOnDestroy() {
    this.onResumeSubscription.unsubscribe();
    this.onPauseSubscription.unsubscribe();
    this.events.unsubscribe('receiverRoot');
  }

  showModal(page: Page,params: any){
    this.myModal = this.modalCtrl.create(page,params);
    this.myModal.onDidDismiss(()=>{
      this.myModal = undefined;
    });
    this.myModal.present();
  }

  registerBackButtonExit(): void{
    this.platform.registerBackButtonAction(()=>{

        if(!this.allowExit){
          const overlay = this.ionicApp._overlayPortal.getActive();

          if(overlay && overlay.dismiss){
            overlay.dismiss();
          }else if(this.myModal){
            this.myModal.dismiss();
          }else{

            const activeNav = this.app.getActiveNav();

            if(activeNav.canGoBack()){
              activeNav.pop();
            }else{

              if(this.nav.getActive().component != HomePage)
              {
                this.goHome();
              }else{
                let toast = this.toastCtrl.create({
                  message: 'Press again to exit..!',
                  duration: 1500,
                  position: 'bottom'
                });
      
                toast.onDidDismiss(() => {
                  this.allowExit = false;
                });
      
                toast.present();
                this.allowExit = true;
              }
            }
          }
        }else{
          //clearInterval(this.interValNotifFG);
          this.onBackgroundApp(true);
          //this.platform.exitApp();
        }
    });
  }

  ionViewDidLeave(){
    this.clearIntervalForeGround()
  }

  scheduleNotifications(notifikasi: Notifikasi){
    //this.localNotifications.schedule(listNotifikasi);
    this.localNotifications.schedule({
      id: Math.floor(1000 + Math.random() * 9000),
      title: notifikasi.judul,
      text: notifikasi.keteranganSingkat,
      at: new Date(new Date().getTime()+100),
      firstAt: new Date(new Date().getTime()+100),
      sound: this.setSound(),
      data: notifikasi
    });
  }

  setSound(){
    if(this.platform.is('android')) {
      return 'file://assets/sounds/merope.mp3'
    } else {
      return 'file://assets/sounds/notification48.mp3'
    }
  }

  onDashboard(tipe: string): void{
    let dashboardUrl : string = "";
    let dashboardTitle : string = "";

    switch(tipe){
      case "sales":
        dashboardUrl = "https://tadashi:SuperHiro1@dashboard.mncfinance.net/Dashboard/Sales";
        dashboardTitle = "Dashboard Sales";
        break;
      case "cmo":
        dashboardUrl = "https://dashboard.mncfinance.net/Dashboard/Sales";
        dashboardTitle = "Dashboard CMO";
        break;
      case "showroom":
        dashboardUrl = "https://dashboard.mncfinance.net/Dashboard/Sales";
        dashboardTitle = "Dashboard Showroom";
        break;
    }

    this.nav.setRoot(DashboardPage,{ url : dashboardUrl, title : dashboardTitle });
  }

  onBackgroundApp(keepFromList): void{

    if(!this.backgroundMode.isActive()){
      this.backgroundMode.moveToBackground();
      if(!keepFromList){
        this.backgroundMode.excludeFromTaskList();
      }
    }

  }

  clickBackgroundNotifikasi(kodeReq: string,kodeNotifikasi: string){
    this.dbApprovalRequest.getRow(kodeReq)
    .then((approvalReq:ApprovalRequest)=>{
      if(!approvalReq){
        this.downloadApproval(kodeReq,kodeNotifikasi, false , ()=>{
          this.setRead(kodeNotifikasi);
        });
      }else{
        this.setRead(kodeNotifikasi);
        this.nav.push(ApprovalDetailPage,{ user: this.user , approval: approvalReq });
      }
    });
  }

  clearIntervalForeGround(){
    clearInterval(this.interValNotifFG);
  }

  /*
  clearIntervalBackGround(){
    clearInterval(this.interValNotifBG);
  }

  bindIntervalBackground(){
    this.clearIntervalForeGround();
    this.interValNotifBG = setInterval(()=>{
      let notif = new Notifikasi();
      notif.judul = "ZZZZ";
      notif.keteranganSingkat = "ZZZCCCCCCCCCCCC";
      this.scheduleNotifications(notif);
      $.get("http://iproveapi.mncfinance.net/connection/check",function(data){
        let notif = new Notifikasi();
        notif.judul = data.message;
        notif.keteranganSingkat = data.message;
        this.scheduleNotifications(notif);
      });
    }30000);
  }
  */

  onDownloadManualBook(): void{

    let pathFile : string = this.file.externalRootDirectory + "Download/iProve Manual Book";
    let nameFile : string = "I-Prove-Manual-Book.pdf";

    const contentType = 'application/pdf';
    this.fileOpener.open(pathFile+"/"+nameFile,contentType).catch(e => {
      this.showloading();
      //this.isBusy = true;
      let url : string = BASE_API_URL+API_APPLCHECKLIST+"DownloadOld?lokasiFile=Manualbook/i-Prove-Manual-Book.pdf";
      this.cekKoneksi.isConnect().then(async(response: ApiResponse)=>{
        let errorMessage = "";
        this.fileTransfer.download(url, this.file.externalRootDirectory + 'Download/iProve Manual Book/I-Prove-Manual-Book.pdf')
        .then((entry) => {
          this.hideloading();
          this.onDownloadManualBook();
        }, (error) => {
          this.hideloading()
          errorMessage = (errorMessage!=""?errorMessage:"There was some error downloading the file. Error code: ${error.code}");
          MyAlert.info(this.alertCtrl,errorMessage);
        });
      }).catch((response: Response)=>{
        this.hideloading();
        MyAlert.infoNotConnect(this.alertCtrl);
      });
    });
  }

}