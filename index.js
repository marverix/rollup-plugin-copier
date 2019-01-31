const fs = require('fs');

function Copier (options) {
  if (options == null) {
    throw new ReferenceError('options muse be defined!');
  }

  if (options.items == null) {
    throw new ReferenceError('items must be defined!');
  }

  if (!Array.isArray(options.items)) {
    throw new TypeError('items must be an Array!');
  }

  var that = this;

  /**
   * Name of plugin
   * @see {@link https://rollupjs.org/guide/en#name}
   */
  this.name = 'rollup-plugin-copier';

  /**
   * Item to copy
   * @typedef {Object} ToCopy
   * @property {string} src - Source
   * @property {string} dest - Destination
   */

  /**
   * List of items to copy
   * @type {ToCopy[]}
   */
  this._items = options.items;

  /**
   * Verbose flag
   * Set true if you want see what's going on currently. Default false
   * @type boolean
   */
  this._verbose = options.verbose == null ? false : options.verbose;

  /**
   * Hook on
   * Default hook is 'buildOn', but you can change it with this property
   * @type string
   * @see {@link https://rollupjs.org/guide/en#buildEnd}
   */
  this._hookOn = options.hookOn == null? 'buildEnd' : options.hookOn;

  /**
   * Hook
   */
  this[this._hookOn] = function() {
    var promises = that._items.map(function(item) {
      return new Promise(function(resolve, reject) {
        that._debug(`${item.src} → ${item.dest}`);
        fs.copyFile(item.src, item.dest, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
    
    return Promise.all(promises);
  };

  /**
   * Debug
   * @param msg {string}
   * @private
   */
  this._debug = function(msg) {
    if (that._verbose) {
      console.log(`rollup-plugin-copier: ${msg}`); // eslint-disable-line no-console
    }
  };

}

function plugin (options) {
  return new Copier(options);
}

module.exports = plugin;
