import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { Md5 } from 'ts-md5/dist/md5';

/**
 * Generated class for the SecurityValidatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-security-validate',
  templateUrl: 'security-validate.html',
})
export class SecurityValidatePage {

  private form: any;
  private callback: Function;
  private user: User;
  private password: string = "";
  private matchPassword: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.callback = this.navParams.get("callback");
    this.user = this.navParams.get("user");
  }

  onChangePassword(event){
    this.matchPassword = (this.user.password == Md5.hashStr(this.password).toString());
  }

  onComfirm():void{
    if(this.callback){
      this.navCtrl.pop();
      this.callback(true);
    }
  }

  onCancel(): void{
    this.navCtrl.pop();
  }

}