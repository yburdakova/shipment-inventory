import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-custom-input',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() label!: string;
  @Input() type: 'text' | 'password' = 'text';
  @Input() required: boolean = false;

  value: string = '';
  isFocused: boolean = false;
  showPassword: boolean = false;

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  onChange = (value: any) => {};
  onTouched = () => {};

  get inputType(): string {
    return this.showPassword && this.type === 'password' ? 'text' : this.type;
  }

  handleFocus() {
    this.isFocused = true;
  }

  handleBlur() {
    this.isFocused = false;
    this.onTouched();
  }

  handleInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.value = inputValue;
    this.onChange(inputValue);
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
