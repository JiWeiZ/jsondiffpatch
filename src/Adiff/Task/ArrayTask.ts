import { Task, ITaskProps } from "./Task";
import { ObjectTask } from "./ObjectTask";

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

  public handle = () => {
    const { left, right, itemIdentifier } = this
    const leftItemIdentifiers = left.map(e => e[itemIdentifier])
    const rightItemIdentifiers = right.map(e => e[itemIdentifier])

    for (let ir = 0; ir < right.length; ir++) {
      const itemRight = right[ir]
      const rightItemIdentifier = itemRight[itemIdentifier]
      const il = leftItemIdentifiers.indexOf(rightItemIdentifier)
      const itemLeft = left[il]

      const newTask = new ObjectTask({
        type: ir.toString(),
        left: itemLeft,
        right: itemRight
      })

      this.assignToSub(newTask)
      this.setChildPath(newTask, ir.toString())
    }
  }
}
