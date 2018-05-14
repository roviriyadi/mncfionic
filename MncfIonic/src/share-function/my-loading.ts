import { Events } from "ionic-angular";

export class MyLoading {

  static showLoading(events: Events): void {
    events.publish("receiverRoot", {} , "show-loading");
  }
  
  static hideLoading(events: Events,callback: Function): void {
    events.publish("receiverRoot", {} , "hide-loading", callback);
  }

  static newMessage: boolean;

}