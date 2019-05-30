import { Task } from "../Task/Task";
import { TextTaskContext, TEXT_DIFF_AlGORITHM } from "../TaskContext";
import dmp from 'diff-match-patch';

export class TextWorker {
  public handle = (task: Task) => {

  }

}

let textWorker
if (!textWorker) {
  textWorker = new TextWorker()
}

export default textWorker
