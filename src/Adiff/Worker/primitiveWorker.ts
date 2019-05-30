import { Task } from "../Task";
import { Worker } from './Worker'

export class PrimitiveWorker extends Worker {
  public handle = (task: Task) => {

  }

}

let primitiveWorker: PrimitiveWorker
if (!primitiveWorker) {
  primitiveWorker = new PrimitiveWorker()
}

export { primitiveWorker }
