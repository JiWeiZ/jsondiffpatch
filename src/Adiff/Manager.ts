import { Task, PrimitiveTask, TextTask } from "./Task";
import { Result } from "./Result";

export class Manager {
  results: Result[];
  constructor() {
    this.results = []
  }
  public hanlde(task: Task) {
    do {
      task.handle()
      const res = (task as PrimitiveTask | TextTask).result
      if (res) {
        this.results.push(res)
      }

      task = task.next
    } while (task)
  }
}
