import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConversationComponent } from './conversation.component';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule,
         MatDialogModule,
         MatTabsModule,
         MatIconModule,
         MatProgressSpinnerModule,
         MatCardModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatDialogModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    HttpClientModule
  ],
  declarations: [ConversationComponent],
  exports: [ConversationComponent]
})
export class ConversationModule { }
