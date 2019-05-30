import { Task, ITaskProps } from "./Task";

export interface IObjectTaskProps extends ITaskProps{
  type: string
  omitKeys: string[]
}

export class ObjectTask extends Task {
  type: string;
  omitKeys: string[];
  constructor(props: IObjectTaskProps) {
    super(props)
    this.type = props.type
    this.omitKeys = props.omitKeys
  }
}
