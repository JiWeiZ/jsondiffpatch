import { Filter } from './Filter'
import Context from './Context';

export default class Pipe {
  filters: Filter[];

  constructor() {
    this.filters = []
  }

  registerFilter(filter: Filter | Filter[]) {
    typeof filter === "function"
      ? this.filters.push(filter as Filter)
      : this.filters.push(...filter as Filter[])
    return this
  }

  process(context: Context) {
    for (let filter of this.filters) {
      filter(context)
      if (context.exiting) {
        break
      }
    }
  }
}
