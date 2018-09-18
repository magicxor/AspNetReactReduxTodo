const ENDPOINT = '/api/Tasks';

class TasksService {
    async getTasksAsync() {
        const url = `${ENDPOINT}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`TasksService.getTasksAsync failed, HTTP status ${response.status}`);
        }
        const data = await response.json();
        return data;
    }

    async addTaskAsync(taskDescription) {
        const url = `${ENDPOINT}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description: taskDescription })
        });
        if (!response.ok) {
            throw new Error(`TasksService.addTaskAsync failed, HTTP status ${response.status}`);
        }
        const data = await response.json();
        return data;
    }

    async deleteTaskAsync(taskId) {
        const url = `${ENDPOINT}/${taskId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok && !(response.status === 404)) {
            throw new Error(`TasksService.deleteTaskAsync failed, HTTP status ${response.status}`);
        }
    }
}

export const tasksService = new TasksService();