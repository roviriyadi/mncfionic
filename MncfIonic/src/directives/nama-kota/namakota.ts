import { Directive, ElementRef, Input, SimpleChange } from '@angular/core';
import { DbService } from '../../storage/db-service';
import { Kota } from '../../models/kota';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Directive({
  selector: '[nama-kota]'
})
export class NamaKotaDirective implements OnChanges {
  @Input() kodeKota: string;

  private dbKota: DbService = new DbService();

  constructor(private el: ElementRef) {
    this.dbKota.prepareDb("kota");
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
      let changedKodeKota = changes["kodeKota"];
      if(changedKodeKota){
        let kodeKota = changedKodeKota.currentValue;
        this.setNamaKota(kodeKota);
      }
   }

  setNamaKota(kodeKota: string) {
    this.dbKota.getRow(kodeKota).then((data: Kota)=>{
      if(data){
        if(this.el.nativeElement.tagName!="ION-INPUT"){
          this.el.nativeElement.innerText = data.nama;
          this.el.nativeElement.innerHtml = data.nama;
        }else{
          this.el.nativeElement.children[0].value = data.nama;
        }
      }
    });
  }

}