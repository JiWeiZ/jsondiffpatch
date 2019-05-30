import { Task } from "./Task/Task";
import { Worker } from "./Worker";
import { taskAssignor } from './util/taskAssignor'

export class Manager {
  public hanlde(task: Task) {
    let worker
    do {
      worker = taskAssignor(task)
      worker.handle(task)
      task = task.next
    } while (task)
  }
}
