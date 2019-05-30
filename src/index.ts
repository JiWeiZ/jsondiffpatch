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
window.data2 = data2

const manager = new Manager()
manager.hanlde(task)
window.results = manager.results
console.log(manager.results)

const getTarget = (path, data)=> {
  const length = path.length
  let res = data
  for(let i = 0; i < length; i++) {
    res = res[path[i]]
  }
  return res
}
