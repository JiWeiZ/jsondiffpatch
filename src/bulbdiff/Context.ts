export interface IContextProps {
  left: any,
  right: any,
  name: string
}

export default class Context {
  public left: any
  public right: any;
  public name: string

  public children: Context[]

  public next: Context;
  public parent: Context
  public result: any;
  public exiting: boolean

  constructor (props: IContextProps) {
    this.left = props.left
    this.right = props.right
    this.name = props.name
    this.children = []
  }

  public setResult (result) {
    this.result = result
    return this
  }

  public pushToChildren(child: Context) {
    child.parent = this

    if (!this.children.length) {
      child.next = this.next
      this.next = child
    } else {
      const lastChild = this.getLastChild()
      child.next = lastChild.next
      lastChild.next = child
    }

    this.children.push(child)
    return this
  }

  private getLastChild() {
    if (!this.children.length) {
      return
    }
    return this.children[this.children.length - 1]
  }
}
