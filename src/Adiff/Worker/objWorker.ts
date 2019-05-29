import { Task } from "../Task";
import { TaskReport, ObjTaskReport, TEXT_DIFF_AlGORITHM, TextTaskReport, ArrayTaskReport } from '../TaskReport'
import { taskAssignor, getType } from '../util/taskAssignor'
import {
  arrayWorker,
  textWorker,
  primitiveWorker
} from "../Worker";

class ObjWorker {

  public handle(task: Task) {
    const { left, right } = task
    const objType = (task.report as ObjTaskReport).objType

    for (let key of left) {
      let newTask = this.getNewTask(objType, key, left, right)
      task.assignToSub(newTask)
    }
  }

  private getNewTask = (objType, key, left, right) => {

    const leftValue = left[key]
    const rightValue = right[key]
    const leftValueType = getType(leftValue)
    const rightValueType = getType(rightValue)

    let newReport: TaskReport
    if (leftValueType === "string" && rightValueType === "string") {
      newReport = this.createTextTaskReport(objType, key)
    }

    if (leftValueType === "array" && rightValueType === "array") {
      newReport = this.createArrayTaskReport(objType, key)
    }

    if (leftValueType === "object" && rightValueType === "object") {
      newReport = this.createObjTaskReport(objType, key)
    }

    return new Task({
      left: leftValue,
      right: rightValue,
      report: newReport
    })
  }

  private createArrayTaskReport = (objType, key) => {
    return new ArrayTaskReport({
      arrayType: key,
      elementIdentifier: key === "marks" ? "type" : "id"
    })
  }

  private createObjTaskReport = (objType, key) => {
    return new ObjTaskReport({
      objType
    })
  }

  private createTextTaskReport = (objType, key) => {
    const textDiffAlgorithm = key === "text" && objType === "leaf"
      ? TEXT_DIFF_AlGORITHM.GOOGLE_DIFF
      : TEXT_DIFF_AlGORITHM.PLAIN_DIFF

    return new TextTaskReport({
      textDiffAlgorithm
    })
  }


}

let objWorker: ObjWorker
if (!objWorker) {
  objWorker = new ObjWorker()
}

export default objWorker
