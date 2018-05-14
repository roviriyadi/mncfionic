import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Promotion } from '../../models/promotion';
import { DomSanitizer } from '@angular/platform-browser'
import { SafeUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';
/**
 * Generated class for the PromotionDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-promotion-detail',
  templateUrl: 'promotion-detail.html',
})
export class PromotionDetailPage {

  public promotion : Promotion;
  public promotionLink : SafeUrl;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sanitizer: DomSanitizer
  ) {

    this.promotion = this.navParams.get("promotion");
    this.promotionLink = sanitizer.bypassSecurityTrustResourceUrl(this.promotion.link);
  
  }

}