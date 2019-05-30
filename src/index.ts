import { Manager } from './Adiff/Manager'
import { Task } from './Adiff/Task/Task'
import { ObjectTask } from './Adiff/Task/ObjectTask'

import { data1, data2 } from './data/data_simple.js'

const task = new ObjectTask({
  left: data1,
  right: data2,
  type: "data",
  omitKeys: ["type", "id", "readonly"]
})

const manager = new Manager()
manager.hanlde(task)
