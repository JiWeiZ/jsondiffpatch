import {
  Worker,
  objWorker,
  arrayWorker,
  textWorker,
  primitiveWorker
} from "./Worker";
export interface ITaskReport {
  callback?: (any) => any
}

export abstract class TaskReport {
  worker: Worker
  callback: (any: any) => any;
  constructor(props: ITaskReport) {
    this.callback = props.callback
  }
}

export interface IObjTaskReportProps {
  objType: string,
  callback?: (any) => any
}

export class ObjTaskReport extends TaskReport {
  worker: any;
  objType: string;
  constructor(props: IObjTaskReportProps) {
    super(props)
    this.worker = objWorker
    this.objType = props.objType
  }
}

export interface IArrayTaskReportProps {
  arrayType: string,
  elementIdentifier: string,
  callback?: (any) => any
}

export class ArrayTaskReport extends TaskReport {
  worker: any;
  objType: string;
  arrayType: string;
  elementIdentifier: string;
  constructor(props: IArrayTaskReportProps) {
    super(props)
    this.worker = arrayWorker
    this.arrayType = props.arrayType
    this.elementIdentifier = props.elementIdentifier
  }
}

export enum TEXT_DIFF_AlGORITHM{
  PLAIN = 0,
  GOOGLE_DIFF = 1,
}

export interface ITextTaskReportProps {
  handleStrategy: TEXT_DIFF_AlGORITHM,
  callback?: (any) => any
}

export class TextTaskReport extends TaskReport {
  worker: any;

  handleStrategy: TEXT_DIFF_AlGORITHM;
  constructor(props: ITextTaskReportProps) {
    super(props)
    this.worker = textWorker
    this.handleStrategy = props.handleStrategy
  }
}
