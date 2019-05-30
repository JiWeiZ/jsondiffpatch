import { Task, ITaskProps } from "./Task";

export interface IObjectTaskProps extends ITaskProps{
  type: string
  omitKeys?: string[]
}

export class ObjectTask extends Task {
  type: string;
  omitKeys: string[];
  constructor(props: IObjectTaskProps) {
    super(props)
    this.type = props.type
    this.omitKeys = props.omitKeys || []
  }

  public assignToSub(child: Task) {
    this.setChildNext(child)
    this.children.push(child)
    return this
  }

  private setChildNext(child: Task) {
    const target = this.children.length ? this.getLastChild() : this
    child.next = target.next
    target.next = child
  }

  public setChildPath(child: Task, key: string): void {
    child.path = this.path.concat(key)
  }
}
