import { Task, ITaskProps } from "./Task";
import { ArrayTask} from "./ArrayTask";
import { PrimitiveTask } from "./PrimitiveTask";
import { TextTask } from "./TextTask";

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

  public assignToSub = (child: Task) => {
    this.setChildNext(child)
    this.children.push(child)
    return this
  }

  public setChildPath = (child: Task, key: string): void => {
    child.path = this.path.concat(key)
  }

  public handle = () => {
    const { left, right, omitKeys } = this

    for (let key of Object.keys(right)) {
      if (omitKeys.includes(key)) {
        continue
      }

      const leftValue = left[key]
      const rightValue = right[key]
      const leftValueType = this.getType(leftValue)
      const rightValueType = this.getType(rightValue)

      let newTask: Task

      if (leftValueType === "array" && rightValueType === "array") {
        newTask = new ArrayTask({
          type: key,
          left: leftValue,
          right: rightValue
        })
      } else if (leftValueType === "object" && rightValueType === "object") {
        newTask = new ObjectTask({
          type: key,
          left: leftValue,
          right: rightValue
        })
      } else if (leftValueType === "string" && rightValueType === "string") {
        newTask = new TextTask({
          left: leftValue,
          right: rightValue
        })
      } else {
        newTask = new PrimitiveTask({
          left: leftValue,
          right: rightValue
        })
      }

      this.assignToSub(newTask)
      this.setChildPath(newTask, key)
    }

    for (let key of Object.keys(left)) {
      if (omitKeys.includes(key)) {
        continue
      }

      const leftValue = left[key]
      const rightValue = right[key]
      const rightValueType = this.getType(rightValue)

      if (rightValueType === "undefined") {
        const newTask = new PrimitiveTask({
          left: leftValue,
          right: rightValue
        })
        this.assignToSub(newTask)
        this.setChildPath(newTask, key)
      }
    }
  }

  private setChildNext = (child: Task) => {
    const target = this.children.length ? this.getLastChild() : this
    child.next = target.next
    target.next = child
  }
}
