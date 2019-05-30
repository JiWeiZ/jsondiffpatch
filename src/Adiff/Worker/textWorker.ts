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
      const result = algorithm.diff_main(left, right)
      algorithm.diff_cleanupSemantic(result)
      const diffLeft = []
      const diffRight = []
      let i = 0
      let j = 0
      for(let item of result) {
        const length = item[1].length
        if (item[0] === 0) {
          i += length
          j += length
        }
        if (item[0] === -1) {
          diffLeft.push([i, i + length])
          i += length
        }
        if (item[0] === 1) {
          diffRight.push([j, j + length])
          j += length
        }
      }

      const report = {
        left: {
          nodeId: nodeLeft.id,
          text: left,
          diff: diffLeft
        },
        right: {
          nodeId: nodeRight.id,
          text: right,
          diff: diffRight
        }
      }
      console.log(result)
      console.log(report)
    }

  }

}

let textWorker
if (!textWorker) {
  textWorker = new TextWorker()
}

export default textWorker
