import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Task, TaskStatus } from '../../models/Task';
import { FromNowPipe } from '../../pipes/from-now.pipe';
import { TaskStatusPipe } from '../../pipes/task-status.pipe';
import { TasksStore } from '../../stores/tasks.store';
import { AvatarComponent } from '../avatar/avatar.component';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input.component';

const confirmedIdentifier = 'confirmed';
const snackBarConfigSuccess: MatSnackBarConfig = {
    horizontalPosition: 'center',
    verticalPosition: 'top',
    duration: 3000,
};
const snackBarConfigError: MatSnackBarConfig = {
    horizontalPosition: 'center',
    verticalPosition: 'top',
};

@Component({
    selector: 'app-tasks',
    imports: [
        MatIcon,
        ButtonComponent,
        MatProgressSpinnerModule,
        MatTooltip,
        CommonModule,
        FromNowPipe,
        TaskStatusPipe,
        InputComponent,
        ReactiveFormsModule,
        AvatarComponent,
    ],
    templateUrl: './tasks.component.html',
    styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
    readonly store = inject(TasksStore);
    readonly TaskStatus = TaskStatus;
    readonly dialog = inject(MatDialog);
    private _snackBar = inject(MatSnackBar);

    constructor(private route: ActivatedRoute, private router: Router) {}

    onSearch(event: Event) {
        const value = (event.target as HTMLInputElement).value;
    }

    onSearchTermChange() {
        this.store.updateSearchTerm(this.form.value.searchTerm as string);
    }

    form = new FormGroup({
        searchTerm: new FormControl('', [Validators.required]),
    });

    openCreateTaskDialog() {
        const dialogRef = this.dialog.open(CreateTaskDialog, { disableClose: true });
    }

    editTask(task: Task) {
        const dialogRef = this.dialog.open(EditTaskDialog, { disableClose: true, data: task });
    }

    deleteTask(task: Task) {
        const dialogRef = this.dialog.open(ConfirmDialog, { disableClose: true });
        dialogRef.afterClosed().subscribe((result) => {
            if (result === confirmedIdentifier) {
                this.store.deleteTask(task.id).subscribe({
                    next: () => {
                        this._snackBar.open('Task deleted', 'Close', snackBarConfigSuccess);
                        // Store will do the cleanup.
                    },
                    error: (error) => {
                        this._snackBar.open('Task could not be deleted. Please try again', 'Close', snackBarConfigError);
                    },
                });
            }
        });
    }

    changeTaskStatus(task: Task, newTaskStatus: TaskStatus) {
        this.store.updateTask(task.id, { status: newTaskStatus }).subscribe({
            next: () => {
                this._snackBar.open('Task status updated', 'Close', snackBarConfigSuccess);
            },
            error: () => {
                this._snackBar.open('Task status could not be updated', 'Close', snackBarConfigError);
            },
        });
    }

    ngOnInit() {
        const searchTerm = this.store.searchTerm;
        this.store.loadBySearchTerm(searchTerm);
        /* this.route.queryParams.subscribe((params) => {
            this.store.updateSelectedStatus(params['status']);
        }); */
        //this.store.loadTasks();
        /* this.route.paramMap.subscribe((params) => {
            console.log(params.get('tabId'));
            this.selectedTab.set(params.get('tabId'));
        }); */
        // this.router.navigate(['/tasks/inProgress'], { queryParamsHandling: 'merge', queryParams: { page: 1, sort: 'asc' } });
        // this.router.navigate([], { queryParamsHandling: 'merge', queryParams: { page: 1, sort: null } });
    }
}

@Component({
    selector: 'create-task-dialog',
    templateUrl: 'create-task-dialog.html',
    imports: [MatDialogModule, ReactiveFormsModule, ButtonComponent, InputComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTaskDialog {
    readonly store = inject(TasksStore);
    readonly dialogRef = inject(MatDialogRef<CreateTaskDialog>);
    private _snackBar = inject(MatSnackBar);

    createAnother = signal(false);

    form = new FormGroup({
        name: new FormControl<string>('', [Validators.required, Validators.maxLength(80)]),
        description: new FormControl('', [Validators.maxLength(120)]),
    });

    constructor(private el: ElementRef) {}

    toggleCheckbox() {
        this.createAnother.set(!this.createAnother());
    }

    onCancel(): void {
        this.dialogRef.close('cancelled');
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.store.createTask({ name: this.form.value.name as string, description: this.form.value.description as string }).subscribe({
                next: () => {
                    if (this.createAnother()) {
                        this.form.reset();
                        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="name"] input');
                        invalidControl.focus();
                    } else {
                        this.dialogRef.close(confirmedIdentifier);
                    }
                    this._snackBar.open('Task created', 'Close', snackBarConfigSuccess);
                },
                error: () => {
                    this._snackBar.open('Task could not be created', 'Close', snackBarConfigError);
                },
            });
        } else {
            console.log('Form is invalid');
        }
    }
}

@Component({
    templateUrl: 'edit-task-dialog.html',
    imports: [MatDialogModule, ReactiveFormsModule, ButtonComponent, InputComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTaskDialog {
    readonly store = inject(TasksStore);
    readonly dialogRef = inject(MatDialogRef<EditTaskDialog>);
    readonly originalTaskData = inject<Task>(MAT_DIALOG_DATA);
    private _snackBar = inject(MatSnackBar);

    form = new FormGroup({
        name: new FormControl<string>(this.originalTaskData.name, [Validators.required, Validators.maxLength(80)]),
        description: new FormControl(this.originalTaskData.description || '', [Validators.maxLength(120)]),
    });

    onCancel(): void {
        this.dialogRef.close('cancelled');
    }

    onSubmit() {
        if (this.form.valid) {
            this.store
                .updateTask(this.originalTaskData.id, { name: this.form.value.name as string, description: this.form.value.description as string })
                .subscribe({
                    next: () => {
                        this.dialogRef.close(confirmedIdentifier);
                        this._snackBar.open('Task updated', 'Close', snackBarConfigSuccess);
                    },
                    error: () => {
                        this._snackBar.open('Task could not be updated', 'Close', snackBarConfigError);
                    },
                });
        } else {
            // Form is invalid and user was notified inside the dialog.
        }
    }
}

@Component({
    templateUrl: 'confirm-dialog.html',
    imports: [MatDialogModule, ReactiveFormsModule, ButtonComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
    readonly dialogRef = inject(MatDialogRef<ConfirmDialog>);

    onCancel(): void {
        this.dialogRef.close('cancelled');
    }

    onConfirm(): void {
        this.dialogRef.close(confirmedIdentifier);
    }
}
