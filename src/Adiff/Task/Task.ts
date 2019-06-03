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
  path: string[];

  constructor(props: ITaskProps) {
    this.left = props.left
    this.right = props.right
    this.next = null
    this.children = []
    this.path = []
  }

  public handle = () => {}

  protected getLastChild = () => {
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

  protected isItemsMatch = (item1, item2, itemIdentifier = "id") => {

    // 2者强相等，必然匹配了
    if (item1 === item2) {
      return true
    }

    // 2者类型都不一样，必然不匹配了
    const item1Type = this.getType(item1)
    const item2Type = this.getType(item2)
    if (item1Type !== item2Type) {
      return false
    }

    // 2者是数组，只有完全相同才认为匹配
    // 可能会有性能影响，是否优化待定
    if (item1Type === 'array' && item2Type === 'array') {
      return JSON.stringify(item1) === JSON.stringify(item2)
    }

    // 可能会有性能影响，是否优化待定
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
