import { Task, ITaskProps } from "./Task";

export interface IPrimitiveTaskProps extends ITaskProps{
}

export class PrimitiveTask extends Task {
  constructor(props: IPrimitiveTaskProps) {
    super(props)
  }
}
