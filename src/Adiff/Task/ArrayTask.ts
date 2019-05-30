import { Task, ITaskProps } from "./Task";

export interface IArrayTaskProps extends ITaskProps{
  type: string
  itemIdentifier: string
}

export class ArrayTask extends Task {
  type: string;
  itemIdentifier: string;
  constructor(props: IArrayTaskProps) {
    super(props)
    this.type = props.type
    this.itemIdentifier = props.itemIdentifier
  }
}
