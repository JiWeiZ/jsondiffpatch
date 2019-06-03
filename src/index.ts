import { Manager } from './Adiff/Manager'
import { data1, data2 } from './data/data_simple.js'

const opts = {
  arrayItemId: {
    nodes: "id",
    marks: "type"
  },
  objectOmitKeys: {
    document: ["id", "readonly", "type"]
  }
}

const manager = new Manager(opts)
const results = manager.diff(data1, data2)
manager.parese()
document.body.innerHTML = JSON.stringify(manager.union)
