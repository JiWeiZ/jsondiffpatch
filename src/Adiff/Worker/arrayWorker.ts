import { Task } from "../Task";
import { Worker } from './Worker'

export class ArrayWorker extends Worker {
  public handle = (task: Task) => {

  }
}

let arrayWorker: ArrayWorker
if (!arrayWorker) {
  arrayWorker = new ArrayWorker()
}

export { arrayWorker }
