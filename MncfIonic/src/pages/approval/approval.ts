import { Component, trigger, state, transition, style, animate } from '@angular/core';
import { IonicPage, NavController, NavParams , AlertController} from 'ionic-angular';
import { DbService } from '../../storage/db-service';
import { ApprovalGroup } from '../../models/approval-group';
import { ApprovalStatus } from '../../models/approval-status';
import { ApprovalRequest } from '../../models/approval-request';
import { ApprovalDetailPage } from '../approval-detail/approval-detail';
import { User } from '../../models/user';
import { Events } from 'ionic-angular/util/events';
import { MyAlert } from '../../share-function/my-alert';
import { ApiResponse } from '../../models/api-response';
import { CekKoneksiRest } from '../../rest-service/cek-koneksi-rest';
import { ApprovalRequestRest } from '../../rest-service/approval-request-rest';
import { ApprovalSyncLevel } from '../../models/approval-sync-level';

@IonicPage()
@Component({
  animations: [
    trigger('accordion', [
        state('opened', style({ overflow: 'hidden', height: '*' })),
        state('closed', style({height: 0})),
        transition('* => *', [animate('500ms ease')]),
    ])
  ],
  selector: 'page-approval',
  templateUrl: 'approval.html',
})
export class ApprovalPage {

  private accordionItems: any[] = [];
  private dbApprovalGroup: DbService = new DbService();
  private dbApprovalRequest: DbService = new DbService();
  private dbApprovalStatus: DbService = new DbService();
  private user: User;
  private approvalSyncLevel: ApprovalSyncLevel;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    private alertCtrl: AlertController,
    private cekKoneksi: CekKoneksiRest,
    private approvalRequestRest: ApprovalRequestRest) {
    this.prepareDatabase();
    this.user = this.navParams.get("user");
  }

  prepareDatabase(){
    this.dbApprovalGroup.prepareDb("approval-group");
    this.dbApprovalStatus.prepareDb("approval-status");
    this.dbApprovalRequest.prepareDb("approval-request");
  }

  async ionViewDidLoad() {
    if(this.user.kode!="admin"){
      await this.onSyncStatus();
    }
    this.loadData();
  }

  async loadData(){

    this.accordionItems = [];
    let approvalGroups = await this.getApprovalGroups() as ApprovalGroup[];

    if(approvalGroups){

      let approvalStatus = await this.getApprovalStatus() as ApprovalStatus[];
      let approvalRequests = await this.getApprovalRequest() as ApprovalRequest[];

      await approvalGroups.forEach(async (groupItem: ApprovalGroup,index : number)=>{
        let accordionSubGroups = await this.genSubGroups(approvalStatus,approvalRequests,groupItem.kode);
        let group = {
          code: groupItem.kode,
          name: groupItem.nama,
          icon: groupItem.icon,
          open: true,
          children: accordionSubGroups
        };
        await this.accordionItems.push(group);
      });
    }
  }

  async getApprovalGroups(){
    return new Promise((resolve,reject)=>{
      this.dbApprovalGroup.getRows()
      .then((data: ApprovalGroup[])=>{
        resolve(data);
      });
    });
  }

  async getApprovalStatus(){
    return new Promise((resolve,reject)=>{
      this.dbApprovalStatus.getRows()
      .then((data: ApprovalStatus[])=>{
        resolve(data);
      });
    });
  }

  async getApprovalRequest(){
    return new Promise((resolve,reject)=>{
      this.dbApprovalRequest.getRows()
      .then((data: ApprovalRequest[])=>{
        resolve(data);
      });
    });
  }

  async filterApprovalRequest(items: ApprovalRequest[],kodeGroup: string,kodeStatus: string){
    return new Promise(async (resolve,reject)=>{
      if(items){
        let filtered = await items.filter((item)=>{
          return item.kodeGroup===kodeGroup && item.kodeStatus===kodeStatus;
        })
        resolve(filtered);
      }else{
        resolve(null);
      }
    });
  }

  async genSubGroups(approvalStatus: ApprovalStatus[],accordionItems: ApprovalRequest[],kodeGroup: string){
    return new Promise(async (resolve,reject)=>{
      if(approvalStatus && approvalStatus.length>0){
        let accordionSubGroups = [];
        await approvalStatus.forEach(async (status: ApprovalStatus,index: number) => {
          let approvalItems = await this.filterApprovalRequest(accordionItems,kodeGroup,status.kodeStatus) as ApprovalRequest[];

          let sub = {
            code: status.kodeStatus,
            name: status.nama,
            icon: status.icon,
            dataCount: approvalItems.length,
            open: true,
            children: approvalItems
          };
          await accordionSubGroups.push(sub);
          if(index+1 == approvalStatus.length){
            resolve(accordionSubGroups);
          }
        });
      }else{
        resolve(null);
      }
    });
  }

  onSyncStatus(){
    return new Promise((resolve,reject)=>{

      this.cekKoneksi.isConnect().then(async(response: ApiResponse)=>{
          let approvalListAll = await this.getApprovalRequest() as ApprovalRequest[];

          if(approvalListAll && approvalListAll.length > 0){
            await approvalListAll.forEach( async (approval: ApprovalRequest,index: number)=>{

            if(approval.kodeStatus==="NEW"){

              await this.approvalRequestRest.getCurrentLevel(approval.kodeReferensi,this.user.kode)
              .then((response: ApiResponse)=>{
                if(response.success){
                  this.approvalSyncLevel = response.data as ApprovalSyncLevel;
                  if(this.approvalSyncLevel.currentUser != this.user.kode){
                    approval.kodeStatus = this.approvalSyncLevel.yourResult;
                    approval.levelProses = this.approvalSyncLevel.currentLevel;
                    this.dbApprovalRequest.update(approval);
                  }
                }
              }).catch((error)=>{
              });

            }

            if((index+1) === approvalListAll.length){
              resolve();
            }

          });
        }else{
          resolve();
        }
      }).catch((response: Response)=>{
        MyAlert.infoNotConnect(this.alertCtrl);
        resolve();
      });
    });
  }

  onDetailInfo(item: ApprovalRequest): void {
    this.cekKoneksi.isConnect().then((response: ApiResponse)=>{
      this.navCtrl.push(ApprovalDetailPage,{approval: item,user: this.user,callback: ()=>{
        this.loadData();
      }});
    }).catch((response: Response)=>{
      MyAlert.infoNotConnect(this.alertCtrl);
    });
  }

  toggleSection(i) {
    this.accordionItems[i].open = !this.accordionItems[i].open;
  }
 
  toggleItem(i, j) {
    this.accordionItems[i].children[j].open = !this.accordionItems[i].children[j].open;
  }

}