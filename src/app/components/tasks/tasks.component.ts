import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskStatus } from '../../models/Task';
import { FromNowPipe } from '../../pipes/from-now.pipe';
import { TaskStatusPipe } from '../../pipes/task-status.pipe';
import { TasksStore } from '../../stores/tasks.store';
import { ButtonComponent } from '../button/button.component';
import { TaskStatusBadgeComponent } from '../task-status-badge/task-status-badge.component';

function createRandomString(length: number) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

@Component({
    selector: 'app-tasks',
    imports: [
        RouterLink,
        MatIcon,
        NgClass,
        ButtonComponent,
        MatProgressSpinnerModule,
        TaskStatusBadgeComponent,
        MatTooltip,
        CommonModule,
        FromNowPipe,
        TaskStatusPipe,
    ],
    templateUrl: './tasks.component.html',
    styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
    readonly store = inject(TasksStore);
    readonly TaskStatus = TaskStatus;
    // selectedTab = signal<string | null>(null);
    // selectedStatus = signal<TaskStatus | undefined>(undefined);
    constructor(private route: ActivatedRoute, private router: Router) {}

    createTask() {
        // this.store.updateSearchTerm(createRandomString(1));
        // this.store.updateSortDirection(this.store.sortDirection() === 'desc' ? 'asc' : 'desc');
        //  this.store.updateSearchTerm('Z');
        this.store.createTask({ name: createRandomString(10), description: Date.now().toString() });
    }

    ngOnInit() {
        // this.productId = this.route.snapshot.paramMap.get('tabId')!;

        const searchTerm = this.store.searchTerm;

        this.store.loadBySearchTerm(searchTerm);
        //this.store.loadTasks();
        /* this.route.paramMap.subscribe((params) => {
            console.log(params.get('tabId'));
            this.selectedTab.set(params.get('tabId'));
        }); */

        this.route.queryParams.subscribe((params) => {
            // console.log('status', params['status']);
            this.store.updateSelectedStatus(params['status']);
            // this.selectedStatus.set(params['status']);

            // this.page = params['page'];
            // this.sort = params['sort'];
        });

        // this.router.navigate(['/tasks/inProgress'], { queryParamsHandling: 'merge', queryParams: { page: 1, sort: 'asc' } });
        // this.router.navigate([], {...oldParams, qp: 11})
        // this.router.navigate([], { queryParamsHandling: 'merge', queryParams: { page: 1, sort: null, meh: 'meh' } });

        // console.log('Product ID:', this.productId);
    }
}
