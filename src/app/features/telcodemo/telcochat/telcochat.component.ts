import { Component, ElementRef, ViewChild, OnInit,AfterViewChecked } from '@angular/core';
import { TelcoDemoService }  from '../telcodemo.service';
import { FormControl } from '@angular/forms';
import { Sentence } from "../../conversation/Sentence";
import { ChatResponse } from './chatresponse';

@Component({
  selector: 'app-telcochat',
  templateUrl: './telcochat.component.html',
  styleUrls: ['./telcochat.component.css']
})
export class TelcoChatComponent implements OnInit {
  // keep all the exchanged sentences
  currentDialog: Sentence[]=[];
  context: any = {"type":"base"}; // used to keep the Conversation context
  message: string;
  // variable used for the input field in html page to get user query
  queryString: string =""
  profiles = [  {value: 'young', viewValue: 'Student'},
                 {value: 'retiree', viewValue: 'Retiree'},
                 {value: 'adult', viewValue: 'Standard'},
                 {value: 'noFiber', viewValue: 'NoFiber'}
              ];
  selectedProfile:string = 'adult';


  /**
  When creating a conversation component, it is better to call Watson to get a greetings message
  as defined in the Dialog flow. This is more user friendly.
  */
  constructor(private telcoService : TelcoDemoService){
    // Uncomment this line if you do not have a conversation_start trigger in a node of your dialog
    this.callConversationBFF("Hello");
  }

  // Suppot scrolling at the bottom of the window.
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
      console.log('Conversation Called with '+ msg);
      this.context.user=this.selectedProfile;
      this.telcoService.submitMessage(msg,this.context).subscribe(
      data => {
        this.context=data.context;
        let s:Sentence = new Sentence();
        s.direction="from-watson";
        s.text=data.output.text[0];
        this.currentDialog.push(s)

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
    this.scrollToBottom();
  }

  keyMessage(event){
     if(event.keyCode == 13) {
        this.submit();
      }
  }

  debugFunc(){
    debugger;
  }

}
