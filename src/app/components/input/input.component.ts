import { CommonModule } from '@angular/common';
import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

type sizeType = 'small' | 'medium' | 'large';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './input.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true,
        },
    ],
})
export class InputComponent implements ControlValueAccessor {
    label = input('');
    placeholder = input('');
    type = input<'text' | 'search'>('text');
    id = input('');
    class = input(''); // Accept custom class
    size = input<sizeType>('medium');
    rows = input<number>(1);

    sizeClasses: Record<string, string> = {
        small: 'px-2 py-1 text-sm',
        medium: 'px-3 py-2 text-base',
        large: 'px-4 py-3 text-lg',
    } as const;

    value: string = '';

    get generateClass() {
        return `${this.class} ${this.sizeClasses[this.size()]}`;
    }

    get generateLabelClass(): string[] {
        const sizeVariations: Record<string, string> = {
            small: 'text-xs',
            medium: 'text-sm',
            large: 'text-base',
        };
        return [`block font-base dark:text-gray-300 text-gray-700 mb-1`, sizeVariations[this.size()] || ''];
    }

    onChange = (_: any) => {};
    onTouched = () => {};

    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        // Optional: Add disabled logic
    }

    onInput(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.value = value;
        this.onChange(value);
    }
}
