export interface ITaskProps {
  left: any,
  right: any,
  type?: string,
  omitKeys?: string[],
  itemIdentifier?: string
}

export abstract class Task {
  left: any
  right: any
  next: Task
  children: Task[]
  path: string[]

  constructor(props: ITaskProps) {
    this.left = props.left
    this.right = props.right
    this.children = []
    this.path = []
    this.next = null
  }

  public handle = () => { }

  protected getType = (target: any) => {
    return typeof target === "object"
      ? Array.isArray(target) ? "array" : "object"
      : typeof target
  }

  protected isItemsMatch = (item1, item2, itemIdentifier = "id") => {
    if (item1 === item2) {
      return true
    }

    const item1Type = this.getType(item1)
    const item2Type = this.getType(item2)
    if (item1Type !== item2Type) {
      return false
    }

    // 可能会有性能影响，是否优化待定
    if (item1Type === 'array' && item2Type === 'array') {
      return JSON.stringify(item1) === JSON.stringify(item2)
    }

    if (item1Type === 'object' && item2Type === 'object') {
      return (
        Object.keys(item1).includes(itemIdentifier) &&
        Object.keys(item2).includes(itemIdentifier)
      )
        ? item1[itemIdentifier] === item2[itemIdentifier]
        : JSON.stringify(item1) === JSON.stringify(item2)
    }
  }
}
