import Processor from './processor'
import options from './options'
import data1 from './data/data1'
import data2 from './data/data2'

import Pipe from './pipe';
import DiffContext from './contexts/diff';

import * as trivial from './filters/trivial';
import * as nested from './filters/nested';
import * as arrays from './filters/arrays';
import * as dates from './filters/dates';
import * as texts from './filters/texts';


const processor = new Processor(options)
const diffContext = new DiffContext(data1, data2)
processor.pipe(
  new Pipe('diff')
    .append(
      nested.collectChildrenDiffFilter,
      trivial.diffFilter,
      dates.diffFilter,
      texts.diffFilter,
      nested.objectsDiffFilter,
      arrays.diffFilter
    )
    .shouldHaveResult()
)


const delta = processor.process(diffContext)
document.body.innerHTML = JSON.stringify(delta)
