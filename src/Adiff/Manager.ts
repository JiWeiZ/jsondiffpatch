import { Task, PrimitiveTask, TextTask, ObjectTask } from "./Task";
import { Result } from "./Result";

export class Manager {
  results: Result[];
  constructor() {
    this.results = []
  }

  public diff(left, right) {
    const task = new ObjectTask({
      left,
      right,
      type: "data",
      omitKeys: ["type", "id", "readonly"]
    })
    this.hanlde(task)
    return this.results
  }

  private hanlde(task: Task) {
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
