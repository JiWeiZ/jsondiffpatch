import { TaskReport } from './TaskReport'

export interface ITaskProps {
  left: any,
  right: any,
  report?: TaskReport
}

export class Task {
  left: any
  right: any
  next: Task
  reports: TaskReport[]
  children: Task[]
  report: TaskReport;

  constructor(props: ITaskProps) {
    this.left = props.left
    this.right = props.right
    this.report = props.report
    this.next = null
    this.reports = []
    this.children = []
  }

  public assignToSub(child: Task) {
    child.reports = this.reports.concat(child.report)
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
