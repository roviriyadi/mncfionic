import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { User } from '../../models/user';
import { UserRest } from '../../rest-service/user-rest';
import { ApiResponse } from '../../models/api-response';
import { ValidationService } from '../../services/validation';
import { HomePage } from '../home/home';
import { Toast } from 'ionic-native';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn, FormBuilder } from '@angular/forms';
import { PasswordValidator } from '../../custom-validator/password-validator';
import { VerifikasiPage } from '../verifikasi/verifikasi';
import { MyAlert } from '../../share-function/my-alert';
import { Events } from 'ionic-angular/util/events';
import { MyLoading } from '../../share-function/my-loading';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers:[ValidationService]
})
export class RegisterPage implements OnInit{

  private form: any;
  private user: User;
  
  private registered: boolean = false;
  private register: FormGroup;
  private kode: AbstractControl;
  private nama: AbstractControl;
  private email: AbstractControl;
  private noHp: AbstractControl;
  private password: AbstractControl;
  private confirmPassword: AbstractControl;
  private callback: Function;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private validationService: ValidationService,
    private userRest: UserRest,
    private formBuilder: FormBuilder,
    private events: Events) {

    this.callback = this.navParams.get("callback");
    this.user = new User();

    this.form = {
      register: "Register",
      kode: "User ID",
      nama: "Name",
      email: "Email",
      noHp: "Phone",
      password: "Password",
      confirmPassword: "Repeat Password",
      submit: "Submit"
    };

  }

  ngOnInit(){

    this.register = this.formBuilder.group({
      kode: new FormControl(),
      nama: new FormControl(),
      email: new FormControl(),
      noHp: new FormControl(),
      password: new FormControl(),
      confirmPassword: new FormControl()
    },{
      validator: PasswordValidator.isMatching
    });

    this.kode = this.register.controls["kode"];
    this.nama = this.register.controls["nama"];
    this.email = this.register.controls["email"];
    this.noHp = this.register.controls["noHp"];
    this.password = this.register.controls["password"];
    this.confirmPassword = this.register.controls["confirmPassword"];

  }

  onSubmit(){
    if(this.register.valid){
      
      MyLoading.showLoading(this.events);

      this.user = this.register.value;
      this.userRest.register(this.user).then((response: ApiResponse)=>{
        MyLoading.hideLoading(this.events,undefined);
        if(response.success){
          this.registered = true;
          this.user.kodeVerifikasi = response.message;
          this.userRest.sendEmailVerifikasi(this.user);
          this.navCtrl.pop();
          //this.events.publish("receiverRoot", this.user , "verify");
          /*
          this.modalCtrl.create(VerifikasiPage,{email: this.user.email}).present();
          */
        }else{
          MyAlert.info(this.alertCtrl,response.message);
        }
      })
    }
  }

  /*
  onVerifikasi() {
    this.navCtrl.setRoot(VerifikasiPage, {} , {animate: true, direction: 'forward'});
    //this.modalCtrl.create(VerifikasiPage).present();
  }
  */

  onCancel(events: Event): void{
    events.preventDefault();
    events.stopPropagation();
    this.navCtrl.pop();
  }

  ionViewWillLeave(){
    if(this.registered && this.callback){
      this.callback(this.user);
    }
  }
}