# Testr
A small testing library for the browser

### Getting Started

Include the `test.js` file:

```html
  <script src="https://cdn.rawgit.com/kamerontanseli/testr/master/build/test.min.js"></script>
```

Standard Test:
```javascript
  Testr.test('1 + 1 = 2', function(assert){
      assert.equal(1 + 1, 2);
  });
```

Async test:
```javascript
  Testr.test('Async 1 + 1 = 2', function(assert, done){
      setTimeout(function(){
        assert.equal(1 + 1, 3);
        done();
      });
  }, true);
```

Assertion Types:
```javascript
  assert.equalArr([1,2,3], [1,2,3]); // comparison between arrays (not nested)
  assert.equal(2, 2); // strict equal comparison
  assert.notOkay(false); // check if false
  assert.okay(true); // check if true
```

Run tests:
```javascript 
  Testr.start();
````

Output:
```
  START 1 + 1 = 2
  SUCCESS: 1 + 1 = 2
  END 1 + 1 = 2

  START Async 1 + 1 = 2
  FAILURE: Async 1 + 1 = 2 ==> Error: 2 is not equal to 3
  END Async 1 + 1 = 2
```
