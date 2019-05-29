import { TaskReport } from './TaskReport'

export interface ITaskProps {
  left: any,
  right: any,
  reports?: TaskReport[]
}

export class Task {
  left: any
  right: any
  next: Task
  reports: TaskReport[]
  children: Task[]

  constructor(props: ITaskProps) {
    this.left = props.left
    this.right = props.right
    this.next = null
    this.reports = props.reports.concat()
    this.children = []
  }

  public setReport(report: TaskReport) {
    this.reports = this.reports.concat(report)
    return this
  }

  public assignToSub(child: Task) {
    this.insertAfter(child, this.children.length ? this.getLastChild() : this)
    this.children.push(child)
    return this
  }

  private insertAfter(task: Task, target: Task) {
    task.next = target.next
    target.next = task
  }

  private getLastChild() {
    if (!this.children.length) {
      return
    }
    return this.children[this.children.length - 1]
  }
}
