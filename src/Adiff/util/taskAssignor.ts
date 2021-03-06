import { Task } from '../Task'
import {
  objWorker,
  arrayWorker,
  textWorker,
  primitiveWorker
} from "../Worker";

export const taskAssignor = (task: Task) => {
  if (
    task.reports &&
    task.reports.length &&
    task.reports[task.reports.length - 1].worker) {
    return task.reports[task.reports.length - 1].worker
  }

  const leftType = getType(task.left)
  const rightType = getType(task.right)

  if (leftType === 'object' && rightType === 'object') {
    return objWorker
  }

  if (leftType === 'array' && rightType === 'array') {
    return arrayWorker
  }

  if (leftType === 'string' && rightType === 'string') {
    return textWorker
  }

  return primitiveWorker
}

export const getType = (target) => {
  if (typeof target === "object") {
    return Array.isArray(target)
      ? "array"
      : "object"
  }
  return typeof target
}
