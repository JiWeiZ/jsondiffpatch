import { Task } from "../Task";
import { taskAssignor, getType } from '../util/taskAssignor'

class ObjWorker {
  public handle(task: Task) {
    const { left, right } = task

    for (let key of left) {
      const leftValue = left[key]
      const rightValue = right[key]
      const leftValueType = getType(leftValue)
      const rightValueType = getType(rightValue)

      if (leftValueType === "array" && rightValueType === "array") {
        const report = {

        }
      }

      if (leftValueType === "object" && rightValueType === "object") {

      }

      if (leftValueType === "string" && rightValueType === "string") {

      }









    }


  }
}

let objWorker
if (!objWorker) {
  objWorker = new ObjWorker()
}

export default objWorker
