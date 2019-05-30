import { Task, ITaskProps } from "./Task";

export interface IArrayTaskProps extends ITaskProps {
  type: string
  itemIdentifier?: string
}

export class ArrayTask extends Task {
  type: string;
  itemIdentifier: string;
  constructor(props: IArrayTaskProps) {
    super(props)
    this.type = props.type
    this.itemIdentifier = props.itemIdentifier || 'id'
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
