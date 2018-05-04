import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  containerClasses: Array<string> = ['input-container'];
  isDirty = false;
  isRequired = false;
  errorMsg = '';


  // @Inputs (Label, Id?, Name?, Value, Validations)
  @Input()
  label: string;
  @Input()
  id?: string;
  @Input()
  model: string;
  @Input()
  name?: string;
  @Input()
  type?: string;
  @Input()
  comparisonVal?: string;
  @Input()
  validations: Array<{type: string, msg?: string, length?: number, regExp?: RegExp}> = [];
  @Input()
  disabled: boolean = false;
  @Output()
  modelChange = new EventEmitter();

  ngOnInit() {
    if (this.model) {
      this.addClass('input-container--set');
    } else {
      this.removeClass('input-container--set');
    }

    if (!this.id) {
      this.id = `input_${this.label.substr(0, 5)}`;
    }

    if (!this.name) {
      this.name = this.id;
    }

    if (!this.type) {
      this.type = 'text';
    }

    this.isRequired = this.validations.some((validation) => {
      return validation.type === 'required';
    });
  }

  getContainerClasses() {
    return this.containerClasses.join(' ');
  }

  focus() {
    this.addClass('input-container--focused');
  }

  blur() {
    this.isDirty = true;
    this.removeClass('input-container--focused');
    this.validate();
  }

  change(val) {
    this.isDirty = true;
    this.model = val;
    this.modelChange.emit(val);
    if (this.model) {
      this.addClass('input-container--set');
    } else {
      this.removeClass('input-container--set');
    }

    this.validate();
  }

  addClass(className: string) {
    if (this.containerClasses.indexOf(className) === -1) {
      this.containerClasses.push(className);
    }
  }

  removeClass(className: string) {
    const classIndex = this.containerClasses.indexOf(className);

    if (classIndex === -1) {
      return;
    }

    this.containerClasses.splice(classIndex, 1);
  }

  validate(doNotShowError?: boolean): boolean {
    this.errorMsg = '';

    for (const validation of this.validations) {
      switch (validation.type) {
        case 'required':
          if (!this.model) {
            if (validation.msg) {
              this.errorMsg = validation.msg;
            } else {
              this.errorMsg = this.label + ' is a required field';
            }
          }
          break;
        case 'comparison':
          // tslint:disable-next-line:no-empty
          if (this.comparisonVal === this.model) {

          } else {
            this.errorMsg = validation.msg;
          }
          break;
        case 'comparisonCaseIgnore':
          // tslint:disable-next-line:no-empty
          if (this.comparisonVal && this.comparisonVal.toUpperCase() === this.model.toUpperCase()) {

          } else {
            this.errorMsg = validation.msg;
          }
          break;
        case 'emailValidity':
          const re = /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-\+]+)*@\b[A-Za-z0-9-]+(\.\b[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/i;
          const resultBool = re.test(this.model);
          if (!resultBool) {
            this.errorMsg = validation.msg;
          }
          // if invalid set errorMsg to the validation.msg
          break;
        case 'usernameValidity':
          const re1 = /^[$&+:;=?@#|’<>.^*()%!\w-]{8,52}$/;
          const isSpecialCharORAlphaNumeric = re1.test(this.model);
          const isNotAllDigit = /\D/.test(this.model ) ;
          if (!isNotAllDigit || !isSpecialCharORAlphaNumeric) {
            this.errorMsg = validation.msg;
          }
          break;
        case 'passwordValidity':
          // At least one letter: (?=.*[A-Za-z]), at least one digit (?=.*[0-9])
          // at least one special char (?=.*[$@$!%*#?&+-^=(){}<>:;|]), and 6 to 16 long
          // no starting or trailing spaces [\S]
          const pswordRegEx =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@!%*#?&+-\/'^=(){}<>:;|\\ ]).{5,15}[\S]$/;
          const noTrailingSpace_AND_AlphaNumSpecialChar = pswordRegEx.test(this.model);
          const startWithNonSpace = /^[\S].*$/.test(this.model);
          if (!noTrailingSpace_AND_AlphaNumSpecialChar || !startWithNonSpace) {
            this.errorMsg = validation.msg;
          }
          break;
        case 'length':
          const maxLength = (validation.length) ? validation.length : 1;
          if (this.model.length > maxLength) {
            this.errorMsg = validation.msg;
          }
          break;
        case 'regExp':
          if (!validation.regExp.test(this.model)) {
            this.errorMsg = validation.msg;
          }
          break;
        default:
          this.errorMsg = '';
          break;
      }

      if (this.errorMsg) {
        if (!doNotShowError) {
          this.addClass('input-container--invalid');
        }
        return false;
      } else {
        if (!doNotShowError) {
          this.removeClass('input-container--invalid');
        }
      }
    }

    return true;
  }
}
