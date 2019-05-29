import {
  Worker,
  objWorker,
  arrayWorker,
  textWorker,
  primitiveWorker
} from "./Worker";
export interface ITaskContext {
  callback?: (any) => any
  nodeLeft?: any
  nodeRight?: any
}

export abstract class TaskContext {
  worker: Worker
  callback: (any: any) => any;
  nodeLeft: any;
  nodeRight: any;
  constructor(props: ITaskContext) {
    this.callback = props.callback
    this.nodeLeft = props.nodeLeft
    this.nodeRight = props.nodeRight
  }
}

export interface IObjTaskContextProps {
  objType: string,
  nodeLeft?: any
  nodeRight?: any
  omitKeys?: string[],
  callback?: (any) => any
}

export class ObjTaskContext extends TaskContext {
  worker: any;
  objType: string;
  omitKeys: string[];
  constructor(props: IObjTaskContextProps) {
    super(props)
    this.worker = objWorker
    this.objType = props.objType
    this.omitKeys = props.omitKeys || []
  }
}

export interface IArrayTaskContextProps {
  nodeLeft?: any
  nodeRight?: any
  arrayType: string,
  itemIdentifier: string,
  callback?: (any) => any
}

export class ArrayTaskContext extends TaskContext {
  worker: any;
  arrayType: string;
  itemIdentifier: string;
  constructor(props: IArrayTaskContextProps) {
    super(props)
    this.worker = arrayWorker
    this.arrayType = props.arrayType
    this.itemIdentifier = props.itemIdentifier
  }
}

export enum TEXT_DIFF_AlGORITHM {
  PLAIN_DIFF = 0,
  GOOGLE_DIFF = 1,
}

export interface ITextTaskContextProps {
  nodeLeft?: any
  nodeRight?: any,
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
