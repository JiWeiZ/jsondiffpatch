import { Task } from "../Task/Task";
import { TaskContext, ObjTaskContext, TEXT_DIFF_AlGORITHM, TextTaskContext, ArrayTaskContext } from '../TaskContext'
import { taskAssignor } from '../util/taskAssignor'
import { getType } from '../util/getType'
import {
  arrayWorker,
  textWorker,
  primitiveWorker
} from "../Worker";

export class ObjWorker {

  public handle(task: Task) {
  }

  // private getNewTask = (objType, key, left, right, task: Task) => {

  //   const leftValue = left[key]
  //   const rightValue = right[key]
  //   const leftValueType = getType(leftValue)
  //   const rightValueType = getType(rightValue)

  //   let newContext: TaskContext
  //   if (leftValueType === "string" && rightValueType === "string") {
  //     newContext = this.createTextTaskContext(objType, key, task)
  //   }

  //   if (leftValueType === "array" && rightValueType === "array") {
  //     newContext = this.createArrayTaskContext(objType, key, task)
  //   }

  //   if (leftValueType === "object" && rightValueType === "object") {
  //     newContext = this.createObjTaskContext(objType, key, task)
  //   }

  //   return new Task({
  //     left: leftValue,
  //     right: rightValue,
  //     context: newContext
  //   })
  // }

  // private createArrayTaskContext = (objType, key, task: Task) => {
  //   return new ArrayTaskContext({
  //     arrayType: key,
  //     nodeLeft: task.context.nodeLeft,
  //     nodeRight: task.context.nodeRight,
  //     itemIdentifier: key === "marks" ? "type" : "id"
  //   })
  // }

  // private createObjTaskContext = (objType, key, task: Task) => {
  //   return new ObjTaskContext({
  //     objType,
  //     nodeLeft: task.context.nodeLeft,
  //     nodeRight: task.context.nodeRight,
  //   })
  // }

  // private createTextTaskContext = (objType, key, task: Task) => {
  //   const textDiffAlgorithm = key === "text" && objType === "leaf"
  //     ? TEXT_DIFF_AlGORITHM.GOOGLE_DIFF
  //     : TEXT_DIFF_AlGORITHM.PLAIN_DIFF

  //   return new TextTaskContext({
  //     textDiffAlgorithm,
  //     nodeLeft: task.context.nodeLeft,
  //     nodeRight: task.context.nodeRight,
  //   })
  // }

  private getTextValue = (textNode) => {
    let textSum = ''
    for (let leaf of textNode.leaves) {
      textSum += leaf.text
    }
    return textSum
  }


}

let objWorker: ObjWorker
if (!objWorker) {
  objWorker = new ObjWorker()
}

export default objWorker
