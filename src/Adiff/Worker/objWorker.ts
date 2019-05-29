import { Task } from "../Task";
import { TaskReport } from '../TaskReport'
import { taskAssignor, getType } from '../util/taskAssignor'
import {
  arrayWorker,
  textWorker,
  primitiveWorker
} from "../Worker";

class ObjWorker {
  public handle(task: Task) {
    const { left, right } = task

    for (let key of left) {
      const leftValue = left[key]
      const rightValue = right[key]
      const leftValueType = getType(leftValue)
      const rightValueType = getType(rightValue)

      if (leftValueType === "array" && rightValueType === "array") {
        const newTask = new Task({
          left: left[key],
          right: right[key],
        })

        task.assignToSub(newTask)
      }

      if (leftValueType === "object" && rightValueType === "object") {

      }

      if (leftValueType === "string" && rightValueType === "string") {
      }
    }
  }
}

let objWorker: ObjWorker
if (!objWorker) {
  objWorker = new ObjWorker()
}

export default objWorker
