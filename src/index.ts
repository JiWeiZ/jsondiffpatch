import { create } from './main'
import options from './options.ts'
import data1 from './data/data1'
import data2 from './data/data2'


const jsondiff = create(options)
const delta = jsondiff.diff(data1, data2)
document.body.innerHTML = JSON.stringify(delta)
