import { Component, trigger, state, transition, style, animate, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Platform } from 'ionic-angular';
import { User } from '../../models/user';
import { ApprovalInfo } from '../../models/approval-info';
import { ApprovalInfoRest } from '../../rest-service/approval-info-rest';
import { ApiResponse } from '../../models/api-response';
import { DbService } from '../../storage/db-service';
import { MyLoading } from '../../share-function/my-loading';
import { Events } from 'ionic-angular/util/events';
import { ApprovalInfoGroup } from '../../models/approval-info-group';
import { ApprovalRequest } from '../../models/approval-request';
import { MyAlert } from '../../share-function/my-alert';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { ApprovalResultPage } from '../approval-result/approval-result';
import { ApprovalResult } from '../../models/approval-result';
import { ApprovalRequestRest } from '../../rest-service/approval-request-rest';
import { ApprovalInfoGroupRest } from '../../rest-service/approval-info-group-rest';
import { ApprovalProgress } from '../../models/approval-progress';
import { ApprovalProgressRest } from '../../rest-service/approval-progress-rest';
import { ExtUrlRest } from '../../rest-service/ext-url-rest';
import { SecurityValidatePage } from '../security-validate/security-validate';
import { ApprovalStatus } from '../../models/approval-status';
import { timeout } from 'rxjs/operator/timeout';
//import { File,Transfer } from 'ionic-native';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
//import { FileChooser} from '@ionic-native/file-chooser';
import { API_APPLCHECKLIST, BASE_API_URL } from '../../my-config/api-config';
import { ApplChecklistRest } from '../../rest-service/appl-cheklist-rest';
import { ApplChecklist } from '../../models/appl-checklist';
//import { DocumentViewerOptions, DocumentViewer } from '@ionic-native/document-viewer';
import { FileOpener } from '@ionic-native/file-opener';
import { ImageViewerController } from 'ionic-img-viewer';
import { CekKoneksiRest } from '../../rest-service/cek-koneksi-rest';
import { ApprovalSyncLevel } from '../../models/approval-sync-level';

/**
 * Generated class for the ApprovalDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  animations: [
    trigger('accordion', [
        state('opened', style({ overflow: 'hidden', height: '*' })),
        state('closed', style({height: 0})),
        transition('* => *', [animate('500ms ease')]),
    ])
  ],
  selector: 'page-approval-detail',
  templateUrl: 'approval-detail.html',
})

export class ApprovalDetailPage {

  @ViewChild(Content) content: Content;

  private approval: ApprovalRequest;
  private result: ApprovalResult = new ApprovalResult();
  private listStatus: ApprovalStatus[];
  private showResult: boolean = false;
  private infoList: ApprovalInfo[];
  private infoGroupList: ApprovalInfoGroup[];
  private approvalSyncLevel: ApprovalSyncLevel;
  private user: User;
  private callback: Function;
  private dbStatus: DbService = new DbService();
  private dbApprovalResult: DbService = new DbService();
  private dbApprovalRequest: DbService = new DbService();
  private isBusy: boolean = false;
  private accordionItems: any[] = [];
  private approvalProgressList: ApprovalProgress[] = [];
  private dockLists: ApplChecklist[] = [];
  private openExecutiveSum: boolean = false;
  private openDocCheck: boolean = false;
  private loadedExsum: boolean = false;
  private openApprHis: boolean = false;
  private fileTransfer: FileTransferObject = this.transfer.create();
  private allowProcess: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private extUrlRest: ExtUrlRest,
    private approvalInfoGroupRest: ApprovalInfoGroupRest,
    private approvalInfoRest: ApprovalInfoRest,
    private approvalRequestRest: ApprovalRequestRest,
    private approvalProgressRest: ApprovalProgressRest,
    private cekKoneksi: CekKoneksiRest,
    private applCheckRest: ApplChecklistRest,
    private events: Events,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private platform: Platform,
    private transfer: FileTransfer,
    private file: File,
    private fileOpener: FileOpener,
    private imageViewerCtrl: ImageViewerController) {
    
    this.user = this.navParams.get("user");
    this.approval = this.navParams.get("approval");
    this.callback = this.navParams.get("callback");

  }

  async prepareDatabase(){
    await this.dbApprovalResult.prepareDb("approval-result");
    await this.dbApprovalRequest.prepareDb("approval-request");
    await this.dbStatus.prepareDb("approval-status");
  }

  async ionViewDidLoad() {
    await this.prepareDatabase();
    this.result.kodeStatus = "";
    this.onSync(null);
    this.dbStatus.getRows()
    .then(async(data: ApprovalStatus[])=>{
      if(data){
        this.listStatus = await data.filter((item)=>{
          return item.kodeStatus != "NEW";
        });
      }
    });
  }

  async loadData(){
    
    this.accordionItems = [];
    //this.infoGroupList = [];
    //this.infoGroupList = await this.getInfoGroup() as ApprovalInfoGroup[];
    //this.infoList = await this.getInfo() as ApprovalInfo[];

    if(this.infoGroupList){
      await this.infoGroupList.forEach(async (infoGroup: ApprovalInfoGroup,index : number)=>{
        let items = await this.genItem(infoGroup.kode) as ApprovalInfo[];
        let group = {
          code: infoGroup.kode,
          name: infoGroup.nama,
          icon: infoGroup.icon,
          open: false,
          children: items
        };
        await this.accordionItems.push(group);
      });
    }

  }

  async genItem(kodeInfoGroup: string){
    return new Promise(async (resolve,reject)=>{
      if(kodeInfoGroup && this.infoList.length>0){
        let groupedList = await this.infoList.filter((item)=>{
          return item.kodeInfoGroup===kodeInfoGroup;
        })
        resolve(groupedList);
      }else{
        resolve(null);
      }
    });
  }

  async onSync(refresher) {

    this.isBusy = true;
    
    MyLoading.showLoading(this.events);

    if(this.user.kode!="admin"){
      this.approvalRequestRest.getCurrentLevel(this.approval.kodeReferensi,this.user.kode)
      .then((response: ApiResponse)=>{
        if(response.success){
          this.approvalSyncLevel = response.data as ApprovalSyncLevel;
          if(this.approvalSyncLevel.currentUser == this.user.kode){
            this.allowProcess = true;
          }else{
            this.dbApprovalRequest.getRow(this.approval._id).then((data:ApprovalRequest)=>{
              if(data){
                this.approval = data;
                this.approval.kodeStatus = this.approvalSyncLevel.yourResult;
                this.approval.levelProses = this.approvalSyncLevel.currentLevel;
                this.dbApprovalRequest.update(this.approval);
              }
            });
          }
        }
      }).catch((error)=>{
      });
    }else{
      /* Muncul tombol proses tapi tidak dapat execute ke MSIX Hanya untuk demo saja */
      this.allowProcess = true;
    }
    
    await this.onDownloadInfoGroup();
    
    if(this.infoGroupList && this.infoGroupList.length > 0){
      await this.onDownloadInfo();
      if(this.infoList && this.infoList.length > 0){
        await this.loadData();
      }
    }

    this.loadApprovalProgress();
    this.loadDocChecklist();

    if(refresher) refresher.complete();
    MyLoading.hideLoading(this.events,null);
    this.isBusy = false;

  }

  async onDownloadInfoGroup(){
    return new Promise((resolve,reject)=>{
      this.approvalInfoGroupRest.getRowsByGroup(this.approval.kodeGroup)
      .then((response: ApiResponse)=>{
        if(response.success){
          this.infoGroupList = response.data as ApprovalInfoGroup[];
        }
        resolve();
      }).catch((error)=>{
        resolve();
        MyAlert.infoNotConnect(this.alertCtrl);
      });
    });
  }

  async onDownloadInfo(){
    return new Promise((resolve, reject)=>{
      this.approvalInfoRest.getRows(this.approval.kode)
      .then((response: ApiResponse)=>{
        if(response.success){
          this.infoList = response.data as ApprovalInfo[];
          
          /*
          list.forEach((item: ApprovalInfo,index: number)=>{
              this.dbApprovalInfo
              .getRow(item.kode)
              .then(async (data:ApprovalInfo)=>{
                  if(data){
                    let toupdate = Object.assign(data,item);
                    await this.dbApprovalInfo.update(toupdate);
                  }else{
                    item._id = item.kode;
                    await this.dbApprovalInfo.create(item);
                  }
                  if(list.length === index+1){
                    resolve();
                  }
              });
          });

          if(list.length===0) resolve();
          */
        }
        resolve();
      }).catch((error)=>{
        resolve();
        MyAlert.infoNotConnect(this.alertCtrl);
      });
    });
  }

  toggleSection(i) {
    this.accordionItems[i].open = !this.accordionItems[i].open;
  }

  toggleDocCheck(){
    this.openDocCheck = !this.openDocCheck;
  }

  toggleApprHis(){
    this.openApprHis = !this.openApprHis;
  }

  toggleExecutiveSummarySection(){
    this.openExecutiveSum = !this.openExecutiveSum;
    if(!this.loadedExsum){
      this.loadExsum();
    }
  }

  loadExsum(){
    //this.extUrlRest.getExtUrl("https://report.mncfinance.net/VWApprovalApplication.aspx?par1=P18021802&par2=119App180200010")
    //this.extUrlRest.getExtUrl("report-mnc/VWApprovalApplication.aspx?par1=P18021802&par2=119App180200010")
    this.extUrlRest.getExtUrl("https://tadashi:SuperHiro1@dashboard.mncfinance.net/Dashboard/Sales")
    .then((data)=>{
    //this.httpClient.get("https://angular.io/guide/template-syntax")
    //.map(response => response.text())
    //.subscribe((data)=>{
      document.getElementById("exsum-div").innerHTML = data.toString();
      this.loadedExsum = true;
    });
  }

  loadDocChecklist(){
    if(this.approval){
      this.applCheckRest.getRows(this.approval.kodeReferensi)
      .then((response:ApiResponse)=>{
        if(response.success){
          this.dockLists = response.data as ApplChecklist[];
        }
      });
    }
  }
  
  loadApprovalProgress(){
    if(this.approval){
      this.approvalProgressRest.getRows(this.approval.kode,this.approval.kodeReferensi)
      .then((response:ApiResponse)=>{
        if(response.success){
          this.approvalProgressList = response.data as ApprovalProgress[];
        }
      });
    }
  }
  /*
  onProcess(){
    
    let result = new ApprovalResult();
    result.kodeApproval = this.approval.kode;
    result.synced = false;
    result.tglResult = new Date();

    let params = {
      user: this.user,
      data : result,
      onSubmit : async (approvalResult: ApprovalResult)=>{

        MyLoading.showLoading(this.events);

        approvalResult.kodeUser = this.user.kode;
        approvalResult.catatan = approvalResult.catatan.replace(/\n/g, '<br/>');

        this.approvalRequestRest.postResult(approvalResult)
        .then(async (response: ApiResponse)=>{
          if(response.success){
            approvalResult._id = response.message.toString();
            approvalResult.kode = approvalResult._id;

            await this.dbApprovalResult.create(approvalResult);
            this.approval = await this.dbApprovalRequest.getRow(this.approval.kode) as ApprovalRequest;
            this.approval.kodeStatus = result.kodeStatus;
            await this.dbApprovalRequest.update(this.approval);
            MyLoading.hideLoading(this.events,null);
            if(this.callback){
              this.callback();
            }
            modal.dismiss();
          }else{
            MyLoading.hideLoading(this.events,null);
            MyAlert.info(this.alertCtrl,response.message);
          }
        }).catch((error: ApiResponse)=>{
          MyLoading.hideLoading(this.events,null);
          MyAlert.infoNotConnect(this.alertCtrl);
        });
      }
    }

    let modal = this.modalCtrl.create(ApprovalResultPage,params);
    modal.present();

  }
  */

  toggleProses(): void{
    this.showResult = !this.showResult;
    if(this.showResult){
      setTimeout(()=>{
        this.content.scrollToBottom();
      },500);
    }
  }

  onCancel(): void{
    this.showResult = false;
    this.result = new ApprovalResult();
  }

  onSubmit(): void{

    if(this.result.kodeStatus===""){
      MyAlert.info(this.alertCtrl,"Result can't be empty!");
      return;
    }

    if(this.result.catatan===""){
      MyAlert.info(this.alertCtrl,"Notes can't be empty!");
      return;
    }

    let onValid = (valid: boolean)=>{
      if(valid){
        MyLoading.showLoading(this.events);

        let approvalResult = this.result;
        let catatanOri = approvalResult.catatan;
        approvalResult.kodeApproval = this.approval.kode;
        approvalResult.catatan = approvalResult.catatan.replace(/\n/g, '<br/>');
        approvalResult.kodeUser = this.user.kode;
        approvalResult.synced = false;
        approvalResult.tglResult = new Date();

        this.approvalRequestRest.postResult(approvalResult)
        .then(async (response: ApiResponse)=>{
          if(response.success){
            this.loadApprovalProgress();

            approvalResult._id = response.message.toString();
            approvalResult.kode = approvalResult._id;

            await this.dbApprovalResult.create(approvalResult);
            this.approval = await this.dbApprovalRequest.getRow(this.approval._id) as ApprovalRequest;
            this.approval.kodeStatus = this.result.kodeStatus;
            await this.dbApprovalRequest.update(this.approval);
            this.onCancel();
            MyLoading.hideLoading(this.events,null);
            if(this.user.kode==="admin"){
              MyAlert.info(this.alertCtrl,"Anda adalah Administrator, yang telah anda proses dianggap sebagai percobaan saja.");
            }
          }else{
            this.result.catatan = catatanOri;
            MyLoading.hideLoading(this.events,null);
            MyAlert.info(this.alertCtrl,response.message);
          }
        }).catch((error: ApiResponse)=>{
          this.result.catatan = catatanOri;
          MyLoading.hideLoading(this.events,null);
          MyAlert.infoNotConnect(this.alertCtrl);
        });
      }
    };

    this.navCtrl.push(SecurityValidatePage,{ callback: onValid , user: this.user });

  }

  downloadFile(docTitle,lokasiFile,filename,extFile,myImage,adaFile) {

    if(!adaFile){
      MyAlert.info(this.alertCtrl,"No file attached!");
      return;
    }

    const url = BASE_API_URL+API_APPLCHECKLIST+"Download?lokasiFile="+lokasiFile;

    if(extFile=='jpg' || extFile=='jpeg' || extFile=='png'){
      myImage.src=url;
      const imageViewer = this.imageViewerCtrl.create(myImage);
      imageViewer.present();
    }else{

      let pathFile : string = this.file.externalRootDirectory + "Download/iProve Document Checklist/" + this.approval.kodeReferensi;

      const contentType = 'application/'+extFile;
      //this.fileOpener.open(entry.toInternalURL().replace(new RegExp('%20','g'),' '),contentType)
      this.fileOpener.open(pathFile + "/" + filename,contentType).catch(e => {
        
        MyLoading.showLoading(this.events);
        this.isBusy = true;

        this.cekKoneksi.isConnect().then(async(response: ApiResponse)=>{
          let errorMessage = "";
          this.fileTransfer.download(url, pathFile + "/" + filename)
          .then((entry) => {
              this.isBusy = false;
              MyLoading.hideLoading(this.events,null);
              this.downloadFile(docTitle,lokasiFile,filename,extFile,myImage,adaFile);
          }, (error) => {
            MyLoading.hideLoading(this.events,()=>{
              this.isBusy = false;
              errorMessage = (errorMessage!=""?errorMessage:"There was some error downloading the file. Error code: ${error.code}");
              MyAlert.info(this.alertCtrl,errorMessage);
            });
          });
        }).catch((response: Response)=>{
          MyLoading.hideLoading(this.events,()=>{
            this.isBusy = false;
            MyAlert.infoNotConnect(this.alertCtrl);
          });
        });
      
      });

    }

    //this.fileChooser.open()
    //.then(uri => {
      //alert(uri);
      //alert(this.file.dataDirectory);
      
      /*
      const options: DocumentViewerOptions = {
        title: docTitle,
        documentView : {
          closeLabel : "Close"
        },
        navigationView : {
          closeLabel : "Tutup"
        },
        email : {
          enabled : false
        },
        print : {
          enabled : true
        },
        openWith : {
          enabled : false
        },
        bookmarks : {
          enabled : false
        },
        search : {
          enabled : true
        },
        autoClose: {
          onPause : false
        }
      };
      */

      //alert(url);
      //alert(this.file.dataDirectory);
      //alert(this.file.externalDataDirectory);
      

    //})
    //.catch(e => MyAlert.info(this.alertCtrl,e));

    /*
    let fileTransfer = new Transfer();
    let uri = encodeURI(url);
    let fileName=encodeURI(filename);
    let pathToSave='';

    if (this.platform.is('ios')) {
     pathToSave = cordova.file.documentsDirectory;
    }
    else{
     pathToSave = cordova.file.externalDataDirectory;
    }
    let options ={}
    fileTransfer.download(uri,pathToSave+fileName,true,options)
    .then((data) => {
      MyAlert.info(this.alertCtrl,"The file was successfully downloaded to :${data.toURL()}");
    },
  (err) => {
    MyAlert.info(this.alertCtrl,"There was some error downloading the file. Error code: ${err.code}");
   })
   */
  }

  ionViewWillLeave(){
    if(this.callback){
      this.callback();
    }
  }

  ionViewCanLeave() {
    return !this.isBusy;
  }

}