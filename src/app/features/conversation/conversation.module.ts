import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConversationComponent } from './conversation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ConversationComponent],
  exports: [ConversationComponent]
})
export class ConversationModule { }
