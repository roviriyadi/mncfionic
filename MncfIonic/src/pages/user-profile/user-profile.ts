import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { DbService } from '../../storage/db-service';
import { LoginItem } from '../../components/login/login-item';
import { System } from '../../models/system';

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage implements OnInit {
  
  private user: User;
  public loginOtomatis: boolean = true;
  private dbUser: DbService = new DbService();
  private dbSystem: DbService = new DbService();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = navParams.get("user");
  }

  ngOnInit(): void {
    this.dbUser.prepareDb("user");
    this.dbSystem.prepareDb("system");
  }

  browseGalery(): void {
    
  }

  changeLoginOtomatis(e): void {
    this.dbUser.getRow(this.user.kode).then((user: User)=>{
      user.loginOtomatis = this.user.loginOtomatis;
      this.dbUser.update(user).then((success: boolean)=>{
        this.user = user;
        this.dbSystem.getRow("1").then((sys: System)=>{
          sys.loginOtomatis = this.user.loginOtomatis;
          this.dbSystem.update(sys).then((success:boolean)=>{});
        });
      });
    });
  }

} 