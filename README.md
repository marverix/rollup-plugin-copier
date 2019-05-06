# rollup-plugin-copier

[![Build Status](https://img.shields.io/travis/com/marverix/rollup-plugin-copier/master.svg)](https://travis-ci.com/marverix/rollup-plugin-copier)
[![Current Release](https://img.shields.io/github/release/marverix/rollup-plugin-copier.svg)](releases)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

Simple Rollup.js plugin that copies desired files


## Installation

```
npm install rollup-plugin-copier
```


## Usage

In your `rollup.config.js`:

```js
import copier from 'rollup-plugin-copier';

...

export default [
 {
  // some config
  plugins: [
    copier({
      items: [
        {
          src: 'some/sample/source.file',
          dest: 'will/be/copied.here'
        }
      ]
    })
  ]
 }
];
```

### Options

  * `items`

    **Required**
    
    Array of items that should be copied

    Options for each item:

    * `src`

      **Required**

      Source path

    * `dest`

      **Required**

      Destination path

    * `createPath`

      _Optional, Default `false`_

      If path for destination file doesn't exist - create it.


  * `hookOn`

    _Optional, Default `buildEnd`_

    Which [Rollup.js hook](https://rollupjs.org/guide/en#hooks) should be used.


  * `verbose`

    _Optional, Default `false`_


## Authors

* **Marek Sierociński** - [marverix](https://github.com/marverix)

See also the list of [contributors](https://github.com/marverix/rollup-plugin-copier/contributors)
who participated in this project.


## Thanks

This plugin is heavly inspired by [rollup-plugin-copy](https://github.com/meuter/rollup-plugin-copy)
(created by [meuter](https://github.com/meuter)).


## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
