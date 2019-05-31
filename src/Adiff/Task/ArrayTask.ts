import { Task, ITaskProps } from "./Task";
import { ObjectTask } from "./ObjectTask";
import { TextTask, PrimitiveTask } from ".";
import { Interface } from "readline";

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

  public assignToSub = (child: Task, key: string) => {
    this.setChildNext(child)
    this.setChildPath(child, key)
    this.children.push(child)
    return this
  }

  private setChildNext(child: Task) {
    const target = this.children.length ? this.getLastChild() : this
    child.next = target.next
    target.next = child
  }

  private setChildPath(child: Task, key: string): void {
    child.path = this.path.concat(key)
  }

  public handle = () => {
    let commonHead = 0;
    let commonTail = 0;
    let index;
    let index1;
    let index2;
    let array1 = this.left;
    let array2 = this.right;
    let len1 = array1.length;
    let len2 = array2.length;

    // separate common head
    while (
      commonHead < len1 &&
      commonHead < len2 &&
      this.isItemsMatch(array1[commonHead], array2[commonHead])
    ) {
      index = commonHead
      this.assignNewTask({
        left: array1[index],
        right: array2[index],
        type: index
      })
      commonHead++
    }

    // separate common tail
    while (
      commonHead + commonTail < len1 &&
      commonHead + commonTail < len2 &&
      this.isItemsMatch(
        array1[len1 - 1 - commonTail],
        array2[len2 - 1 - commonTail]
      )
    ) {
      index1 = len1 - 1 - commonTail
      index2 = len2 - 1 - commonTail;
      this.assignNewTask({
        left: array1[index1],
        right: array2[index2],
        type: index2
      })
      commonHead++
    }




















  }

  private assignNewTask = (
    props: {
      left: any,
      right: any,
      type: string
    }
  ) => {
    const newTask = this.getNewTask(props)
    this.assignToSub(newTask, props.type)
  }

  private getNewTask = (
    props: {
      left: any,
      right: any,
      type: string
    }
  ) => {
    const { left, right } = props
    const leftType = this.getType(left)
    const rightType = this.getType(right)

    if (leftType === "object" && rightType === "object") {
      const { type } = props
      return new ObjectTask({
        left,
        right,
        type
      })
    }

    if (leftType === "array" && rightType === "array") {
      const { type } = props
      return new ArrayTask({
        left,
        right,
        type
      })
    }

    if (leftType === "string" && rightType === "string") {
      return new TextTask({
        left,
        right
      })
    }

    return new PrimitiveTask({
      left,
      right
    })
  }
}
