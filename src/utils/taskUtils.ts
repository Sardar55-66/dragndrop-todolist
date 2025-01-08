export type TaskType = "todo" | "in_progress" | "review" | "done";

export interface Task {
  type: TaskType | string;
  id: number;
  startDay: number | null;
  endDay: number | null;
  text: string;
}

export const validTaskTypes: TaskType[] = ['todo', 'in_progress', 'review', 'done'];

  // Группировка задач по типу
  export const groupTasksByType = (tasks: Task[]) => {
    return tasks.reduce((acc, task) => {
      // Приводим task.type к типу TaskType
      const taskType = task.type as TaskType;
  
      if (acc[taskType]) {
        acc[taskType].push(task);
      } else {
        acc[taskType] = [task];
      }
  
      return acc;
    }, { todo: [], in_progress: [], review: [], done: [] } as Record<TaskType, Task[]>);
  };
  
  

    export const isOverdue = (endDay: number | null): boolean => {
      if (!endDay) {
        return false;
      }
      const currentDate = new Date();
      const endDate = new Date(endDay);
      return endDate < currentDate;
    }
    