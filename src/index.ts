import { Manager } from './Adiff/Manager'
import { Task } from './Adiff/Task'

import { data1, data2 } from './data/data_simple.js'
import { ObjTaskContext } from './Adiff/TaskContext'

const task = new Task({
  left: data1,
  right: data2,
  context: new ObjTaskContext({
    objType: "data"
  })
})

const manager = new Manager()
manager.hanlde(task)
