import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController , Events, LoadingController } from 'ionic-angular';
import { UserRest } from '../../rest-service/user-rest';
import { ApiResponse } from '../../models/api-response';
import { Observable } from 'rxjs/Observable';
import { Md5 } from '../../../node_modules/ts-md5/dist/md5';
import { RegisterPage } from '../register/register';
import { User } from '../../models/user';
import { DbService } from '../../storage/db-service';
import { MyLoading } from '../../share-function/my-loading';
import { MyAlert } from '../../share-function/my-alert';
import { CekKoneksiRest } from '../../rest-service/cek-koneksi-rest';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  
  private form: any;
  private apiResponse: ApiResponse;
  private dbUser: DbService = new DbService();//("user");
  private user: User;
  public userlogin: string;
  public password: string;
  private callback : Function ;

  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    private userRest: UserRest,
    private cekKoneksiRest: CekKoneksiRest,
    private events: Events,
    private alertCtrl: AlertController) {

    this.callback = navParams.get("callback");
    
    this.dbUser.prepareDb("user");

    this.form = {
      skip: "Skip",
      logo: "assets/images/logo/login.png",
      iconAccount: "icon-account",
      iconLock: "icon-lock",
      userlogin: "User",
      password: "Password",
      login: "Login",
      register: "Register"
    }
  }

  onLogin(){
    
    MyLoading.showLoading(this.events);

    this.cekKoneksiRest.isConnect().then((response: ApiResponse)=>{
      this.userRest.validateLogin(this.userlogin,Md5.hashStr(this.password).toString())
      .then((response: ApiResponse)=>{
        if(response.success){
          this.getUserOnline();
        }else{
          MyLoading.hideLoading(this.events,()=> MyAlert.info(this.alertCtrl,response.message));
        }
      }).catch((error: ApiResponse)=>{
        MyLoading.hideLoading(this.events,()=> MyAlert.info(this.alertCtrl,error.message));
      });
    }).catch((error: ApiResponse)=>{
      this.dbUser.getRows().then((data: User[])=>{

        if(!data){
          MyLoading.hideLoading(this.events,()=> MyAlert.info(this.alertCtrl,error.message));
          return;
        }

        data.forEach(item => {
          if(item.kode == this.userlogin || item.email == this.userlogin || item.noHp  == this.userlogin){
            this.user = item;
          }
        });
  
        if(this.user){
          if(this.user.password == Md5.hashStr(this.password).toString()){
            //this.events.publish("receiverRoot", this.user , "login");
            MyLoading.hideLoading(this.events,null);
            this.navCtrl.pop();
          }else{
            MyLoading.hideLoading(this.events,()=> MyAlert.info(this.alertCtrl,"Password salah...!"));
          }
        }
      }).catch(()=>{
        MyLoading.hideLoading(this.events,()=> MyAlert.info(this.alertCtrl,error.message));
      });

    });

  }

  onRegister(event: Event){
    event.preventDefault();
    event.stopPropagation();
    this.navCtrl.setRoot(RegisterPage);
  }

  getUserOnline(){
    this.userRest.getMobileUser(this.userlogin)
    .then((response: ApiResponse)=>{
      if(response.success){
        this.user = response.data as User;
        this.user._id = this.user.kode;
        this.dbUser.create(this.user).then((success: boolean)=>{
          MyLoading.hideLoading(this.events,undefined);
          //this.events.publish("receiverRoot", this.user , "login");
          this.navCtrl.pop();
        });
      }
    });

  }

  onCancel(){
    this.navCtrl.pop();
  }

  ionViewWillLeave(){
    if(this.user && this.callback){
      this.callback(this.user);
    }
  }

}