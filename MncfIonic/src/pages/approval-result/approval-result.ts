import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbService } from '../../storage/db-service';
import { ApprovalStatus } from '../../models/approval-status';
import { ApprovalResult } from '../../models/approval-result';
import { MyAlert } from '../../share-function/my-alert';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { SecurityValidatePage } from '../security-validate/security-validate';
import { User } from '../../models/user';

/**
 * Generated class for the ApprovalResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-approval-result',
  templateUrl: 'approval-result.html',
})
export class ApprovalResultPage {

  public result: ApprovalResult;
  public submit: Function;
  private dbStatus: DbService = new DbService();
  private listStatus: ApprovalStatus[];
  private user: User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController
  ){
    
    this.result = this.navParams.get("data");
    this.user = this.navParams.get("user");
    this.result.kodeStatus = "";
    this.result.catatan = "";

    this.submit = navParams.get("onSubmit");
  }

  ngOnInit(): void{
    this.dbStatus.prepareDb("approval-status");
    this.dbStatus.getRows()
    .then(async(data: ApprovalStatus[])=>{
      if(data){
        this.listStatus = await data.filter((item)=>{
          return item.kodeStatus != "NEW";
        });
      }
    });
  }

  onCancel(): void{
    this.navCtrl.pop();
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
        this.submit(this.result);
      }
    };

    this.navCtrl.push(SecurityValidatePage,{ callback: onValid , user: this.user });

  }

}