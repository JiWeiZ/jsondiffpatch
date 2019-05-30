import { Task, TextTask } from "../Task";
import { Worker } from './Worker'

export class TextWorker extends Worker {
  public handle = (task: TextTask) => {
    const { left, right, path } = task
    task.setResult({ left, right, path })
  }
}

let textWorker: TextWorker
if (!textWorker) {
  textWorker = new TextWorker()
}

export {textWorker}
