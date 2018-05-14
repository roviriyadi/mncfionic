import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser'
import { SafeUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  
  private dashboardUrl: SafeUrl;
  private title: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,public sanitizer: DomSanitizer) {
    this.title = this.navParams.get("title");
    this.dashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.navParams.get("url"));
  }

}