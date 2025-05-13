import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewTask, TaskId, UpdatedTask } from '../models/Task';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private baseUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) {}

    // Get all tasks
    getTasks(): Observable<any> {
        return this.http.get(`${this.baseUrl}/tasks`);
    }
    // Create a task
    createTask(task: NewTask): Observable<any> {
        return this.http.post(`${this.baseUrl}/tasks`, task);
    }
    // Update a task
    updateTask(id: TaskId, task: UpdatedTask): Observable<any> {
        return this.http.put(`${this.baseUrl}/tasks/${id}`, task);
    }
    // Delete a task
    deleteTask(id: TaskId): Observable<any> {
        return this.http.delete(`${this.baseUrl}/tasks/${id}`);
    }
}
