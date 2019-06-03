import { Task, PrimitiveTask, TextTask, ObjectTask } from "./Task";
import { Result } from "./Result";
import DMP from 'diff-match-patch'
import { deleteBgColor, addBgColor, deleteLine } from './constants'
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
    this.fuse()
    console.log(this.union)
  }

  private fuse = () => {
    for (let leafEntry of Object.entries(this.leaves)) {
      const leafKey = leafEntry[0] as string
      const leafValue = leafEntry[1]
      this.fuseLeaf(leafKey, leafValue)
    }
  }

  private fuseLeaf = (leafKey, leafValue) => {

    const isDelete = leafKey.endsWith('_')

    if (isDelete) {
      this.fuseDeletedLeaf(leafKey, leafValue)
    } else {
      if (
        leafValue.text &&
        leafValue.marks &&
        leafValue.marks.left &&
        leafValue.marks.right
      ) {
        this.fuseText(leafKey, leafValue)
      }

      if (
        leafValue.marks &&
        leafValue.marks.left &&
        leafValue.marks.right
      ) {
        this.fuseMark(leafKey, leafValue)
      }

    }

  }

  private getiDeleteBetween(iDelete: number, iList: number[]) {
    const { length } = iList
    let a: number
    let b: number
    for (let i = 0; i < length; i++) {
      if (iList[i] < iDelete) {
        a = iList[i]
      }
      if (iList[i] > iDelete) {
        b = iList[i]
      }
    }
    return [a, b]
  }

  private getInsertIdx(leafPath, leavesPath) {
    // 获取新旧数据中leaves的引用
    const leavesRefLeft = this.getElm(leavesPath, this.data1)
    const leavesRefRight = this.getElm(leavesPath, this.data2)
    const leavesRefUnion = this.getElm(leavesPath, this.union)
    // 获取被删除leaf在原text的idx
    const iDelete = leafPath[leafPath.length - 1]
    const leavesPathStr = leavesPath.join('-')
    const leaves = Object.keys(this.leaves).filter(e => e.startsWith(leavesPathStr))
    // 找到旧text中哪些leaf被删了
    const deleteLeafKeys = leaves.filter(e => e.endsWith('_'))
    const deleteLeafIdxList = deleteLeafKeys.map(e => {
      const arr = e.split('-')
      return parseInt(arr[arr.length - 1])
    })
    // 找到旧text中没被删的leaf的idx集合
    let keptLeafIdxList: number[] = []
    for (let i = 0; i < leavesRefLeft.length; i++) {
      if (!deleteLeafIdxList.includes(i)) {
        keptLeafIdxList.push(i)
      }
    }
    // 找到被删除的leaf夹在哪两个没被删除的leaf之间
    const [iL, iR] = this.getiDeleteBetween(iDelete, keptLeafIdxList)

    // 获取没删除的leaf在旧text和新text的索引
    const regMove = /.*(\d+)<(\d+).*/
    const reg = /.+-(\d+)/
    const idxList = leaves
      .filter(e => !e.endsWith('_'))
      .map(e => {
        const left = regMove.test(e)
          ? parseInt(regMove.exec(e)[2])
          : parseInt(reg.exec(e)[1])
        const right = regMove.test(e)
          ? parseInt(regMove.exec(e)[1])
          : parseInt(reg.exec(e)[1])
        return { left, right }
      })

    if (iR != undefined) {
      // 找到iR对应的leaf在新text中的位置
      const leafPathLeft = leavesPath.concat(iR + '')
      const id = this.getElm(leafPathLeft, this.data1).id
      // 新的leaf有可能分裂成几个leaf，选择第一个
      for (let i = 0; i < leavesRefUnion.length; i++) {
        const leaf = leavesRefUnion[i]
        if (leaf.id === id || leaf.id === id + '-0') {
          return i
        }
      }
    }

    if (iL != undefined) {
      // 找到iL对应的leaf在新text中的位置
      const leafPathLeft = leavesPath.concat(iL + '')
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

    return 0
  }

  private fuseDeletedLeaf = (leafKey, leafValue) => {
    const leafPath = leafKey.slice(0, leafKey.length - 1).split('-')
    const leavesPath = leafPath.slice(0, leafPath.length - 1)
    const leavesRef = this.getElm(leavesPath, this.union)
    const idx = this.getInsertIdx(leafPath, leavesPath)
    const leafDelete = Object.assign({}, leafValue, { id: leafValue.id + '-pre' })
    this.markLeaf(leafDelete, true)
    leavesRef.splice(idx, 0, leafDelete)
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
