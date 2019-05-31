import { Manager } from './Adiff/Manager'
import { data1, data2 } from './data/data_simple.js'
import { create } from './BenjaminDiff/main'
import options from './options'

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
console.log(results)

const json = {
  results
}

// const jsondiff = create(options)
// const delta = jsondiff.diff(data1, data2)
// document.body.innerHTML = JSON.stringify(delta)
document.body.innerHTML = JSON.stringify(json)
