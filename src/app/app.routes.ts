import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TasksComponent } from './components/tasks/tasks.component';

export const routes: Routes = [
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },
    { path: 'tasks', component: TasksComponent },
    { path: '', redirectTo: '/tasks', pathMatch: 'full' }, // Redirect to tasks if no path is specified
    { path: '**', component: PageNotFoundComponent }, // Wildcard route for a 404 page
];
