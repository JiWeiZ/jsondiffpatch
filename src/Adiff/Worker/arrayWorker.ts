import { Task, ArrayTask, ObjectTask } from "../Task";
import { Worker } from './Worker'
import { getType } from "../util/getType";

export class ArrayWorker extends Worker {
  public handle = (task: ArrayTask) => {
    const { left, right, itemIdentifier } = task
    const leftItemIdentifiers = left.map(e => e[itemIdentifier])
    const rightItemIdentifiers = right.map(e => e[itemIdentifier])

    for (let ir = 0; ir < right.length; ir++) {
      const itemRight = right[ir]
      const rightItemIdentifier = itemRight[itemIdentifier]
      const il = leftItemIdentifiers.indexOf(rightItemIdentifier)
      const itemLeft = left[il]

      const newTask = new ObjectTask({
        type: ir.toString(),
        left: itemLeft,
        right: itemRight
      })

      task.assignToSub(newTask)
      task.setChildPath(newTask, ir.toString())
    }
  }
}

let arrayWorker: ArrayWorker
if (!arrayWorker) {
  arrayWorker = new ArrayWorker()
}

export { arrayWorker }
