import { Task, ITaskProps } from "./Task";

export interface ITextTaskProps extends ITaskProps{
}

export class TextTask extends Task {
  constructor(props: ITextTaskProps) {
    super(props)
  }
}
