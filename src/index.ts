import { create } from './main'

const root = window.document.createElement('div')
root.id = 'root'
root.innerHTML = 'YES'
window.document.body.appendChild(root)

const diff = create()
console.log(diff)
