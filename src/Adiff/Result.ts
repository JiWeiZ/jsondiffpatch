export interface IResultProps {
  path: string[]
  left: any
  right: any
}

export class Result {
  path: string[];
  left: any;
  right: any;

  constructor(props: IResultProps) {
    this.path = props.path
    this.left = props.left
    this.right = props.right
  }
}
