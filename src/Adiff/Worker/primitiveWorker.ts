import { Task } from "../Task";
import { Worker } from './Worker'

export class PrimitiveWorker extends Worker {
  public handle = (task: Task) => {

  }

}

let primitiveWorker
if (!primitiveWorker) {
  primitiveWorker = new PrimitiveWorker()
}

export default primitiveWorker
