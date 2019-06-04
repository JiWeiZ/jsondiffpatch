import { Task, PrimitiveTask, ObjectTask } from "./Task";
import { Result } from "./Result";
import DMP from 'diff-match-patch'
import { deleteBgColor, addBgColor, deleteLine } from './constants'
import FileSaver from 'file-saver';

let managerOptions

const dmp = new DMP()
export class Manager {
  results: Result[];
  options: any;
  data1: any;
  data2: any;
  union: any;
  leaves: {};
  blocks: {};
  constructor(options) {
    this.results = []
    this.leaves = {}
    this.blocks = {}
    managerOptions = options
  }

  public handle(left, right) {
    this.data1 = left
    this.data2 = right
    this.union = JSON.parse(JSON.stringify(right))
    const type = "data"
    const task = new ObjectTask({ left, right, type })
    this.diff(task)
    return this.results
  }

  public start = () => {
    this.parse()
    this.fuse()
    console.log(this.results)
    console.log(this.leaves)
    console.log(this.blocks)
  }

  private parse = () => {
    for (let res of this.results) {
      const { path, left, right } = res
      const { length } = path
      const numReg = /\d+/
      const a = path[length - 1]
      const b = path[length - 2]
      const c = path[length - 3]

      // block增删
      if (numReg.test(a) && b === "nodes") {
        this.parseBlock(path, left, right)
      }

      // block的data改变
      if (path.includes("data")) {
        const idx = path.indexOf("data")
        const blockPath = path.slice(0, idx)
        this.parseBlock(blockPath, left, right)
      }

      // leaf增删
      if (numReg.test(a) && b === "leaves") {
        this.parseLeaf(path, left, right)
      }

      // leaf的text 改变
      if (a === "text" && numReg.test(b) && c === "leaves") {
        this.parseText(path, left, right)
      }

      // leaf的mark增删
      if (numReg.test(a) && b === "marks") {
        const leafPath = path.slice(0, length - 2)
        const marksPath = path.slice(0, length - 1)
        this.parseMark(leafPath, marksPath)
      }

      // leaf的mark改变
      if (a === "value" && numReg.test(b) && c === "marks") {
        const leafPath = path.slice(0, length - 3)
        const marksPath = path.slice(0, length - 2)
        this.parseMark(leafPath, marksPath)
      }
    }
  }

  private parseBlock = (path, left, right) => {
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

  private parseMark = (leafPath, marksPath) => {
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

  private parseLeaf = (path, left, right) => {
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

  private parseText = (path, left, right) => {
    const leafPath = path.slice(0, length - 1)
    const pathStr = leafPath.join('-')

    if (this.isBlockHandled(pathStr)) {
      delete this.leaves[pathStr]
      return
    }

    const diff = dmp.diff_main(left, right)
    dmp.diff_cleanupSemantic(diff)
    this.leaves[pathStr] = this.leaves[pathStr] || {}
    this.leaves[pathStr]["text"] = diff
  }

  private fuse = () => {
    Object.entries(this.leaves).forEach(e => {
      const leafKey = e[0] as string
      const leafValue = e[1]
      this.fuseLeaf(leafKey, leafValue)
    })
  }

  private fuseLeaf = (leafKey: string, leafValue) => {
    const fuseMethod = this.getFuseMethod(leafKey, leafValue)
    fuseMethod(leafKey, leafValue)
  }

  private getFuseMethod = (leafKey: string, leafValue) => {
    const isDelete = leafKey.endsWith('_')
    if (isDelete) {
      return this.fuseDeletedLeaf
    }

    if (!leafKey.endsWith('_') && leafValue.id) {
      return this.fuseNewLeaf
    }

    if (Array.isArray(leafValue.text)) {
      return this.fuseText
    }

    if (
      leafValue.marks &&
      leafValue.marks.left &&
      leafValue.marks.right
    ) {
      return this.fuseMark
    }
  }

  private fuseNewLeaf = (leafKey, leafValue) => {
    const leafPath = leafKey.split('-')
    const leavesPath = leafPath.slice(0, leafPath.length - 1)
    const { id } = leafValue
    const leafRef = this.getElm(leavesPath, this.union).filter(e => e.id === id)[0]
    this.markLeaf(leafRef, false)
  }

  private fuseDeletedLeaf = (leafKey, leafValue) => {
    const leafPath = leafKey.slice(0, leafKey.length - 1).split('-')
    const leavesPath = leafPath.slice(0, leafPath.length - 1)
    const leavesRef = this.getElm(leavesPath, this.union)
    const insertIdx = this.getInsertIdx(leafPath, leavesPath)
    const leafDelete = Object.assign({}, leafValue, { id: leafValue.id + '-pre' })
    this.markLeaf(leafDelete, true)
    leavesRef.splice(insertIdx, 0, leafDelete)
  }

  private getInsertIdx(leafPath, leavesPath): number {
    // 获取新旧数据中leaves的引用
    const leavesRefLeft = this.getElm(leavesPath, this.data1)
    const leavesRefUnion = this.getElm(leavesPath, this.union)
    // 获取被删除leaf在原数据中的idx
    const iDelete = leafPath[leafPath.length - 1]
    // 找到旧text中哪些leaf被删了
    const leavesPathStr = leavesPath.join('-')
    const leaves = Object.keys(this.leaves).filter(e => e.startsWith(leavesPathStr))
    const deleteLeafIdxList = leaves.filter(e => e.endsWith('_')).map(e => {
      const arr = e.split('-')
      return parseInt(arr[arr.length - 1])
    })
    // 找到旧text中哪些leaf没被删
    const unDeleteLeafIdxList: number[] = []
    leavesRefLeft.forEach((e, i) => {
      !deleteLeafIdxList.includes(i) && unDeleteLeafIdxList.push(i)
    })
    // 找到被删除的leaf夹在哪两个没被删除的leaf之间
    let iStart: number
    let iEnd: number
    unDeleteLeafIdxList.forEach(e => {
      e < iDelete && (iStart = e)
      e > iDelete && (iEnd = e)
    })

    // 右侧有没被删的leaf，先以此为准；否则以左侧为准
    if (iEnd != undefined) {
      // 找到iEnd对应的leaf的id，新旧leaf的id相同
      const leafPathLeft = leavesPath.concat(iEnd + '')
      const id = this.getElm(leafPathLeft, this.data1).id
      // 新leaf有可能分裂成几个leaf，选择第一个
      for (let i = 0; i < leavesRefUnion.length; i++) {
        const leaf = leavesRefUnion[i]
        if (leaf.id === id || leaf.id === id + '-0') {
          return i
        }
      }
    }
    if (iStart != undefined) {
      const leafPathLeft = leavesPath.concat(iStart + '')
      const id = this.getElm(leafPathLeft, this.data1).id
      // 新的leaf有可能分裂成几个leaf，选择最后一个
      const leaves = leavesRefUnion.filter(leaf => leaf.id.startsWith(id))
      for (let i = 0; i < leaves.length; i++) {
        const leaf = leaves[i]
        if (
          leaf.id === id ||
          leaf.id === id + `-${leaves.length - 1}`
        ) {
          // splice是往前插，故 + 1
          return i + 1
        }
      }
    }
    // 左右皆无，返回leavesRefUnion中第一个没被删的idx
    for (let i = 0; i < leavesRefUnion.length; i++) {
      if (!leavesRefUnion[i].id.endsWith('pre')) {
        return i
      }
    }
    return leavesRefUnion.length
  }

  private fuseText = (leafKey, leafValue) => {
    const leafPath = leafKey.split('-')
    const leavesPath = leafPath.slice(0, leafPath.length - 1)
    const leavesRef = this.getElm(leavesPath, this.union)
    const targetId = this.getElm(leafPath, this.data2).id
    const leafRef = leavesRef.filter(e => e.id === targetId)[0]
    const idx = leavesRef.indexOf(leafRef)
    const { text, marks } = leafValue
    const baseLeafId = leafRef.id

    const res = []
    for (let i = 0; i < text.length; i++) {
      const tag = text[i][0]
      const str = text[i][1]

      let leafMarks
      if (marks) {
        leafMarks = tag === -1 ? marks.left : marks.right
      } else {
        leafMarks = leafRef.marks
      }

      const leaf = {
        id: `${baseLeafId}-${i}`,
        text: str,
        marks: leafMarks
      }

      if (tag === 1) {
        this.markLeaf(leaf, false)
      }

      if (tag === -1) {
        this.markLeaf(leaf, true)
      }


      res.push(leaf)
    }

    leavesRef.splice(idx, 1, ...res)
  }

  private fuseMark(leafKey, leafValue) {
    // TODO
    // 咋显示？
  }

  private markBlock = (block, isDelete) => {
    block.data = block.data || {}
    block.data.style = block.data.style || {}
    if (isDelete) {
      block.data.style.backgroundColor = deleteBgColor
      block.data.style.textDecoration = deleteLine
    } else {
      block.data.style.backgroundColor = addBgColor

    }
  }

  private markLeaf = (leaf, isDelete) => {
    leaf.marks = leaf.marks || []

    const marks = isDelete
      ? [
        {
          type: "backgroundColor",
          value: deleteBgColor
        }, {
          type: "textDecoration",
          value: deleteLine
        }
      ]
      : [
        {
          type: "backgroundColor",
          value: addBgColor
        }
      ]

    leaf.marks.forEach((e, i, arr) => {
      if (e.type === "backgroundColor" ||
        e.type === "textDecoration"
      ) {
        delete arr[i]
      }
    })

    leaf.marks = leaf.marks.concat(marks)
  }

  private diff(task: Task) {
    do {
      task.handle()
      const res = (task as PrimitiveTask).result
      if (res) {
        this.results.push(res)
      }
      task = task.next
    } while (task)
  }

  private getElm(path: string[], rootTarget) {
    const reg = /(\d+)<(\d+)/
    let res = { ...rootTarget }

    for (let i = 0; i < path.length; i++) {
      if (!res) {
        return
      }

      const prop = reg.test(path[i])
        ? rootTarget === this.data1
          ? reg.exec(path[i])[2]
          : reg.exec(path[i])[1]
        : path[i]

      res = res[prop]
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
