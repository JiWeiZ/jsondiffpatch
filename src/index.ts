import Processor from './BenjaminDiff/processor'
import options from './options'
import data1 from './data/data1'
import data2 from './data/data2'

import Pipe from './BenjaminDiff/pipe';
import DiffContext from './BenjaminDiff/contexts/diff';

import * as trivial from './BenjaminDiff/filters/trivial';
import * as nested from './BenjaminDiff/filters/nested';
import * as arrays from './BenjaminDiff/filters/arrays';
import * as dates from './BenjaminDiff/filters/dates';
import * as texts from './BenjaminDiff/filters/texts';

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
