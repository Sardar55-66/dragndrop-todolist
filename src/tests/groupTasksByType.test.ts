import { groupTasksByType } from '../utils/taskUtils';

interface Task {
  id: number;
  type: 'todo' | 'in_progress' | 'review' | 'done';
  startDay: number | null;
  endDay: number | null;
  text: string;
}
describe("groupTasksByType", () => {
  
  it("should group tasks correctly by their type", () => {
    const tasks: Task[] = [
      { id: 1, type: "todo", startDay: null, endDay: null, text: "Task 1" },
      { id: 2, type: "in_progress", startDay: null, endDay: null, text: "Task 2" },
      { id: 3, type: "review", startDay: null, endDay: null, text: "Task 3" },
      { id: 4, type: "done", startDay: null, endDay: null, text: "Task 4" },
      { id: 5, type: "todo", startDay: null, endDay: null, text: "Task 5" },
      { id: 6, type: "done", startDay: null, endDay: null, text: "Task 6" }
    ];

    const groupedTasks = groupTasksByType(tasks);

    // Проверка, что задачи разделены по типам
    expect(groupedTasks.todo).toHaveLength(2);
    expect(groupedTasks.in_progress).toHaveLength(1);
    expect(groupedTasks.review).toHaveLength(1);
    expect(groupedTasks.done).toHaveLength(2);

    // Проверка, что задачи внутри групп соответствуют ожидаемым
    expect(groupedTasks.todo[0].text).toBe("Task 1");
    expect(groupedTasks.todo[1].text).toBe("Task 5");
    expect(groupedTasks.in_progress[0].text).toBe("Task 2");
    expect(groupedTasks.review[0].text).toBe("Task 3");
    expect(groupedTasks.done[0].text).toBe("Task 4");
    expect(groupedTasks.done[1].text).toBe("Task 6");
  });

  it("should return empty groups if no tasks are provided", () => {
    const tasks: Task[] = [];
    const groupedTasks = groupTasksByType(tasks);

    // Проверка, что все группы пусты
    expect(groupedTasks.todo).toHaveLength(0);
    expect(groupedTasks.in_progress).toHaveLength(0);
    expect(groupedTasks.review).toHaveLength(0);
    expect(groupedTasks.done).toHaveLength(0);
  });

  it("should handle tasks with missing or invalid types", () => {
    const tasks: Task[] = [
      { id: 1, type: "todo", startDay: null, endDay: null, text: "Task 1" },
      { id: 2, type: "unknown" as Task["type"], startDay: null, endDay: null, text: "Task 2" },
      { id: 3, type: "done", startDay: null, endDay: null, text: "Task 3" }
    ];

    const groupedTasks = groupTasksByType(tasks);

    // Проверка, что задача с неверным типом не привела к ошибке
    expect(groupedTasks.todo).toHaveLength(1);
    expect(groupedTasks.done).toHaveLength(1);

    // Проверка, что задача с неизвестным типом не добавляется в группы
    expect(Object.keys(groupedTasks)).not.toContain("unknown");
  });

  it("should handle tasks with null startDay and endDay", () => {
    const tasks: Task[] = [
      { id: 1, type: "todo", startDay: null, endDay: null, text: "Task 1" },
      { id: 2, type: "in_progress", startDay: null, endDay: null, text: "Task 2" }
    ];

    const groupedTasks = groupTasksByType(tasks);

    // Проверка, что задачи с null значениями startDay и endDay корректно группируются
    expect(groupedTasks.todo[0].startDay).toBeNull();
    expect(groupedTasks.in_progress[0].endDay).toBeNull();
  });
});

