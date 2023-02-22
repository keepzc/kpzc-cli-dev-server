'use strict'

module.exports = {
  formatName(name) {
    let _name = name
    if (_name && _name.startsWith('@') && _name.indexOf('/') > 0) {
      // @kpzc-cli-dev/component-test ->
      // kpzc-cli-dev_component-test
      const nameArray = _name.split('/')
      _name = nameArray.join('_').replace('@', '')
    }
    return _name
  }
}
