import { Task, PrimitiveTask, TextTask } from "./Task";
import { Worker } from "./Worker";
import { taskAssignor } from './util/taskAssignor'
import { Result } from "./Result";

export class Manager {
  results: Result[];
  constructor() {
    this.results = []
  }
  public hanlde(task: Task) {
    let worker: Worker
    do {
      worker = taskAssignor(task)
      worker.handle(task)

      const res = (task as PrimitiveTask | TextTask).result
      if (res) {
        this.results.push(res)
      }

      task = task.next
    } while (task)
  }
}
