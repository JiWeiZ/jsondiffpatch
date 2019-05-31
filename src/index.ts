import { Manager } from './Adiff/Manager'
import { data1, data2 } from './data/data_simple.js'
import { create } from './BenjaminDiff/main'
import options from './options'

const manager = new Manager()
const results = manager.diff(data1, data2)
console.log(results)

const jsondiff = create(options)
const delta = jsondiff.diff(data1, data2)
document.body.innerHTML = JSON.stringify(delta)
