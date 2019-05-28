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

import {demo1, demo2, demo3, demo4} from './data/demo'

import Context from './bulbdiff/Context'

const processor = new Processor(options)
// const diffContext1 = new DiffContext(data1, data2)
const diffContext2 = new DiffContext(demo1, demo2)
const diffContext3 = new DiffContext(demo3, demo4)
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

// const delta = processor.process(diffContext1)
// const delta = processor.process(diffContext2)
const delta = processor.process(diffContext3)
document.body.innerHTML = JSON.stringify(delta)
