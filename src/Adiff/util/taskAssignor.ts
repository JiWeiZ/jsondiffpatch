import {
  Task,
  ArrayTask,
  ObjectTask,
  PrimitiveTask,
  TextTask
 } from '../Task'

import {
  objWorker,
  arrayWorker,
  textWorker,
  primitiveWorker
} from "../Worker";


export const taskAssignor = (task: Task) => {

  if (task instanceof ArrayTask) {
    return arrayWorker
  }

  if (task instanceof ObjectTask) {
    return objWorker
  }

  if (task instanceof PrimitiveTask) {
    return primitiveWorker
  }

  if (task instanceof TextTask) {
    return textWorker
  }
}

