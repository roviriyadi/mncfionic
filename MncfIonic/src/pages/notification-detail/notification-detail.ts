import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Notifikasi } from '../../models/notifikasi';
import { htmlDecode } from 'js-htmlencode'
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { DbService } from '../../storage/db-service';

/**
 * Generated class for the NotificationDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification-detail',
  templateUrl: 'notification-detail.html',
})
export class NotificationDetailPage implements OnInit {

  private callback: Function;
  public notifikasi : Notifikasi;
  public pesanEncoded : string;
  public htmlText : string;
  private dbNotifikasi: DbService = new DbService();
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.notifikasi = this.navParams.get("notifikasi");
    this.callback = navParams.get("callback");

    this.dbNotifikasi.prepareDb("notifikasi");

    if(this.notifikasi){
      this.pesanEncoded = htmlDecode(this.notifikasi.pesan);
      this.htmlText = "<textarea readonly class='area-pesan'>AAAAAA</textarea>";
    }

  }

  ngOnInit(): void{
    if(!this.notifikasi.dibaca){
      this.dbNotifikasi.getRow(this.notifikasi.kode).then((data: Notifikasi)=>{
        data.dibaca = true;
        this.dbNotifikasi.update(data);
      });
    }
  }

  ionViewCanLeave() {
    if(this.callback){
      this.callback();
    }
    return true;
  }
}