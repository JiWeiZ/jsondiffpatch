import { Task, ITaskProps } from "./Task";
import { ObjectTask } from "./ObjectTask";
import { TextTask, PrimitiveTask } from ".";
import lcs from './lcs'
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
    let unMatchHead = 0;
    let unMatchTail = 0;
    let index;
    let index1;
    let index2;
    let array1 = this.left;
    let array2 = this.right;
    let len1 = array1.length;
    let len2 = array2.length;

    // find head of uncommon part
    while (
      unMatchHead < len1 &&
      unMatchHead < len2 &&
      this.isItemsMatch(array1[unMatchHead], array2[unMatchHead])
    ) {
      index = unMatchHead
      this.assignNewTask({
        left: array1[index],
        right: array2[index],
        type: index
      })
      unMatchHead++
    }

    // find tail of uncommon part
    while (
      unMatchHead + unMatchTail < len1 &&
      unMatchHead + unMatchTail < len2 &&
      this.isItemsMatch(
        array1[len1 - 1 - unMatchTail],
        array2[len2 - 1 - unMatchTail]
      )
    ) {
      index1 = len1 - 1 - unMatchTail
      index2 = len2 - 1 - unMatchTail;
      this.assignNewTask({
        left: array1[index1],
        right: array2[index2],
        type: index2
      })
      unMatchTail++
    }

    // case: arrays are identical
    if (unMatchHead + unMatchTail === len1 && len1 === len2) {
      return
    }

    // case: only add items
    if (unMatchHead + unMatchTail === len1) {
      for (let index = unMatchHead; index < len2 - unMatchTail; index++) {
        this.assignNewTask({
          left: undefined,
          right: array2[index],
          type: '' + index
        })
      }
      return
    }

    // case: only remove items
    if (unMatchHead + unMatchTail === len2) {
      for (let index = unMatchHead; index < len1 - unMatchTail; index++) {
        this.assignNewTask({
          left: array1[index],
          right: undefined,
          type: '' + index
        })
      }
      return
    }

    // case: add, remove, and edit
    const unMatchPart1 = array1.slice(unMatchHead, len1 - unMatchTail)
    const unMatchPart2 = array2.slice(unMatchHead, len2 - unMatchTail)

    let seq = this.getLCS(unMatchPart1, unMatchPart2);




  }

  private lengthMatrix = (array1: any[], array2: any[]) => {
    const len1 = array1.length;
    const len2 = array2.length;

    // initialize empty matrix of (len1 + 1) * (len2 + 1)
    const matrix = Array.from(
      { length: len1 + 1 },
      () => Array.from({ length: len2 + 1 }, () => 0)
    )

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const temp = this.isItemsMatch(array1[i - 1], array2[j - 1])
          ? matrix[i][j] = matrix[i - 1][j - 1] + 1
          : Math.max(matrix[i - 1][j], matrix[i][j - 1]);
        matrix[i][j] = temp
      }
    }

    return matrix
  }

  private backtrack = (matrix, array1, array2, index1, index2) => {
    if (index1 === 0 || index2 === 0) {
      return {
        sequence: [],
        indices1: [],
        indices2: [],
      };
    }

    if (this.isItemsMatch(array1[index1], array2[index2])) {
      const sub = this.backtrack(
        matrix,
        array1,
        array2,
        index1 - 1,
        index2 - 1,
      );
      sub.sequence.push(array1[index1 - 1]);
      sub.indices1.push(index1 - 1);
      sub.indices2.push(index2 - 1);
      return sub;
    }

    return matrix[index1][index2 - 1] > matrix[index1 - 1][index2]
      ? this.backtrack(matrix, array1, array2, index1, index2 - 1)
      : this.backtrack(matrix, array1, array2, index1 - 1, index2);
  }

  private getLCS = (array1, array2) => {
    const matrix = this.lengthMatrix(array1, array2)
    return this.backtrack(
      matrix,
      array1,
      array2,
      array1.length,
      array2.length
    )
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
