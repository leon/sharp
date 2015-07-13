'use strict';

var assert = require('assert');

var sharp = require('../../index');
var fixtures = require('../fixtures');

sharp.cache(0);

describe('Rotation', function() {

  it('Rotate by 90 degrees, respecting output input size', function(done) {
    sharp(fixtures.inputJpg).rotate(90).resize(320, 240).toBuffer(function(err, data, info) {
      if (err) throw err;
      assert.strictEqual(true, data.length > 0);
      assert.strictEqual('jpeg', info.format);
      assert.strictEqual(320, info.width);
      assert.strictEqual(240, info.height);
      done();
    });
  });

  it('Input image has Orientation EXIF tag but do not rotate output', function(done) {
    sharp(fixtures.inputJpgWithExif)
      .resize(320)
      .withMetadata()
      .toBuffer(function(err, data, info) {
        if (err) throw err;
        assert.strictEqual(true, data.length > 0);
        assert.strictEqual('jpeg', info.format);
        assert.strictEqual(320, info.width);
        assert.strictEqual(427, info.height);
        sharp(data).metadata(function(err, metadata) {
          assert.strictEqual(8, metadata.orientation);
          done();
        });
      });
  });

  it('Input image has Orientation EXIF tag value of 8 (270 degrees), auto-rotate', function(done) {
    sharp(fixtures.inputJpgWithExif)
      .rotate()
      .resize(320)
      .toBuffer(function(err, data, info) {
        if (err) throw err;
        assert.strictEqual('jpeg', info.format);
        assert.strictEqual(320, info.width);
        assert.strictEqual(240, info.height);
        fixtures.assertSimilar(fixtures.expected('exif-8.jpg'), data, done);
      });
  });

  it('Override EXIF Orientation tag metadata after auto-rotate', function(done) {
    sharp(fixtures.inputJpgWithExif)
      .rotate()
      .resize(320)
      .withMetadata({orientation: 3})
      .toBuffer(function(err, data, info) {
        if (err) throw err;
        assert.strictEqual('jpeg', info.format);
        assert.strictEqual(320, info.width);
        assert.strictEqual(240, info.height);
        sharp(data).metadata(function(err, metadata) {
          assert.strictEqual(3, metadata.orientation);
          fixtures.assertSimilar(fixtures.expected('exif-8.jpg'), data, done);
        });
      });
  });

  it('Input image has Orientation EXIF tag value of 5 (270 degrees + flip), auto-rotate', function(done) {
    sharp(fixtures.inputJpgWithExifMirroring)
      .rotate()
      .resize(320)
      .withMetadata()
      .toBuffer(function(err, data, info) {
        if (err) throw err;
        assert.strictEqual('jpeg', info.format);
        assert.strictEqual(320, info.width);
        assert.strictEqual(240, info.height);
        sharp(data).metadata(function(err, metadata) {
          assert.strictEqual(false, 'orientation' in metadata);
          fixtures.assertSimilar(fixtures.expected('exif-5.jpg'), data, done);
        });
      });
  });

  it('Attempt to auto-rotate using image that has no EXIF', function(done) {
    sharp(fixtures.inputJpg).rotate().resize(320).toBuffer(function(err, data, info) {
      if (err) throw err;
      assert.strictEqual(true, data.length > 0);
      assert.strictEqual('jpeg', info.format);
      assert.strictEqual(320, info.width);
      assert.strictEqual(261, info.height);
      done();
    });
  });

  it('Attempt to auto-rotate image format without EXIF support', function(done) {
    sharp(fixtures.inputGif)
      .rotate()
      .resize(320)
      .jpeg()
      .toBuffer(function(err, data, info) {
        if (err) throw err;
        assert.strictEqual(true, data.length > 0);
        assert.strictEqual('jpeg', info.format);
        assert.strictEqual(320, info.width);
        assert.strictEqual(213, info.height);
        done();
      });
  });

  it('Rotate to an invalid angle, should fail', function() {
    assert.throws(function() {
      sharp(fixtures.inputJpg).rotate(1);
    });
  });

  it('Flip - vertical', function(done) {
    sharp(fixtures.inputJpg)
      .resize(320)
      .flip()
      .withMetadata()
      .toBuffer(function(err, data, info) {
        if (err) throw err;
        assert.strictEqual('jpeg', info.format);
        assert.strictEqual(320, info.width);
        assert.strictEqual(261, info.height);
        sharp(data).metadata(function(err, metadata) {
          if (err) throw err;
          assert.strictEqual(false, 'orientation' in metadata);
          fixtures.assertSimilar(fixtures.expected('flip.jpg'), data, done);
        });
      });
  });

  it('Flop - horizontal', function(done) {
    sharp(fixtures.inputJpg)
      .resize(320)
      .flop()
      .withMetadata()
      .toBuffer(function(err, data, info) {
        if (err) throw err;
        assert.strictEqual('jpeg', info.format);
        assert.strictEqual(320, info.width);
        assert.strictEqual(261, info.height);
        sharp(data).metadata(function(err, metadata) {
          if (err) throw err;
          assert.strictEqual(false, 'orientation' in metadata);
          fixtures.assertSimilar(fixtures.expected('flop.jpg'), data, done);
        });
      });
  });

  it('Flip and flop', function(done) {
    sharp(fixtures.inputJpg)
      .resize(320)
      .flop()
      .toBuffer(function(err, data, info) {
        if (err) throw err;
        assert.strictEqual('jpeg', info.format);
        assert.strictEqual(320, info.width);
        assert.strictEqual(261, info.height);
        fixtures.assertSimilar(fixtures.expected('flip-and-flop.jpg'), data, done);
      });
  });

  it('Neither flip nor flop', function(done) {
    sharp(fixtures.inputJpg)
      .resize(320)
      .flip(false)
      .flop(false)
      .toBuffer(function(err, data, info) {
        if (err) throw err;
        assert.strictEqual('jpeg', info.format);
        assert.strictEqual(320, info.width);
        assert.strictEqual(261, info.height);
        fixtures.assertSimilar(fixtures.inputJpg, data, done);
      });
  });

});
