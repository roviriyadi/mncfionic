import { Component } from "@angular/core";
import { NavParams, NavController } from "ionic-angular";
import { IonicPage } from "ionic-angular/navigation/ionic-page";

@IonicPage()
@Component({
    selector: 'pop-list',
    templateUrl: 'pop-list.html'
})

export class PopListPage {

    public options: any;

    constructor(private navCtrl: NavController,private navParams: NavParams) {
        this.options = this.navParams.get("options");
    }

    onOptionClick(option): void{
        this.navCtrl.pop();
        //this.options.events(optionName);
        option.event();
    }

}