import chai from 'chai'
import jsdom from 'jsdom'
import three from 'three'
import chai_json_schema from 'chai-json-schema'
import chaiAsPromised from 'chai-as-promised'


const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
const win = doc.defaultView

global.document = doc
global.window = win
global.THREE = three

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key]
  }
})

chai.use(chai_json_schema)
chai.use(chaiAsPromised)
