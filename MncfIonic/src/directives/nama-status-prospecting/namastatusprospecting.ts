import { Directive, ElementRef, Input, SimpleChange } from '@angular/core';
import { DbService } from '../../storage/db-service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { StatusProspecting } from '../../models/status-prospecting';

@Directive({
  selector: '[nama-status-prospecting]'
})
export class NamaStatusProspectingDirective implements OnChanges {
  @Input() kodeStatus: string;

  private dbStatusProspecting: DbService = new DbService();

  constructor(private el: ElementRef) {
    this.dbStatusProspecting.prepareDb("status-prospecting");
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
      let changedkodeStatus = changes["kodeStatus"];
      if(changedkodeStatus){
        let kodeStatus = changedkodeStatus.currentValue;
        this.setNamaStatus(kodeStatus);
      }
   }

  setNamaStatus(kodeStatus: string) {
    this.dbStatusProspecting.getRows()
    .then((data: StatusProspecting[])=>{
      if(data && data.length>0){
        let name = "";
        data.forEach((item:StatusProspecting,index:number)=>{
          if(item.kode===kodeStatus){
            name = item.deskripsi;
            if(this.el.nativeElement.tagName!="ION-INPUT"){
              this.el.nativeElement.innerText = name; //data.deskripsi;
              this.el.nativeElement.innerHtml = name; //data.deskripsi;
            }else{
              this.el.nativeElement.children[0].value = name; //data.deskripsi;
            }
          }
        });
      }
    });
  }

}