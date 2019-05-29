import {
  Worker,
  objWorker,
  arrayWorker,
  textWorker,
  primitiveWorker
} from "./Worker";
export interface ITaskContext {
  callback?: (any) => any
}

export abstract class TaskContext {
  worker: Worker
  callback: (any: any) => any;
  constructor(props: ITaskContext) {
    this.callback = props.callback
  }
}

export interface IObjTaskContextProps {
  objType: string,
  callback?: (any) => any
}

export class ObjTaskContext extends TaskContext {
  worker: any;
  objType: string;
  constructor(props: IObjTaskContextProps) {
    super(props)
    this.worker = objWorker
    this.objType = props.objType
  }
}

export interface IArrayTaskContextProps {
  arrayType: string,
  elementIdentifier: string,
  callback?: (any) => any
}

export class ArrayTaskContext extends TaskContext {
  worker: any;
  objType: string;
  arrayType: string;
  elementIdentifier: string;
  constructor(props: IArrayTaskContextProps) {
    super(props)
    this.worker = arrayWorker
    this.arrayType = props.arrayType
    this.elementIdentifier = props.elementIdentifier
  }
}

export enum TEXT_DIFF_AlGORITHM{
  PLAIN_DIFF = 0,
  GOOGLE_DIFF = 1,
}

export interface ITextTaskContextProps {
  textDiffAlgorithm: TEXT_DIFF_AlGORITHM,
  callback?: (any) => any
}

export class TextTaskContext extends TaskContext {
  worker: any;

  textDiffAlgorithm: TEXT_DIFF_AlGORITHM;
  constructor(props: ITextTaskContextProps) {
    super(props)
    this.worker = textWorker
    this.textDiffAlgorithm = props.textDiffAlgorithm
  }
}
