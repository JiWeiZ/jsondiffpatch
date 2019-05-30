export class Result {
  path: string[];
  left: any;
  right: any;

  constructor() {
    this.path = []
    this.left = undefined
    this.right = undefined
  }

  public addToPath (item: string) {
    this.path.push(item)
  }
}
