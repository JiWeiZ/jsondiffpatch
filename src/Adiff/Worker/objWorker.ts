import { Task } from "../Task";
import { Worker } from './Worker'

export class ObjectWorker extends Worker {
  public handle = (task: Task) => {

  }

}

let objectWorker: ObjectWorker
if (!objectWorker) {
  objectWorker = new ObjectWorker()
}

export { objectWorker }
