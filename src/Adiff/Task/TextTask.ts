import { AtomicTask } from "./Task";
import { Result, IResultProps } from "../Result";

export class TextTask extends AtomicTask {
  result: Result;

  public handle = () => {
    const { left, right, path } = this
    this.setResult({ left, right, path })
  }

  public setResult = (props: IResultProps): void => {
    if (props.left === props.right) {
      return
    }
    this.result = new Result(props)
  }
}
