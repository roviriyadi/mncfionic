import { Component, Input } from '@angular/core';

@Component({
  selector: 'chat-bubble',
  templateUrl: 'chatbubble.html'
})
export class ChatBubble {
    
  @Input('message') msg: any;

  constructor() {
  }

}