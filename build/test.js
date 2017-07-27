'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Testr = function () {
    var __tests = [];

    var Log = function () {
        function Log(isSuccess, message) {
            _classCallCheck(this, Log);

            this.isSuccess = isSuccess;
            this.message = message;
        }

        _createClass(Log, [{
            key: 'output',
            value: function output() {
                if (this.isSuccess) {
                    console.log('SUCCESS: ' + this.message);
                } else {
                    console.log('FAILURE: ' + this.message);
                }
            }
        }]);

        return Log;
    }();

    var Asserter = function () {
        function Asserter() {
            var errors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            _classCallCheck(this, Asserter);

            this.errors = errors;
        }

        _createClass(Asserter, [{
            key: 'equalArr',
            value: function equalArr(a, b) {
                function arraysEqual(arr1, arr2) {
                    if (arr1.length !== arr2.length) return false;
                    for (var i = arr1.length; i--;) {
                        if (arr1[i] !== arr2[i]) return false;
                    }

                    return true;
                }

                if (arraysEqual(a, b)) return true;else this.errors.push(new Error(a + " is not equal to " + b));
            }
        }, {
            key: 'equal',
            value: function equal(a, b) {
                if (a === b) return true;else this.errors.push(new Error(a + " is not equal to " + b));
            }
        }, {
            key: 'notOkay',
            value: function notOkay(a) {
                if (Boolean(a) === false) return true;else this.errors.push(new Error(a + ' is true'));
            }
        }, {
            key: 'okay',
            value: function okay(a) {
                if (Boolean(a)) return true;else this.errors.push(new Error(a + ' is not true'));
            }
        }]);

        return Asserter;
    }();

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
            console.log('END ' + description);
            next();
        }

        __tests.push({
            module: function module(next) {
                return {
                    execute: function execute() {
                        console.log('START ' + description);
                        if (isAsync) {
                            fn(assert, function () {
                                return done(next);
                            });
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
            setList: function setList(v) {
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
    };
}();