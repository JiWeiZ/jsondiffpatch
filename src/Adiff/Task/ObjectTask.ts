import { ITaskProps, AssignableTask } from "./Task";
import { ArrayTask } from "./ArrayTask";
import { PrimitiveTask } from "./PrimitiveTask";
import { TextTask } from "./TextTask";

export interface IObjectTaskProps extends ITaskProps {
  type: string
  omitKeys?: string[]
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
          type: key
        })
      }
    }
    return this
  }

  private assignNewTask = (props: ITaskProps) => {
    const newTask = this.getNewTask({
      left: props.left,
      right: props.right,
      type: props.type
    })
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
