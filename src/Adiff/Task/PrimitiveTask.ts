import { AtomicTask } from "./Task";
import { Result, IResultProps } from '../Result'

export class PrimitiveTask extends AtomicTask {
  result: Result;

  public handle = () => {
    const { left, right, path } = this
    this.setResult({ left, right, path })
  }

  public setResult = (props: IResultProps): void => {
    const { left, right } = props

    if (
      this.getType(left) === 'array' && this.getType(right) === 'array' ||
      this.getType(left) === 'object' && this.getType(right) === 'object' ||
      this.isItemsMatch(left, right)
    ) {
      return
    }

    this.result = new Result(props)
  }
}
