import { Task, PrimitiveTask } from "../Task";
import { Worker } from './Worker'

export class PrimitiveWorker extends Worker {
  public handle = (task: PrimitiveTask) => {
    const { left, right, path } = task
    task.setResult({ left, right, path })
  }
}

let primitiveWorker: PrimitiveWorker
if (!primitiveWorker) {
  primitiveWorker = new PrimitiveWorker()
}

export { primitiveWorker }
