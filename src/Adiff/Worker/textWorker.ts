import { Task } from "../Task";

class TextWorker {
  public handle = (task: Task) => {

  }

}

let textWorker
if (!textWorker) {
 textWorker = new TextWorker()
}

export default textWorker
