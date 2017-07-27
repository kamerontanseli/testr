var Testr = (function () {
    var __tests = [];

    class Log {
        constructor(isSuccess, message) {
            this.isSuccess = isSuccess;
            this.message = message;
        }
        output() {
            if (this.isSuccess) {
                console.log('SUCCESS: ' + this.message);
            } else {
                console.log('FAILURE: ' + this.message);
            }
        }
    }

    class Asserter {
        constructor(errors = []) {
            this.errors = errors;
        }
        equalArr(a, b) {
            function arraysEqual(arr1, arr2) {
                if (arr1.length !== arr2.length)
                    return false;
                for (var i = arr1.length; i--;) {
                    if (arr1[i] !== arr2[i])
                        return false;
                }

                return true;
            }

            if (arraysEqual(a, b)) return true;
            else this.errors.push(new Error(a + " is not equal to " + b));
        }
        equal(a, b) {
            if (a === b) return true;
            else this.errors.push(new Error(a + " is not equal to " + b));
        }
        notOkay(a) {
            if (Boolean(a) === false) return true
            else this.errors.push(new Error(a + ' is true'));
        }
        okay(a) {
            if (Boolean(a)) return true;
            else this.errors.push(new Error(a + ' is not true'));
        }
    }

    function test(description, fn, isAsync) {
        var assert = new Asserter();

        function done(next) {
            if (assert.errors.length === 0) {
                new Log(true, description).output();
            } else {
                assert.errors.forEach(function (err) {
                    new Log(false, description + " ==> " + err).output();
                });
            }
            console.log(`END ${description}`);
            next();
        }

        __tests.push({
            module: function (next) {
                return {
                    execute: function () {
                        console.log(`START ${description}`);
                        if (isAsync) {
                            fn(assert, () => done(next));
                        } else {
                            fn(assert);
                            done(next);
                        }
                    }
                };
            }
        });
    }

    function generator() {
        var index = 0;
        var list = [];

        function hasNext() {
            return index < list.length;
        }

        function next() {
            if (!hasNext()) {
                return null;
            }
            var element = list[index];
            index += 1;
            element.execute();
        }

        return {
            setList: function (v) {
                list = v;
            },
            next: next
        };
    }

    function start() {
        var loop = generator();
        loop.setList(__tests.map(function (test) {
            return test.module(loop.next);
        }));
        loop.next();
    }


    return {
        test: test,
        start: start
    }
})();