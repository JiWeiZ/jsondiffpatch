import {
  Task,
  ArrayTask,
  ObjectTask,
  PrimitiveTask,
  TextTask
 } from '../Task'

import {
  objectWorker,
  arrayWorker,
  textWorker,
  primitiveWorker,
  Worker,
} from "../Worker";


export const taskAssignor = (task: Task) => {

  if (task instanceof ArrayTask) {
    return arrayWorker
  }

  if (task instanceof ObjectTask) {
    return objectWorker
  }

  if (task instanceof PrimitiveTask) {
    return primitiveWorker
  }

  if (task instanceof TextTask) {
    return textWorker
  }
}

