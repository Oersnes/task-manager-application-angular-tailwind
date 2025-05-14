import { NgClass } from '@angular/common';
import { Component, computed, EventEmitter, input, Output } from '@angular/core';

const sizeClasses = {
    small: 'btn-sm',
    medium: 'btn-md',
    large: 'btn-lg',
};

@Component({
    selector: 'app-button',
    imports: [NgClass],
    templateUrl: './button.component.html',
    styleUrl: './button.component.css',
    host: {},
})
export class ButtonComponent {
    readonly type = input<'button' | 'submit'>('button');
    readonly variant = input<'ghost' | 'outlined' | 'contained' | 'cta'>('contained');
    readonly color = input<'default' | 'primary' | 'danger'>('default');
    readonly size = input<'small' | 'medium' | 'large'>('medium');
    readonly disabled = input<boolean>(false);
    readonly class = input('');

    derivedClasses = computed(() => {
        return [sizeClasses[this.size()] || '', this.class(), `btn-color-${this.color()}`, `btn-variant-${this.variant()}`];
    });

    @Output() onClick = new EventEmitter<void>();

    handleClick() {
        this.onClick.emit();
    }
}
