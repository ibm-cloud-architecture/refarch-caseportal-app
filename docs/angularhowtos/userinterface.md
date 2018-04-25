# User interface tricks
In this chapter we are covering some Angular 5 tricks and practices we have to follow to do the user interface of our project. We try to regroup the different approaches presented by different blogger and Angular Experts. This is not a deep dive into Angular internal components, but more an intermediate level for UI application developers.

## Error: model not found on input element
* The error message looks like
	Can't bind to 'ngModel' since it isn't a known property of 'input'. ("ss="input-container__input" (focus)="focus()" (blur)="blur()" (ngModelChange)="change(input.value)" [ERROR ->][ngModel]="model" />
 The solution is to import FormModule in the module that uses input element. 

## Code explanation

## Defining Modal
To support popup modal we are using the library [ng2-bs3-modal](https://github.com/dougludlow/ng2-bs3-modal), so add the following line in the dependencies in package.json
`    "ng2-bs3-modal": "^0.10.4",` and do a `npm install`.

As `ng2-bs3-modal` depends on `bootstrap` which depends on `jquery`, you'll need to include both scripts before `ng2-bs3-modal` into the *index.html* file
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.js"></script>
<script src="node_modules/ng2-bs3-modal/bundles/ng2-bs3-modal.js"></script>
```
Then include the module in the imports collection of your app's module *app.module.ts*:

```javascript
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
..
imports: [
  BrowserModule,
  Ng2Bs3ModalModule,
```

To define a modal you need to declare it in HTML (e.g inventory.html). The modal is referenced by a name (*#itemDialog*).
```html
<modal #itemDialog>
    <form #modalForm="ngForm" *ngIf="newItem">
      ..
    </form>
</modal>
```

Then in the component/controller modify the import ti add the component
```javascript
import {Component,ViewChild} from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

  @ViewChild('itemDialog') modal: ModalComponent;
```

The method attach to the + button is add() as you can see in the inventory.html file:
```html
<button class="btn btnbg glyphicon glyphicon-plus" type="button" (click)="add()"></button>
```

The method create a new item to get the data, and open the modal:
```javascript
add() : void {
  this.newItem = new Item();
  this.modal.open();
}
```

The form within the modal can include a header, body and footer. The body will have the form data as for example:
```html
<modal-body>
    <div class="form-group">
        <label for="name">Name</label>
        <input autofocus type="text" class="form-control" required [(ngModel)]="newItem.name" name="name" id="name">
    </div>
```

while the footer exposes the control buttons with the predefined call back `dismiss()` to close the modal and a new method to persist the new item:
```html
<modal-footer>
    <button type="button" class="btn btn-default" data-dismiss="modal" (click)="newItem.dismiss()">Cancel</button>
    <button type="button" class="btn btn-primary" [disabled]="!modalForm.valid" (click)="submitNewItem(newItem)">Submit<i *ngIf="loading" class="fa fa-refresh fa-spin"></i></button>
    <p *ngIf="submitError"><br>{{submitError}}</p>
</modal-footer>
```

The submit new item method delegates to the service and maintain the cached list of items, inside the web browser:
```javascript
submitNewItem(newItem) : void {
  this.invService.saveItem(newItem).subscribe(
      data => {
        this.modal.close();
        this.loading = false;
        this.items.push(newItem);
        //this.getItems();
      },
      error => {
        var errorMessage = JSON.parse(error._body).error;
        this.loading = false;
        this.submitError = errorMessage;
      }
    );
}
```
