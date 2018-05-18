import { Component } from '@angular/core';
import { TelcoDemoService }  from '../telcodemo.service';
import { Sentence } from "../../conversation/Sentence";

@Component({
  selector: 'app-telcochat',
  templateUrl: './telcochat.component.html',
  styleUrls: ['./telcochat.component.css']
})
export class TelcoChatComponent  {
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
  constructor(private telcoService : TelcoDemoService){
    // Uncomment this line if you do not have a conversation_start trigger in a node of your dialog
    this.callConversationBFF("Hello");
  }

  callConversationBFF(msg:string) {
    this.telcoService.submitMessage(msg,this.context).subscribe(
      data => {
        this.context=data.context;
        let s:Sentence = new Sentence();
        s.direction="from-watson";
        s.text=data.output.text[0];
        this.currentDialog.push(s)
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

  keyMessage(event){
     if(event.keyCode == 13) {
        this.submit();
      }
  }

}
