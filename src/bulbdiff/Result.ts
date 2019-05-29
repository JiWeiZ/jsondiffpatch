enum  DiffType{
  ADD = 'ADD',
  DELETE = 'DELETE',
  EDIT = "EDIT"
}

interface IDiffResult {
  path: string[],
  type: DiffType,
  detail: [any, any] | string
}



class DiffResult {
  target: object;
  path: string[];
  type: DiffType;
  detail: string | [any, any];

  constructor(props: IDiffResult) {
    this.path = props.path
  }

}
