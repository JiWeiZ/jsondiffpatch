import { Manager } from './Adiff/Manager'
import { data1, data2 } from './data/data_simple.js'

const manager = new Manager()
const results = manager.diff(data1, data2)
console.log(results)

