const chai = require('chai');
const expect = chai.expect;

const fs = require('fs');

const rollup = require('rollup');
const copier = require('../index');


const TEST_RUN_DIR = 'test/_run';

function clearEnv(path = TEST_RUN_DIR) {
  fs.readdirSync(path).forEach(function(name) {
    var filePath = `${path}/${name}`;
    var stat = fs.statSync(filePath);
    if(stat.isDirectory()) {
      clearEnv(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  });
  fs.rmdirSync(path);
}


describe('rollup-plugin-copier', function() {
  describe('Preparing environment', function () {
    it('Delete previous environment if exists', function() {
      if(fs.existsSync(TEST_RUN_DIR)) {
        clearEnv();
      }
      
      expect(fs.existsSync(TEST_RUN_DIR)).to.be.false;
    });

    it('Creating test run folder', function() {
      fs.mkdirSync(TEST_RUN_DIR);

      expect(fs.existsSync(TEST_RUN_DIR)).to.be.true;
    });

    describe('Creating test run files', function() {
      it('enFile.txt', function() {
        fs.writeFileSync(`${TEST_RUN_DIR}/enFile.txt`, 'Hello');
        expect(fs.existsSync(`${TEST_RUN_DIR}/enFile.txt`)).to.be.true;

        const stat = fs.statSync(`${TEST_RUN_DIR}/enFile.txt`);
        expect(stat.size).to.be.equal(5);
      });

      it('plFile.txt', function() {
        fs.writeFileSync(`${TEST_RUN_DIR}/plFile.txt`, 'Zażółć gęślą jaźń');
        expect(fs.existsSync(`${TEST_RUN_DIR}/plFile.txt`)).to.be.true;

        const stat = fs.statSync(`${TEST_RUN_DIR}/plFile.txt`);
        expect(stat.size).to.be.equal(26);
      });

      it('plFlag.png', function() {
        fs.writeFileSync(`${TEST_RUN_DIR}/plFlag.png`,
          Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAYAAAAEAQMAAACXytwAAAAABGdBTUEAALGPC/xhBQAAAAZQTFRF/wAA////QR00EQAAAA5JREFUCNdj+MPwhwEIAAvYAfmba9pKAAAAAElFTkSuQmCC',
            'base64'
          )
        );
        expect(fs.existsSync(`${TEST_RUN_DIR}/plFlag.png`)).to.be.true;

        const stat = fs.statSync(`${TEST_RUN_DIR}/plFlag.png`);
        expect(stat.size).to.be.equal(105);
      });
    });
  });

  describe('Running tests', function() {

    it('Throws ReferenceError if options are not defined', function() {
      expect(
        copier.bind(rollup)
      ).to.throw(ReferenceError, 'options muse be defined!');
    });

    it('Throws ReferenceError if items are not defined', function() {
      expect(
        copier.bind(rollup, {
          // nothing
        })
      ).to.throw(ReferenceError, 'items must be defined!');
    });

    it('Throws TypeError if items are not an Array', function() {
      expect(
        copier.bind(rollup, {
          items: Math.PI
        })
      ).to.throw(TypeError, 'items must be an Array!');
    });

    describe('Copy single file', function() {
      it('Rollup finished', function() {
        return rollup.rollup({
          input: 'index.js',
          plugins: [
            copier({
              items: [
                {
                  src: `${TEST_RUN_DIR}/enFile.txt`,
                  dest: `${TEST_RUN_DIR}/enFile-test-single.txt`
                }
              ]
            })
          ]
        });
      });

      it('File enFile-test-single.txt exists', function() {
        expect(fs.existsSync(`${TEST_RUN_DIR}/enFile-test-single.txt`)).to.be.true;
      });

      it('Files are the same', function() {
        const buffSrc = fs.readFileSync(`${TEST_RUN_DIR}/enFile.txt`);
        const buffDest = fs.readFileSync(`${TEST_RUN_DIR}/enFile-test-single.txt`);
        expect(buffDest.equals(buffSrc)).to.be.true;
      });
    });

    describe('Copy multiple files', function() {
      it('Rollup finished', function() {
        return rollup.rollup({
          input: 'index.js',
          plugins: [
            copier({
              items: [
                {
                  src: `${TEST_RUN_DIR}/enFile.txt`,
                  dest: `${TEST_RUN_DIR}/enFile-test-multiple.txt`
                },
                {
                  src: `${TEST_RUN_DIR}/plFile.txt`,
                  dest: `${TEST_RUN_DIR}/plFile-test-multiple.txt`
                },
                {
                  src: `${TEST_RUN_DIR}/plFlag.png`,
                  dest: `${TEST_RUN_DIR}/plFlag-test-multiple.png`
                }
              ]
            })
          ]
        });
      });

      it('File enFile-test-multiple.txt exists', function() {
        expect(fs.existsSync(`${TEST_RUN_DIR}/enFile-test-multiple.txt`)).to.be.true;
      });

      it('Files are the same', function() {
        const buffSrc = fs.readFileSync(`${TEST_RUN_DIR}/enFile.txt`);
        const buffDest = fs.readFileSync(`${TEST_RUN_DIR}/enFile-test-multiple.txt`);
        expect(buffDest.equals(buffSrc)).to.be.true;
      });

      it('File plFile-test-multiple.txt exists', function() {
        expect(fs.existsSync(`${TEST_RUN_DIR}/plFile-test-multiple.txt`)).to.be.true;
      });

      it('Files are the same', function() {
        const buffSrc = fs.readFileSync(`${TEST_RUN_DIR}/plFile.txt`);
        const buffDest = fs.readFileSync(`${TEST_RUN_DIR}/plFile-test-multiple.txt`);
        expect(buffDest.equals(buffSrc)).to.be.true;
      });

      it('File plFlag-test-multiple.png exists', function() {
        expect(fs.existsSync(`${TEST_RUN_DIR}/plFlag-test-multiple.png`)).to.be.true;
      });

      it('Files are the same', function() {
        const buffSrc = fs.readFileSync(`${TEST_RUN_DIR}/plFlag.png`);
        const buffDest = fs.readFileSync(`${TEST_RUN_DIR}/plFlag-test-multiple.png`);
        expect(buffDest.equals(buffSrc)).to.be.true;
      });

    });
  });

  describe('createPath flag', function() {
    it('Should not copy file when createPath is not set', function() {
      return new Promise(function(resolve, reject) {
        rollup.rollup({
          input: 'index.js',
          plugins: [
            copier({
              items: [
                {
                  src: `${TEST_RUN_DIR}/enFile.txt`,
                  dest: `${TEST_RUN_DIR}/sub-dir/enFile-test-createPath.txt`
                }
              ]
            })
          ]
        }).then(reject).catch(function(err) {
          expect(err.plugin).to.be.equal('rollup-plugin-copier');
          expect(err.message).to.be.equal("Destination for file test/_run/sub-dir/enFile-test-createPath.txt doesn't exist");
          resolve();
        });
      });
    });

    it('Should not copy file when createPath is set to false', function() {
      return new Promise(function(resolve, reject) {
        rollup.rollup({
          input: 'index.js',
          plugins: [
            copier({
              items: [
                {
                  src: `${TEST_RUN_DIR}/enFile.txt`,
                  dest: `${TEST_RUN_DIR}/sub-dir/enFile-test-createPath.txt`,
                  createPath: false
                }
              ]
            })
          ]
        }).then(reject).catch(function(err) {
          expect(err.plugin).to.be.equal('rollup-plugin-copier');
          expect(err.message).to.be.equal("Destination for file test/_run/sub-dir/enFile-test-createPath.txt doesn't exist");
          resolve();
        });
      });
    });

    it('Should copy file when createPath is set to true', function() {
      return new Promise(function(resolve, reject) {
        rollup.rollup({
          input: 'index.js',
          plugins: [
            copier({
              items: [
                {
                  src: `${TEST_RUN_DIR}/enFile.txt`,
                  dest: `${TEST_RUN_DIR}/sub-dir/enFile-test-createPath.txt`,
                  createPath: true
                }
              ]
            })
          ]
        }).then(function() {
          expect(fs.existsSync(`${TEST_RUN_DIR}/sub-dir/enFile-test-createPath.txt`)).to.be.true;
          const buffSrc = fs.readFileSync(`${TEST_RUN_DIR}/enFile.txt`);
          const buffDest = fs.readFileSync(`${TEST_RUN_DIR}/sub-dir/enFile-test-createPath.txt`);
          expect(buffDest.equals(buffSrc)).to.be.true;
          resolve();
        }).catch(reject);
      });
    });
  });

  describe('Cleaning environment', function() {
    it('Delete environment', function() {
      clearEnv();
      expect(fs.existsSync(TEST_RUN_DIR)).to.be.false;
    });
  });

});
