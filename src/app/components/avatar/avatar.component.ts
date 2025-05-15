import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-avatar',
    imports: [MatIcon],
    templateUrl: './avatar.component.html',
    styleUrl: './avatar.component.css',
})
export class AvatarComponent {
    color = input<'amber' | 'stone' | 'emerald' | 'sky'>('amber');
    size = input<'medium'>('medium');
    icon = input.required<string>();
}
