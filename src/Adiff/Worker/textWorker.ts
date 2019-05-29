import { Task } from "../Task";
import { TextTaskContext, TEXT_DIFF_AlGORITHM } from "../TaskContext";
import dmp from 'diff-match-patch';

class TextWorker {
  public handle = (task: Task) => {
    const { textDiffAlgorithm, nodeLeft, nodeRight } = task.context as TextTaskContext
    const {left, right} = task

    if (textDiffAlgorithm === TEXT_DIFF_AlGORITHM.GOOGLE_DIFF) {
      let algorithm
      algorithm = new dmp()
      const result = algorithm.patch_toText(algorithm.patch_make(left, right))
      console.log(result)
      console.log(nodeLeft)
      console.log(nodeRight)
    }

  }

}

let textWorker
if (!textWorker) {
  textWorker = new TextWorker()
}

export default textWorker
