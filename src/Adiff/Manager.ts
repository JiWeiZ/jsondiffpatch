import { Task } from "./Task";
import { Worker } from "./Worker";
import { taskAssignor } from './util/taskAssignor'
import { Result } from "./Result";

export class Manager {
  results: Result[];
  constructor() {
    this.results = []
  }
  public hanlde(task: Task) {
    let worker
    do {
      worker = taskAssignor(task)
      worker.handle(task)
      task = task.next
    } while (task)
  }
}
