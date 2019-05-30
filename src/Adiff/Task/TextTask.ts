import { Task, ITaskProps } from "./Task";
import { Result, IResultProps } from "../Result";

export interface ITextTaskProps extends ITaskProps{
}

export class TextTask extends Task {
  result: Result;
  constructor(props: ITextTaskProps) {
    super(props)
  }

  setResult(props: IResultProps) {
    if (props.left === props.right) {
      return
    }
    this.result = new Result({
      path: props.path,
      left: props.left,
      right: props.right
    })
  }
}
