import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TaskStatus } from '../../models/Task';
import { TaskStatusPipe } from '../../pipes/task-status.pipe';

@Component({
    selector: 'app-task-status-badge',
    imports: [MatIcon, NgClass, TaskStatusPipe],
    templateUrl: './task-status-badge.component.html',
    styleUrl: './task-status-badge.component.css',
})
export class TaskStatusBadgeComponent {
    readonly status = input('Unknown');
    readonly TaskStatus = TaskStatus;

    derivedState = computed(() => {
        if (this.status() === TaskStatus.Todo) {
            return {
                classes: 'text-stone-900 bg-stone-200',
                icon: 'rocket',
            };
        } else if (this.status() === TaskStatus.InProgress) {
            return {
                classes: 'text-amber-900 bg-amber-200',
                icon: 'rocket_launch',
            };
        } else if (this.status() === TaskStatus.Completed) {
            return {
                classes: 'text-emerald-900 bg-emerald-200',
                icon: 'task_alt',
            };
        }
        return {
            classes: 'text-rose-900 bg-rose-200',
            icon: 'light',
        };
    });
}
