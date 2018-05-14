import { Directive, ElementRef, Renderer, Input } from '@angular/core';

@Directive({
  selector: '[hide-header]',
  host:{
      '(ionScroll)':'onContentScroll($event)'
  }
})
export class HideHeaderDirective {

    @Input("header") header : HTMLElement;
    scrollContent: any;
    headerHeight: any;

    constructor(public element: ElementRef, public renderer: Renderer) {
    }

    ngOnInit(){
        this.headerHeight = this.header.clientHeight;
        this.renderer.setElementStyle(this.header, 'webkitTransition', 'top 700ms');
        this.scrollContent = this.element.nativeElement.getElementsByClassName('scroll-content')[0];
        this.renderer.setElementStyle(this.scrollContent, 'webkitTransition', 'margin-top 700ms');
    }

    onContentScroll(event){
        if(event.scrollTop > 56){
            this.renderer.setElementStyle(this.header, 'top', '-56px');
            this.renderer.setElementStyle(this.scrollContent, 'margin-top', '0px');
        } else {
            this.renderer.setElementStyle(this.header, 'top', '0px');
            this.renderer.setElementStyle(this.scrollContent, 'margin-top', '56px');
        }
    }

}  
