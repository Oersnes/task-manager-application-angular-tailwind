import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../models/Task';

@Pipe({
    name: 'taskStatus',
})
export class TaskStatusPipe implements PipeTransform {
    transform(value: string): string {
        if (value === TaskStatus.Todo) {
            return 'Todo';
        } else if (value === TaskStatus.InProgress) {
            return 'In Progress';
        } else if (value === TaskStatus.Completed) {
            return 'Completed';
        } else {
            return 'Unknwon';
        }
    }
}
