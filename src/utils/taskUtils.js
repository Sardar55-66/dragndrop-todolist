export const validTaskTypes = ['todo', 'in_progress', 'review', 'done'];
// Группировка задач по типу
export const groupTasksByType = (tasks) => {
    return tasks.reduce((acc, task) => {
        // Приводим task.type к типу TaskType
        const taskType = task.type;
        if (acc[taskType]) {
            acc[taskType].push(task);
        }
        else {
            acc[taskType] = [task];
        }
        return acc;
    }, { todo: [], in_progress: [], review: [], done: [] });
};
export const isOverdue = (endDay) => {
    if (!endDay) {
        return false;
    }
    const currentDate = new Date();
    const endDate = new Date(endDay);
    return endDate < currentDate;
};
