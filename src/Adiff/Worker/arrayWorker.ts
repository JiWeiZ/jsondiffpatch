import { Task } from "../Task/Task";
import { TaskContext, ObjTaskContext, TEXT_DIFF_AlGORITHM, TextTaskContext, ArrayTaskContext } from '../TaskContext'
import { getType } from '../util/taskAssignor'


class ArrayWorker {

  public handle(task: Task) {


  }

  private isItemsMatch(array1, array2, idx1, idx2, itemIdentifier) {

  }

}

let arrayWorker: ArrayWorker
if (!arrayWorker) {
  arrayWorker = new ArrayWorker()
}

export default arrayWorker
