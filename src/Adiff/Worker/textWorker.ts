import { Task } from "../Task";
import { Worker } from './Worker'

export class TextWorker extends Worker {
  public handle = (task: Task) => {

  }

}

let textWorker
if (!textWorker) {
  textWorker = new TextWorker()
}

export default textWorker
