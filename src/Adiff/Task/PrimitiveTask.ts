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
    if (props.left === props.right) {
      return
    }
    this.result = new Result(props)
  }
}
