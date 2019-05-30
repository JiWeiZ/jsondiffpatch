import { Task } from "../Task";
import { Worker } from './Worker'

export class TextWorker extends Worker {
  public handle = (task: Task) => {

  }

}

let textWorker: TextWorker
if (!textWorker) {
  textWorker = new TextWorker()
}

export {textWorker}
