import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, Observable, pipe, switchMap, tap } from 'rxjs';

import { Task, TaskId, TaskStatus, UpdatedTask } from '../models/Task';
import { ApiService } from '../services/api.service';

type TasksState = {
    tasks: Task[];
    isLoading: boolean;
    searchTerm: string;
    sortDirection: 'asc' | 'desc';
    initialized: boolean;
};

const initialState: TasksState = {
    tasks: [],
    isLoading: true,
    initialized: false,
    searchTerm: '',
    sortDirection: 'asc',
};

export const TasksStore = signalStore(
    { providedIn: 'root' }, // Avoid providers: [TasksStore] in each @Component. TasksStore is a single instance that can be shared by the entire app. Like a shoppingStore where we need to display the count inside the header
    withState(initialState),
    withComputed(({ tasks, sortDirection, searchTerm }) => ({
        sortedSwimLanes: computed(() => {
            const direction = sortDirection() === 'asc' ? 1 : -1;
            const clonedTasks = [...tasks()].sort((a, b) => direction * a.name.localeCompare(b.name)); // See https://angular.dev/errors/NG0100

            const swimlanes = {
                [TaskStatus.Todo]: <Task[]>[],
                [TaskStatus.InProgress]: <Task[]>[],
                [TaskStatus.Completed]: <Task[]>[],
            };

            clonedTasks.forEach((task) => {
                if (swimlanes[task.status]) {
                    swimlanes[task.status].push(task);
                }
            });

            return [
                {
                    status: TaskStatus.Todo,
                    tasks: swimlanes[TaskStatus.Todo],
                },
                {
                    status: TaskStatus.InProgress,
                    tasks: swimlanes[TaskStatus.InProgress],
                },
                {
                    status: TaskStatus.Completed,
                    tasks: swimlanes[TaskStatus.Completed],
                },
            ];
        }),
    })),
    withMethods((store, apiService = inject(ApiService)) => ({
        updateSearchTerm(searchTerm: string): void {
            patchState(store, (state) => ({ searchTerm: searchTerm }));
        },
        deleteTask(taskId: TaskId): Observable<any> {
            return apiService.deleteTask(taskId).pipe(
                tapResponse({
                    next: () => {
                        patchState(store, { tasks: store.tasks().filter((task) => task.id !== taskId) });
                    },
                    error: console.error, // TODO: Handle error
                })
            );
        },
        createTask(task: { name: string; description: string }): Observable<any> {
            return apiService.createTask(task).pipe(
                tapResponse({
                    next: (response) => {
                        patchState(store, { tasks: [...store.tasks(), response] });
                    },
                    error: console.error, // TODO: Handle error
                })
            );
        },
        updateTask(taskId: TaskId, task: UpdatedTask): Observable<any> {
            return apiService.updateTask(taskId, task).pipe(
                tapResponse({
                    next: (response) => {
                        const currentTasks = store.tasks();
                        const indexOfCurrentTask = currentTasks.findIndex((task) => task.id === taskId);
                        if (indexOfCurrentTask > -1) {
                            currentTasks[indexOfCurrentTask] = response;
                        }
                        patchState(store, { tasks: [...currentTasks] });
                    },
                    error: console.error,
                })
            );
        },
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
