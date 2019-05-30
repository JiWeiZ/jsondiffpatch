export interface ITaskProps {
  left: any,
  right: any,
}

export abstract class Task {
  left: any
  right: any
  next: Task
  children: Task[]
  path: string[];

  constructor(props: ITaskProps) {
    this.left = props.left
    this.right = props.right
    this.next = null
    this.children = []
    this.path = []
  }

  public handle(): void {
  }

  protected getLastChild() {
    if (!this.children.length) {
      return
    }
    return this.children[this.children.length - 1]
  }

  protected getType = (target: any) => {
    if (typeof target === "object") {
      return Array.isArray(target)
        ? "array"
        : "object"
    }
    return typeof target
  }
}
