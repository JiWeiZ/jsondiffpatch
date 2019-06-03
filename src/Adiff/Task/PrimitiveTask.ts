import { Task } from "./Task";
import { Result, IResultProps } from '../Result'

export class PrimitiveTask extends Task {
  result: Result;

  public handle = () => {
    const { left, right, path } = this
    if (
      this.getType(left) === 'array' && this.getType(right) === 'array' ||
      this.getType(left) === 'object' && this.getType(right) === 'object' ||
      this.isItemsMatch(left, right)
    ) {
      return
    }
    this.result = new Result({ left, right, path })
  }
}
