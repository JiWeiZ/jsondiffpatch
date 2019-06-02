import { Task, PrimitiveTask, TextTask, ObjectTask } from "./Task";
import { Result } from "./Result";
import DMP from 'diff-match-patch'

let managerOptions

export class Manager {
  results: Result[];
  options: any;
  data1: any;
  data2: any;
  union: any;
  leaves: {};
  blocks: {};
  dmp: any;
  constructor(options) {
    this.results = []
    this.leaves = {}
    this.blocks = {}
    this.dmp = new DMP()
    managerOptions = options
  }

  public diff(left, right) {
    this.data1 = left
    this.data2 = right
    this.union = JSON.parse(JSON.stringify(right))
    const type = "data"
    const task = new ObjectTask({ left, right, type })
    this.hanlde(task)
    return this.results
  }

  public parese = () => {
    for (let res of this.results) {
      const { path, left, right } = res
      const { length } = path
      const numReg = /\d+/
      const a = path[length - 1]
      const b = path[length - 2]
      const c = path[length - 3]

      // block增删
      if (numReg.test(a) && b === "nodes") {
        this.handleBlock(path, left, right)
      }

      // block的data改变
      if (path.includes("data")) {
        const idx = path.indexOf("data")
        const blockPath = path.slice(0, idx)
        this.handleBlock(blockPath, left, right)
      }

      // leaf增删
      if (numReg.test(a) && b === "leaves") {
        this.handleLeaf(path, left, right)
      }

      // leaf的text 改变
      if (a === "text" && numReg.test(b) && c === "leaves") {
        this.handleText(path, left, right)
      }

      // leaf的mark增删
      if (numReg.test(a) && b === "marks") {
        const leafPath = path.slice(0, length - 2)
        const marksPath = path.slice(0, length - 1)
        this.handleMark(leafPath, marksPath)
      }

      // leaf的mark改变
      if (a === "value" && numReg.test(b) && c === "marks") {
        const leafPath = path.slice(0, length - 3)
        const marksPath = path.slice(0, length - 2)
        this.handleMark(leafPath, marksPath)
      }
    }
    console.log(this.leaves)
    console.log(this.blocks)
  }

  private hanlde(task: Task) {
    do {
      task.handle()
      const res = (task as PrimitiveTask | TextTask).result
      if (res) {
        this.results.push(res)
      }
      task = task.next
    } while (task)
  }

  private handleBlock = (path, left, right) => {
    // const pathStr = blockPath.join('-')

    // this.blocks[pathStr] = this.blocks[pathStr] || {}
    // this.blocks[pathStr] = {
    //   left: left == undefined ? left : this.getElm(blockPath, this.data1),
    //   right: right == undefined ? right : this.getElm(blockPath, this.data2)
    // }

    let block
    const blockPath = path.concat()
    if (left && !right) {
      // delete leaf
      blockPath[blockPath.length - 1] += '_'
      block = left
    } else {
      // add leaf
      block = right
    }
    const blockPathStr = blockPath.join('-')
    this.blocks[blockPathStr] = block

  }

  private handleMark = (leafPath, marksPath) => {
    const pathStr = leafPath.join('-')

    if (this.isBlockHandled(pathStr)) {
      delete this.leaves[pathStr]
      return
    }
    this.leaves[pathStr] = this.leaves[pathStr] || {}

    if (!this.leaves[pathStr].marks) {
      this.leaves[pathStr].marks = {
        left: this.getElm(marksPath, this.data1),
        right: this.getElm(marksPath, this.data2)
      }
    }
  }

  private handleLeaf = (path, left, right) => {
    let leaf
    const leafPath = path.concat()
    if (left && !right) {
      // delete leaf
      leafPath[leafPath.length - 1] += '_'
      leaf = left
    } else {
      // add leaf
      leaf = right
    }
    const leafPathStr = leafPath.join('-')

    if (this.isBlockHandled(leafPathStr)) {
      delete this.leaves[leafPathStr]
      return
    }

    this.leaves[leafPathStr] = leaf
  }

  private handleText = (path, left, right) => {
    const leafPath = path.slice(0, length - 1)
    const pathStr = leafPath.join('-')

    if (this.isBlockHandled(pathStr)) {
      delete this.leaves[pathStr]
      return
    }

    const diff = this.dmp.diff_main(left, right)
    this.dmp.diff_cleanupSemantic(diff)
    this.leaves[pathStr] = this.leaves[pathStr] || {}
    this.leaves[pathStr]["text"] = diff
  }

  private getElm(path: string[], rootTarget) {
    let res = { ...rootTarget }
    const a = 1
    for (let i = 0; i < path.length; i++) {
      if (!res) {
        return
      }
      res = res[path[i]]
    }
    return res
  }

  private isBlockHandled(pathStr) {
    for (let str of Object.keys(this.blocks)) {
      if (pathStr.startsWith(str)) {
        return true
      }
    }
    return false
  }
}

export {
  managerOptions
}
