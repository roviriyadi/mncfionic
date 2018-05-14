import { Component, ElementRef, Input, SimpleChange } from '@angular/core';
import { DbService } from '../../storage/db-service';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { CalonKonsumen } from '../../models/calon-konsumen';

@Component({
  selector: '[konsumen-count-badge]',
  templateUrl: 'konsumen-count-badge.html'
})
export class KonsumenCountBadgeDirective implements OnChanges {
  @Input() kodeStatus: string;
  private dbKota: DbService = new DbService();
  private dataCount: number = 0;

  constructor(private el: ElementRef) {
    console.log(el);
    this.dbKota.prepareDb("calon-konsumen");
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
      let changedkodeStatus = changes["kodeStatus"];
      if(changedkodeStatus){
        let kodeStatus = changedkodeStatus.currentValue;
        this.setDataCount(kodeStatus);
      }
   }

  setDataCount(kodeStatus: string) {
    this.dbKota.getRows().then((data: CalonKonsumen[])=>{
      console.log(data);
      if(data){
        this.dataCount = data.filter((item: CalonKonsumen,index: number)=>{
          return item.kodeStatus == kodeStatus;
        }).length;
      }
    });
  }

}