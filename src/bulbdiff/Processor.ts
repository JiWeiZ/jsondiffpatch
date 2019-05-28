import Context from "./Context";
import Pipe from "./Pipe";

export interface IProcessorProps {
  options: object,
  pipes: Pipe[]
}
export default class Processor {
  options: object;
  pipes: Pipe[];

  constructor (props: IProcessorProps) {
    this.options = props.options
    this.pipes = props.pipes
  }

  public handle(context: Context) {
  }
}
