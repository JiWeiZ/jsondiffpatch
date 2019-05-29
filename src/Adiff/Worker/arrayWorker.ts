import { Task } from "../Task";
import { TaskContext, ObjTaskContext, TEXT_DIFF_AlGORITHM, TextTaskContext, ArrayTaskContext } from '../TaskContext'
import { getType } from '../util/taskAssignor'


class ArrayWorker {

  public handle(task: Task) {
    const { left, right } = task
    const { arrayType, itemIdentifier } = task.context as ArrayTaskContext

    const leftItemIdentifiers = left.map(e => e[itemIdentifier])
    const rightItemIdentifiers = right.map(e => e[itemIdentifier])

    // deal with nodes array
    if (arrayType === "nodes") {
      for (let ir = 0; ir < right.length; ir++) {
        const itemRight = right[ir]
        const rightItemIdentifier = itemRight[itemIdentifier]
        const il = leftItemIdentifiers.indexOf(rightItemIdentifier)
        const itemLeft = left[il]

        const newContext = new ObjTaskContext({
          objType: itemRight.type,
          omitKeys: ["id", "type"],
          nodeLeft: itemLeft,
          nodeRight: itemRight
        })

        const newTask = new Task({
          left: itemLeft,
          right: itemRight,
          context: newContext
        })

        task.assignToSub(newTask)
      }
    }

    if (arrayType === "leaves") {
      for (let ir = 0; ir < right.length; ir++) {
        const itemRight = right[ir]
        const rightItemIdentifier = itemRight[itemIdentifier]
        const il = leftItemIdentifiers.indexOf(rightItemIdentifier)
        const itemLeft = left[il]

        const newContext = new ObjTaskContext({
          objType: "leaf",
          omitKeys: ["id"],
          nodeLeft: task.context.nodeLeft,
          nodeRight: task.context.nodeRight
        })

        const newTask = new Task({
          left: itemLeft,
          right: itemRight,
          context: newContext
        })

        task.assignToSub(newTask)
      }
    }

  }

  private isItemsMatch(array1, array2, idx1, idx2, itemIdentifier) {

  }

  private getNewTask = (arrayType, key, left, right) => {
  }

  private createArrayTaskContext = (arrayType, key) => {
    return new ArrayTaskContext({
      arrayType: key,
      itemIdentifier: key === "marks" ? "type" : "id"
    })
  }

  private createObjTaskContext = (arrayType, key) => {
  }

  private createTextTaskContext = (arrayType, key) => {

  }


}

let arrayWorker: ArrayWorker
if (!arrayWorker) {
  arrayWorker = new ArrayWorker()
}

export default arrayWorker
