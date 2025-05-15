import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';

import { Task, TaskId, TaskStatus, UpdatedTask } from '../models/Task';
import { ApiService } from '../services/api.service';

type TasksState = {
    tasks: Task[];
    isLoading: boolean;
    searchTerm: string;
    sortDirection: 'asc' | 'desc';
    initialized: boolean;
    selectedStatus: TaskStatus | null;
};

const initialState: TasksState = {
    tasks: [],
    isLoading: true,
    initialized: false,
    searchTerm: '',
    sortDirection: 'asc',
    selectedStatus: TaskStatus.Completed,
};

export const TasksStore = signalStore(
    { providedIn: 'root' }, // Avoid providers: [TasksStore] in each @Component. TasksStore is a single instance that can be shared by the entire app. Like a shoppingStore where we need to display the count inside the header
    withState(initialState),
    withComputed(({ tasks, sortDirection, searchTerm, selectedStatus }) => ({
        sortedAndFilteredTasks: computed(() => {
            const direction = sortDirection() === 'asc' ? 1 : -1;
            const clonedTasks = [...tasks()]; // See https://angular.dev/errors/NG0100

            return clonedTasks
                .filter((task) => {
                    if (selectedStatus() === null) {
                        return task.name.toLocaleLowerCase().includes(searchTerm().toLocaleLowerCase());
                    }
                    return selectedStatus() === task.status && task.name.toLocaleLowerCase().includes(searchTerm().toLocaleLowerCase());
                })
                .sort((a, b) => direction * a.name.localeCompare(b.name));
        }),
    })),
    withMethods((store, apiService = inject(ApiService)) => ({
        updateSearchTerm(searchTerm: string): void {
            patchState(store, (state) => ({ searchTerm: searchTerm }));
        },
        updateSelectedStatus(status: TaskStatus): void {
            patchState(store, (state) => ({ selectedStatus: status || null }));
        },
        updateSortDirection(sortDirection: 'asc' | 'desc'): void {
            patchState(store, (state) => ({ sortDirection: sortDirection }));
        },
        toggleIsLoading(): void {
            patchState(store, (state) => ({ isLoading: !state.isLoading }));
        },
        deleteTask(taskId: TaskId) {
            apiService.deleteTask(taskId).subscribe({
                next: () => {
                    patchState(store, { tasks: store.tasks().filter((task) => task.id !== taskId) });
                },
                error: () => {
                    //
                },
            });
        },
        createTask(task: { name: string; description: string }) {
            apiService.createTask(task).subscribe({
                next: (response) => {
                    patchState(store, { tasks: [...store.tasks(), response] });
                },
                error: () => {
                    //
                },
            });
        },
        updateTask(taskId: TaskId, task: UpdatedTask) {
            apiService.updateTask(taskId, task).subscribe({
                next: (response) => {
                    const currentTasks = store.tasks();
                    const indexOfCurrentTask = currentTasks.findIndex((task) => task.id === taskId);
                    if (indexOfCurrentTask > -1) {
                        currentTasks[indexOfCurrentTask] = response;
                    }
                    patchState(store, { tasks: [...currentTasks] });
                },
                error: () => {
                    //
                },
            });
        },
        /* loadTasks(): void {
            patchState(store, { isLoading: true });
            apiService.getTasksByName(store.searchTerm()).subscribe({
                next: (response) => {
                    patchState(store, {
                        isLoading: false,
                        tasks: response,
                    });
                },
                error: (error) => {
                    console.log(error);
                },
            });
        }, */
        loadBySearchTerm: rxMethod<string>(
            pipe(
                debounceTime(300),
                distinctUntilChanged(),
                tap(() => patchState(store, { isLoading: true })),
                switchMap((searchTerm: string) => {
                    return apiService.getTasksByName(searchTerm).pipe(
                        tapResponse({
                            next: (tasks) => patchState(store, { tasks }),
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
    }))
);
