import { Task, PrimitiveTask, TextTask, ObjectTask } from "./Task";
import { Result } from "./Result";

let managerOptions

export class Manager {
  results: Result[];
  options: any;
  constructor(options) {
    this.results = []
    managerOptions = options
  }

  public diff(left, right) {
    const task = new ObjectTask({
      left,
      right,
      type: "data"
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

export {
  managerOptions
}
