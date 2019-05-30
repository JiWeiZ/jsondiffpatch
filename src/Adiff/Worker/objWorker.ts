import { ObjectTask, ArrayTask, Task, TextTask, PrimitiveTask } from "../Task";
import { Worker } from './Worker'
import { getType } from '../util/getType'

export class ObjectWorker extends Worker {
  public handle = (task: ObjectTask) => {
    const { left, right, omitKeys } = task

    for (let key of Object.keys(right)) {
      if (omitKeys.includes(key)) {
        continue
      }

      const leftValue = left[key]
      const rightValue = right[key]
      const leftValueType = getType(leftValue)
      const rightValueType = getType(rightValue)

      let newTask: Task

      if (leftValueType === "array" && rightValueType === "array") {
        newTask = new ArrayTask({
          type: key,
          left: leftValue,
          right: rightValue
        })
      }

      else if (leftValueType === "object" && rightValueType === "object") {
        newTask = new ObjectTask({
          type: key,
          left: leftValue,
          right: rightValue
        })
      }

      else if (leftValueType === "string" && rightValueType === "string") {
        newTask = new TextTask({
          left: leftValue,
          right: rightValue
        })
      }

      else {
        newTask = new PrimitiveTask({
          left: leftValue,
          right: rightValue
        })
      }


      task.assignToSub(newTask)
      task.setChildPath(newTask, key)
    }

    for (let key of Object.keys(left)) {
      if (omitKeys.includes(key)) {
        continue
      }

      const leftValue = left[key]
      const rightValue = right[key]
      const leftValueType = getType(leftValue)
      const rightValueType = getType(rightValue)

      if (rightValueType === "undefined") {
        const newTask = new PrimitiveTask({
          left: leftValue,
          right: rightValue
        })
        task.assignToSub(newTask)
        task.setChildPath(newTask, key)
      }
    }


  }
}

let objectWorker: ObjectWorker
if (!objectWorker) {
  objectWorker = new ObjectWorker()
}

export { objectWorker }
