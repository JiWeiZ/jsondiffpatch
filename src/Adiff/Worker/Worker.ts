import { Task } from "../Task";

export abstract class Worker {
  public handle(task: Task): void { }
}
