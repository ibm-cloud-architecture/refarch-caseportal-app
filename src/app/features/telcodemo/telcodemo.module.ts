import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule,
         MatDialogModule,
         MatTabsModule,
         MatIconModule,
         MatSelectModule,
         MatFormFieldModule,
         MatProgressSpinnerModule,
         MatCardModule } from '@angular/material';
import { TelcoHomeComponent } from './telcohome.component';
import { TelcoChatComponent } from './telcochat/telcochat.component';
import { AccountComponent } from './account/account.component';
import { SharedModule } from '../../shared/shared.module';
import { CustomersComponent}     from './customer/customers.component';
import { CustomersService }      from './customer/customers.service';
import { CustomerDetailComponent}    from './customer/customer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatToolbarModule,
    MatDialogModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  declarations: [TelcoHomeComponent,
    TelcoChatComponent,
    AccountComponent,
    CustomersComponent,
    CustomerDetailComponent],
  providers: [CustomersService],
  exports: [TelcoHomeComponent, TelcoChatComponent, AccountComponent, CustomersComponent, CustomerDetailComponent]
})
export class TelcoDemoModule { }
