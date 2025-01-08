import { groupTasksByType } from '../utils/taskUtils';

interface Task {
  id: number;
  type: 'todo' | 'in_progress' | 'review' | 'done';
  startDay: number | null;
  endDay: number | null;
  text: string;
}

describe('groupTasksByType', () => {
  it('groups tasks by their type', () => {
    const tasks: Task[] = [
      { id: 1, type: 'todo', startDay: null, endDay: null, text: 'Task 1' },
      { id: 2, type: 'in_progress', startDay: null, endDay: null, text: 'Task 2' },
      { id: 3, type: 'review', startDay: null, endDay: null, text: 'Task 3' },
      { id: 4, type: 'done', startDay: null, endDay: null, text: 'Task 4' },
      { id: 5, type: 'todo', startDay: null, endDay: null, text: 'Task 5' },
    ];

    const groupedTasks = groupTasksByType(tasks);

    expect(groupedTasks.todo[0].text).toBe('Task 1');
    expect(groupedTasks.todo[1].text).toBe('Task 5');
    expect(groupedTasks.in_progress[0].text).toBe('Task 2');
    expect(groupedTasks.review[0].text).toBe('Task 3');
    expect(groupedTasks.done[0].text).toBe('Task 4');
  });
});
