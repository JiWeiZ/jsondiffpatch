import { Task } from "../Task";
import { TaskContext, ObjTaskContext, TEXT_DIFF_AlGORITHM, TextTaskContext, ArrayTaskContext } from '../TaskContext'
import { taskAssignor, getType } from '../util/taskAssignor'
import {
  arrayWorker,
  textWorker,
  primitiveWorker
} from "../Worker";

class ObjWorker {

  public handle(task: Task) {
    const { left, right } = task
    const objType = (task.context as ObjTaskContext).objType

    for (let key of Object.keys(left)) {
      let newTask = this.getNewTask(objType, key, left, right)
      task.assignToSub(newTask)
    }
  }

  private getNewTask = (objType, key, left, right) => {

    const leftValue = left[key]
    const rightValue = right[key]
    const leftValueType = getType(leftValue)
    const rightValueType = getType(rightValue)

    let newContext: TaskContext
    if (leftValueType === "string" && rightValueType === "string") {
      newContext = this.createTextTaskContext(objType, key)
    }

    if (leftValueType === "array" && rightValueType === "array") {
      newContext = this.createArrayTaskContext(objType, key)
    }

    if (leftValueType === "object" && rightValueType === "object") {
      newContext = this.createObjTaskContext(objType, key)
    }

    return new Task({
      left: leftValue,
      right: rightValue,
      context: newContext
    })
  }

  private createArrayTaskContext = (objType, key) => {
    return new ArrayTaskContext({
      arrayType: key,
      elementIdentifier: key === "marks" ? "type" : "id"
    })
  }

  private createObjTaskContext = (objType, key) => {
    return new ObjTaskContext({
      objType
    })
  }

  private createTextTaskContext = (objType, key) => {
    const textDiffAlgorithm = key === "text" && objType === "leaf"
      ? TEXT_DIFF_AlGORITHM.GOOGLE_DIFF
      : TEXT_DIFF_AlGORITHM.PLAIN_DIFF

    return new TextTaskContext({
      textDiffAlgorithm
    })
  }


}

let objWorker: ObjWorker
if (!objWorker) {
  objWorker = new ObjWorker()
}

export default objWorker
