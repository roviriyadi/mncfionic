import { Events, AlertController } from "ionic-angular";

export class MyAlert {

  static infoNotConnect(alertCtrl: AlertController){
    let alert = alertCtrl.create({
      title: "Information",
      message: "Can't connect to server, please also check your internet connection!",
      buttons: [{
        text:"Ok",
        handler:()=>{}
      }]
    });
    alert.present();
  }

  static info(alertCtrl: AlertController,message: string): void {
    let alert = alertCtrl.create({
      title: "Information",
      message: message,
      buttons: [{
        text:"Ok",
        handler:()=>{}
      }]
    });
    alert.present();
  }
  
  static confirm(alertCtrl: AlertController,message: string,nCallback: Function,yCallback: Function): void {
    let alert = alertCtrl.create({
      title: "Confirmation",
      message: message,
      buttons: [
      {
        text:"No",
        handler: nCallback()
      },
      {
        text:"Yes",
        handler: yCallback()
      }]
    });
    alert.present();
  }

}