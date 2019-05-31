import { ITaskProps, AssignableTask } from "./Task";
import { ObjectTask } from './ObjectTask'
import { PrimitiveTask } from './PrimitiveTask'
import { TextTask } from './TextTask'
import { getLCS } from './LCS'
export interface IArrayTaskProps extends ITaskProps {
  type: string
  itemIdentifier?: string
}

export class ArrayTask extends AssignableTask {
  type: string;
  itemIdentifier: string;
  constructor(props: IArrayTaskProps) {
    super(props)
    this.type = props.type
    this.itemIdentifier = props.itemIdentifier || 'id'
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
      this.isItemsMatch(arr1[unMatchHead], arr2[unMatchHead])
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
      this.isItemsMatch(arr1[len1 - 1 - unMatchTail], arr2[len2 - 1 - unMatchTail])
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

  private assignNewTask = (props: ITaskProps) => {
    const newTask = this.getNewTask(props)
    this.assignToSub(newTask, props.type)
  }

  private getNewTask = (props: ITaskProps) => {
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

    if (leftType === "string" && rightType === "string") {
      return new TextTask({ left, right })
    }

    return new PrimitiveTask({ left, right })
  }
}
