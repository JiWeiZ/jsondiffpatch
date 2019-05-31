import { Task, ITaskProps } from "./Task";
import { Result, IResultProps } from '../Result'
export interface IPrimitiveTaskProps extends ITaskProps {
}

export class PrimitiveTask extends Task {
  result: Result;
  constructor(props: IPrimitiveTaskProps) {
    super(props)
  }

  public handle = () => {
    const { left, right, path } = this
    this.setResult({ left, right, path })
  }

  private setResult(props: IResultProps) {
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
