import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Events } from 'ionic-angular';
import { User } from '../../models/user';
import { UserRest } from '../../rest-service/user-rest';
import { ApiResponse } from '../../models/api-response';
import { HomePage } from '../home/home';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn, FormBuilder } from '@angular/forms';
import { PasswordValidator } from '../../custom-validator/password-validator';
import { DbService } from '../../storage/db-service';
import { MyAlert } from '../../share-function/my-alert';
import { MyLoading } from '../../share-function/my-loading';

/**
 * Generated class for the verifikasiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verifikasi',
  templateUrl: 'verifikasi.html'
})
export class VerifikasiPage implements OnInit{

  private form: any;
  private user: User;
  
  private autoVerifikasi: boolean = false;
  private verifikasi: FormGroup;
  private email: AbstractControl;
  private kodeVerifikasi: AbstractControl;
  private dbUser: DbService = new DbService();//("user");
  private callback : Function ;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public userRest: UserRest,
    private formBuilder: FormBuilder,
    public events: Events) {

    if(this.navParams.get("email")){
      this.user = new User();
      this.user.email = this.navParams.get("email");
      if(this.user.email){
        this.autoVerifikasi = true;
      }
    }

    this.callback = this.navParams.get("callback");

    this.form = {
      verifikasi: "Verify Account",
      email: "Email",
      kodeVerifikasi: "Verification Code"
    };

  }

  ngOnInit(){

    this.dbUser.prepareDb("user");

    this.verifikasi = this.formBuilder.group({
      email: new FormControl(),
      kodeVerifikasi: new FormControl()
    });

    if(this.autoVerifikasi){
      this.verifikasi.controls["email"].setValue(this.user.email);
    }

    this.email = this.verifikasi.controls["email"];
    this.kodeVerifikasi = this.verifikasi.controls["kodeVerifikasi"];

  }

  onSubmit(){
    if(this.verifikasi.valid){
      
      MyLoading.showLoading(this.events);

      this.userRest.verifikasi(this.verifikasi.value).then((response: ApiResponse)=>{
        if(response.success){
          
          this.user = response.data as User;
          this.user._id = this.user.kode;
          this.dbUser.create(this.user).then((success: boolean)=>{
            MyLoading.hideLoading(this.events,undefined);
            //this.events.publish("receiverRoot", this.user , "login");
            this.navCtrl.pop();
          });
        }else{
          MyLoading.hideLoading(this.events,()=>MyAlert.info(this.alertCtrl,response.message));
        }
      });
    }
  }

  onCancel(event: Event){
    event.preventDefault();
    event.stopPropagation();
    //this.navCtrl.setRoot(HomePage, {} , {animate: true, direction: 'forward'});
    this.navCtrl.pop();
  }

  ionViewWillLeave(){
    if(this.user && this.callback){
      this.callback(this.user);
    }
  }

}