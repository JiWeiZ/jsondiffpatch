import { Task } from "../Task";
import { Worker } from './Worker'

export class ArrayWorker extends Worker {
  public handle = (task: Task) => {

  }

}

let arrayWorker
if (!arrayWorker) {
  arrayWorker = new ArrayWorker()
}

export default arrayWorker
