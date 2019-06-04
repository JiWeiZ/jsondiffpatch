import { Task, ITaskProps } from "./Task";
import { PrimitiveTask } from "./PrimitiveTask";
import { managerOptions } from "../Manager";
import { getLCS } from "./LCS";
export interface IObjectTaskProps extends ITaskProps {
  type: string
  omitKeys?: string[]
}
export interface IArrayTaskProps extends ITaskProps {
  type: string
  itemIdentifier?: string
}
abstract class AssignableTask extends Task {
  private getLastChild = () => {
    return this.children.length ? this.children[this.children.length - 1] : undefined
  }

  protected assignToSub = (child: Task, key: string) => {
    this.setChildNext(child)
    this.setChildPath(child, key)
    this.children.push(child)
  }

  private setChildNext = (child: Task) => {
    const target = this.children.length ? this.getLastChild() : this
    child.next = target.next
    target.next = child
  }

  private setChildPath = (child: Task, key: string): void => {
    child.path = this.path.concat(key)
  }

  protected getNewTask = (props: ITaskProps): Task => {
    const { left, right } = props
    const leftType = this.getType(left)
    const rightType = this.getType(right)

    if (leftType === "object" && rightType === "object") {
      const { type } = props
      return new ObjectTask({ left, right, type })
    }

    if (leftType === "array" && rightType === "array") {
      const { type } = props
      return new ArrayTask({ left, right, type })
    }

    return new PrimitiveTask({ left, right })
  }

  protected assignNewTask = (props: ITaskProps) => {
    const newTask = this.getNewTask(props)
    this.assignToSub(newTask, props.type)
  }
}
export class ObjectTask extends AssignableTask {
  type: string;
  omitKeys: string[];
  constructor(props: IObjectTaskProps) {
    super(props)
    this.type = props.type
    this.omitKeys = props.omitKeys || []
  }

  public handle = (): void => {
    const { left, right } = this
    this.handleItem(left).handleItem(right)
  }

  public handleItem = (target) => {
    for (let key of Object.keys(target)) {
      if (this.omitKeys.includes(key)) {
        continue
      }

      if (
        target === this.left ||
        target === this.right && this.right[key] === undefined
      ) {
        this.assignNewTask({
          left: this.left[key],
          right: this.right[key],
          type: key,
        })
      }
    }
    return this
  }
}
export class ArrayTask extends AssignableTask {
  type: string;
  itemIdentifier: string;
  constructor(props: IArrayTaskProps) {
    super(props)
    this.type = props.type
    this.itemIdentifier = managerOptions.arrayItemId[props.type] || 'id'
  }

  public handle = () => {
    let unMatchHead = 0;
    let unMatchTail = 0;
    let arr1 = this.left;
    let arr2 = this.right;
    let len1 = arr1.length;
    let len2 = arr2.length;

    // find head of uncommon part
    while (
      unMatchHead < len1 &&
      unMatchHead < len2 &&
      this.isItemsMatch(arr1[unMatchHead], arr2[unMatchHead], this.itemIdentifier)
    ) {
      this.assignNewTask({
        left: arr1[unMatchHead],
        right: arr2[unMatchHead],
        type: '' + unMatchHead
      })
      unMatchHead++
    }

    // find tail of uncommon part
    while (
      unMatchHead + unMatchTail < len1 &&
      unMatchHead + unMatchTail < len2 &&
      this.isItemsMatch(arr1[len1 - 1 - unMatchTail], arr2[len2 - 1 - unMatchTail], this.itemIdentifier)
    ) {
      const i1 = len1 - 1 - unMatchTail
      const i2 = len2 - 1 - unMatchTail
      this.assignNewTask({
        left: arr1[i1],
        right: arr2[i2],
        type: '' + i2
      })
      unMatchTail++
    }

    // case: arrays are identical
    if (unMatchHead + unMatchTail === len1 && len1 === len2) {
      return
    }

    // handle match part #1
    // case 1-1: only add items
    if (unMatchHead + unMatchTail === len1) {
      for (let i = unMatchHead; i < len2 - unMatchTail; i++) {
        this.assignNewAddTask(i)
      }
      return
    }
    // case 1-2: only remove items
    if (unMatchHead + unMatchTail === len2) {
      for (let i = unMatchHead; i < len1 - unMatchTail; i++) {
        this.assignNewRemoveTask(i)
      }
      return
    }

    // handle match part #2
    const unMatchPart1 = arr1.slice(unMatchHead, len1 - unMatchTail)
    const unMatchPart2 = arr2.slice(unMatchHead, len2 - unMatchTail)
    const LCS = getLCS(unMatchPart1, unMatchPart2, this.isItemsMatch);
    // case 2-1: remove in unmatch part
    for (let i = unMatchHead; i < len1 - unMatchTail; i++) {
      if (!LCS.idxs1.includes(i - unMatchHead)) {
        this.assignNewRemoveTask(i)
      }
    }
    // case 2-2: add in unmatch part
    for (let i = unMatchHead; i < len2 - unMatchTail; i++) {
      if (!LCS.idxs2.includes(i - unMatchHead)) {
        this.assignNewAddTask(i)
      }
    }
    // case 2-3: assign task about seq of lcs
    for (let i = 0; i < LCS.idxs1.length; i++) {
      const i1 = LCS.idxs1[i] + unMatchHead
      const i2 = LCS.idxs2[i] + unMatchHead
      this.assignNewTask({
        left: arr1[i1],
        right: arr2[i2],
        type: `${i2}<${i1}`,
      })
    }
  }

  private assignNewAddTask = (i: number) => {
    this.assignNewTask({
      left: undefined,
      right: this.right[i],
      type: '' + i
    })
  }

  private assignNewRemoveTask = (i: number) => {
    this.assignNewTask({
      left: this.left[i],
      right: undefined,
      type: '' + i
    })
  }
}
