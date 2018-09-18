/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ConversationService }  from './conversation.service';
import { LoginService } from '../login/login.service';
import { Sentence } from "./Sentence";

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent  {
  // keep all the exchanged sentences
  currentDialog: Sentence[]=[];
  context: any = {"type":"base"}; // used to keep the Conversation context
  message: string;
  // variable used for the input field in html page to get user query
  queryString: string =""

  /**
  When creating a conversation component, it is better to call Watson to get a greetings message
  as defined in the Dialog flow. This is more user friendly.
  */
  constructor(private convService : ConversationService,
              private loginService: LoginService){
    this.context.user = loginService.getCurrentUser();
    // Uncomment this line if you do not have a conversation_start trigger in a node of your dialog
    this.callConversationBFF("Hello");
  }

  // Support scrolling at the bottom of the window.
 @ViewChild('scrollMe') private myScrollContainer: ElementRef;

 ngOnInit() {
     this.scrollToBottom();
 }

 ngAfterViewChecked() {
     this.scrollToBottom();
 }

 scrollToBottom(): void {
     try {
         this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
     } catch(err) { }
 }

  callConversationBFF(msg:string) {
    this.convService.submitMessage(msg,this.context).subscribe(
      data => {
        this.context=data.context;
        let s:Sentence = new Sentence();
        s.direction="from-watson";
        s.text="";
        for (var t of data.output.text) {
            s.text+=t+"<br/>";
        }
        // manage options - as clickable buttons
        s.options=data.context.predefinedResponses;
        this.currentDialog.push(s);
        // authorize the UI to see all the sentences from WCS even when there is not use input expected,
        // like for example waiting for the best recommendation computed by ODM
        if (data.context.action === "search" || data.context.action === "recommend"){
          this.callConversationBFF("");
        }
      },
      error => {
        return "Error occurs in conversation processing"
        }
    )
  }

  submit(){
    let obj:Sentence = new Sentence();
    obj.direction="to-watson";
    obj.text=this.queryString;
    this.currentDialog.push(obj);
    this.callConversationBFF(this.queryString);
    this.queryString="";
  }

  advisorResponse(resp) {
    let obj:Sentence = new Sentence();
    obj.direction="to-watson";
    this.queryString=resp;
    obj.text=resp;
    this.currentDialog.push(obj);
    this.callConversationBFF(resp);
  }

  keyMessage(event){
     if(event.keyCode == 13) {
        this.submit();
      }
  }

} // Conversation Component
