<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

# Sharp

**Parameters**

-   `input` **([Buffer](https://nodejs.org/api/buffer.html) \| [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))?** if present, can be
     a Buffer containing JPEG, PNG, WebP, GIF, SVG, TIFF or raw pixel image data, or
     a String containing the path to an JPEG, PNG, WebP, GIF, SVG or TIFF image file.
     JPEG, PNG, WebP, GIF, SVG, TIFF or raw pixel image data can be streamed into the object when null or undefined.
-   `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)?** if present, is an Object with optional attributes.
    -   `options.density` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** integral number representing the DPI for vector images. (optional, default `72`)
    -   `options.raw` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)?** describes raw pixel image data. See `raw()` for pixel ordering.
        -   `options.raw.width` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** 
        -   `options.raw.height` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** 
        -   `options.raw.channels` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** 

**Examples**

```javascript
sharp('input.jpg')
  .resize(300, 200)
  .toFile('output.jpg', function(err) {
    // output.jpg is a 300 pixels wide and 200 pixels high image
    // containing a scaled and cropped version of input.jpg
  });
```

```javascript
// Read image data from readableStream,
// resize to 300 pixels wide,
// emit an 'info' event with calculated dimensions
// and finally write image data to writableStream
var transformer = sharp()
  .resize(300)
  .on('info', function(info) {
    console.log('Image height is ' + info.height);
  });
readableStream.pipe(transformer).pipe(writableStream);
```

-   Throws **[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)** Invalid parameters

Returns **[Sharp](#sharp)** 

## format

An Object containing nested boolean values representing the available input and output formats/methods.

**Examples**

```javascript
console.log(sharp.format());
```

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

## versions

An Object containing the version numbers of libvips and its dependencies.

**Examples**

```javascript
console.log(sharp.versions);
```

# queue

An EventEmitter that emits a `change` event when a task is either:

-   queued, waiting for _libuv_ to provide a worker thread
-   complete

**Examples**

```javascript
sharp.queue.on('change', function(queueLength) {
  console.log('Queue contains ' + queueLength + ' task(s)');
});
```