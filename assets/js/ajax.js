(function () {
  'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  var asyncToGenerator = _asyncToGenerator;

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
  });

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  var arrayLikeToArray = _arrayLikeToArray;

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return arrayLikeToArray(arr);
  }

  var arrayWithoutHoles = _arrayWithoutHoles;

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  var iterableToArray = _iterableToArray;

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
  }

  var unsupportedIterableToArray = _unsupportedIterableToArray;

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var nonIterableSpread = _nonIterableSpread;

  function _toConsumableArray(arr) {
    return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
  }

  var toConsumableArray = _toConsumableArray;

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime_1 = createCommonjsModule(function (module) {
  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }
    try {
      // IE 8 has a broken Object.defineProperty that only works on DOM objects.
      define({}, "");
    } catch (err) {
      define = function(obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunction.displayName = define(
      GeneratorFunctionPrototype,
      toStringTagSymbol,
      "GeneratorFunction"
    );

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        define(prototype, method, function(arg) {
          return this._invoke(method, arg);
        });
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;

      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList),
        PromiseImpl
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    define(Gp, toStringTagSymbol, "Generator");

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function() {
      return this;
    };

    Gp.toString = function() {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    module.exports 
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
  });

  var regenerator = runtime_1;

  const wait = (amount = 0) => new Promise(resolve => setTimeout(resolve, amount));

  var waait = wait;

  /**
   * TEMPORARY FIX
   * Must delete this file and import moveTo from node_modules when package is updated
   */

  var MoveTo = function () {
    /**
     * Defaults
     *
     * @type {Object}
     */
    var defaults = {
      tolerance: 0,
      duration: 800,
      easing: 'easeOutQuart',
      container: window,
      callback: function callback() {}
    };
    /**
     * easeOutQuart Easing Function
     *
     * @param  {number} t - current time
     * @param  {number} b - start value
     * @param  {number} c - change in value
     * @param  {number} d - duration
     * @return {number} - calculated value
     */

    function easeOutQuart(t, b, c, d) {
      t /= d;
      t--;
      return -c * (t * t * t * t - 1) + b;
    }
    /**
     * Merge two object
     *
     * @param  {Object} obj1
     * @param  {Object} obj2
     * @return {Object} merged object
     */


    function mergeObject(obj1, obj2) {
      var obj3 = {};
      Object.keys(obj1).forEach(function (propertyName) {
        obj3[propertyName] = obj1[propertyName];
      });
      Object.keys(obj2).forEach(function (propertyName) {
        obj3[propertyName] = obj2[propertyName];
      });
      return obj3;
    }
    /**
     * Converts camel case to kebab case
     *
     * @param  {string} val the value to be converted
     * @return {string} the converted value
     */


    function kebabCase(val) {
      return val.replace(/([A-Z])/g, function ($1) {
        return '-' + $1.toLowerCase();
      });
    }
    /**
     * Count a number of item scrolled top
     *
     * @param  {Window|HTMLElement} container
     * @return {number}
     */


    function countScrollTop(container) {
      if (container instanceof HTMLElement) {
        return container.scrollTop;
      }

      return container.pageYOffset;
    }
    /**
     * MoveTo Constructor
     *
     * @param {Object} options Options
     * @param {Object} easeFunctions Custom ease functions
     */


    function MoveTo() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var easeFunctions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.options = mergeObject(defaults, options);
      this.easeFunctions = mergeObject({
        easeOutQuart: easeOutQuart
      }, easeFunctions);
    }
    /**
     * Register a dom element as trigger
     *
     * @param  {HTMLElement} dom Dom trigger element
     * @param  {Function} callback Callback function
     * @return {Function | void} unregister function
     */


    MoveTo.prototype.registerTrigger = function (dom, callback) {
      var _this = this;

      if (!dom) {
        return;
      }

      var href = dom.getAttribute('href') || dom.getAttribute('data-target'); // The element to be scrolled

      var target = href && href !== '#' ? document.getElementById(href.substring(1)) : document.body;
      var options = mergeObject(this.options, _getOptionsFromTriggerDom(dom, this.options));

      if (typeof callback === 'function') {
        options.callback = callback;
      }

      var listener = function listener(e) {
        e.preventDefault();

        _this.move(target, options);
      };

      dom.addEventListener('click', listener, false);
      return function () {
        return dom.removeEventListener('click', listener, false);
      };
    };
    /**
     * Move
     * Scrolls to given element by using easeOutQuart function
     *
     * @param  {HTMLElement|number} target Target element to be scrolled or target position
     * @param  {Object} options Custom options
     */


    MoveTo.prototype.move = function (target) {
      var _this2 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (target !== 0 && !target) {
        return;
      }

      options = mergeObject(this.options, options);
      var containerDistance = options.container === window ? target.getBoundingClientRect().top : target.getBoundingClientRect().top - options.container.getBoundingClientRect().top;
      var distance = typeof target === 'number' ? target : containerDistance;
      var from = countScrollTop(options.container);
      var startTime = null;
      var lastYOffset;
      distance -= options.tolerance; // rAF loop

      var loop = function loop(currentTime) {
        var currentYOffset = countScrollTop(_this2.options.container);

        if (!startTime) {
          // To starts time from 1, we subtracted 1 from current time
          // If time starts from 1 The first loop will not do anything,
          // because easing value will be zero
          startTime = currentTime - 1;
        }

        var timeElapsed = currentTime - startTime;

        if (lastYOffset) {
          if (distance > 0 && lastYOffset > currentYOffset || distance < 0 && lastYOffset < currentYOffset) {
            return options.callback(target);
          }
        }

        lastYOffset = currentYOffset;

        var val = _this2.easeFunctions[options.easing](timeElapsed, from, distance, options.duration);

        options.container.scroll(0, val);

        if (timeElapsed < options.duration) {
          window.requestAnimationFrame(loop);
        } else {
          options.container.scroll(0, distance + from);
          options.callback(target);
        }
      };

      window.requestAnimationFrame(loop);
    };
    /**
     * Adds custom ease function
     *
     * @param {string}   name Ease function name
     * @param {Function} fn   Ease function
     */


    MoveTo.prototype.addEaseFunction = function (name, fn) {
      this.easeFunctions[name] = fn;
    };
    /**
     * Returns options which created from trigger dom element
     *
     * @param  {HTMLElement} dom Trigger dom element
     * @param  {Object} options The instance's options
     * @return {Object} The options which created from trigger dom element
     */


    function _getOptionsFromTriggerDom(dom, options) {
      var domOptions = {};
      Object.keys(options).forEach(function (key) {
        var value = dom.getAttribute('data-mt-'.concat(kebabCase(key)));

        if (value) {
          domOptions[key] = isNaN(value) ? value : parseInt(value, 10);
        }
      });
      return domOptions;
    }

    return MoveTo;
  }(); // if (typeof module !== 'undefined') {

  /**
   * Slider prototype definition
   *
   * @param {HTMLElement} slider Where our slider will be created.
   * @param {boolean} scroll Have the slides a hi-res scrollable version?
   * @param {boolean} lightbox Have we just one slide?
   */

  function Slider(slider) {
    var _this = this;

    var scroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var lightbox = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!(slider instanceof Element)) {
      throw new Error('No slider passed in');
    } // select the elements needed for the slider


    this.slides = slider.querySelector('.slides');
    this.totalSlides = this.slides.childElementCount;
    this.slider = slider;
    this.scroll = scroll;
    this.lightbox = lightbox; // Handle slides < 4 cases

    if (this.totalSlides === 1) {
      // If there is only one slide
      // then there's nothing to slide
      this.lightbox = true;
    } else if (this.totalSlides < 4) {
      // Slider doesn't look great with less than 4 slides
      // so we duplicate them
      Array.from(this.slides.children).forEach(function (child) {
        return _this.slides.append(child.cloneNode(true));
      });
    } // Create navigation buttons


    if (this.lightbox === false) {
      slider.insertAdjacentHTML('beforeend', "<button class=\"previous-slide\"><</button><button class=\"next-slide\">></button>");
    }

    var prevButton = slider.querySelector('.previous-slide');
    var nextButton = slider.querySelector('.next-slide');
    this.prevButton = prevButton;
    this.nextButton = nextButton; // when this slider is created, run the start slider function

    this.startSlider();
    this.applyClasses();
    this.scroll && this.scrollImage();

    if (this.prevButton || this.nextButton) {
      this.handleButtonState();
    } // requestAnimationFrame(this.autoplay);
    // Event listeners


    this.prevButton && this.prevButton.addEventListener('click', function () {
      return _this.move('back');
    });
    this.nextButton && this.nextButton.addEventListener('click', function () {
      return _this.move();
    });
  }

  Slider.prototype.startSlider = function () {
    this.current = this.slider.querySelector('.current') || this.slides.firstElementChild;

    if (this.lightbox === false) {
      this.prev = this.current.previousElementSibling || this.slides.lastElementChild;
      this.next = this.current.nextElementSibling || this.slides.firstElementChild;
    }
  };

  Slider.prototype.applyClasses = function () {
    this.current.classList.add('current');

    if (this.lightbox === false) {
      this.prev.classList.add('prev');
      this.next.classList.add('next');
    }
  };

  Slider.prototype.move = function (direction) {
    var _this$prev$classList, _this$current$classLi, _this$next$classList;

    if (this.lightbox) return; // first strip all the classes off the current slides

    var classesToRemove = ['prev', 'current', 'next'];

    (_this$prev$classList = this.prev.classList).remove.apply(_this$prev$classList, classesToRemove);

    (_this$current$classLi = this.current.classList).remove.apply(_this$current$classLi, classesToRemove);

    (_this$next$classList = this.next.classList).remove.apply(_this$next$classList, classesToRemove);

    if (direction === 'back') {
      // make an new array of the new values, and destructure them over and into the prev, current and next variables
      var _ref = [// get the prev slide, if there is none, get the last slide from the entire slider for wrapping
      this.prev.previousElementSibling || this.slides.lastElementChild, this.prev, this.current];
      this.prev = _ref[0];
      this.current = _ref[1];
      this.next = _ref[2];
    } else {
      var _ref2 = [this.current, this.next, // get the next slide, or if it's at the end, loop around and grab the first slide
      this.next.nextElementSibling || this.slides.firstElementChild];
      this.prev = _ref2[0];
      this.current = _ref2[1];
      this.next = _ref2[2];
    }

    this.applyClasses();
    this.scroll && this.scrollImage();
    this.handleButtonState();
  };

  Slider.prototype.handleButtonState = function () {
    if (this.current.dataset.index === this.totalSlides.toString()) {
      this.nextButton.setAttribute('disabled', true);
      this.prevButton.removeAttribute('disabled');
    } else if (this.current.dataset.index === '1') {
      this.prevButton.setAttribute('disabled', true);
      this.nextButton.removeAttribute('disabled');
    } else {
      [this.prevButton, this.nextButton].forEach(function (button) {
        return button.removeAttribute('disabled');
      });
    }
  };

  Slider.prototype.scrollImage = function () {
    if (this.lightbox === false) {
      [this.next, this.prev].forEach(function (slide) {
        slide.removeEventListener('mouseenter', enterHandler, false);
        slide.removeEventListener('mouseleave', leaveHandler, false);
        slide.removeEventListener('mousemove', moveHandler, false);
        slide.removeEventListener('touchstart', touchStartHandler, false);
        slide.removeEventListener('touchend', touchEndHandler, false);
        slide.removeEventListener('touchmove', touchMoveHandler, false);
        slide.removeEventListener('touchcancel', touchCancelHandler, false);
      });
    }

    this.current.addEventListener('mouseenter', enterHandler, false);
    this.current.addEventListener('mouseleave', leaveHandler, false);
    this.current.addEventListener('mousemove', moveHandler, false);
    this.current.addEventListener('touchstart', touchStartHandler, false);
    this.current.addEventListener('touchmove', touchMoveHandler, false);
    this.current.addEventListener('touchend', touchEndHandler, false);
    this.current.addEventListener('touchcancel', touchCancelHandler, false);
  };
  /**
   * Create an image asynchronously
   *
   * @param {string} src Our image url
   * @return {Promise} A promise of a new image HTMLElement
   */


  function asyncCreateImage(_x) {
    return _asyncCreateImage.apply(this, arguments);
  }
  /**
   * Returns computed image coordinates based on cursor/touch and image and screen sizes.
   *
   * @param {Object} imageSize - Image dimensions - { imageWidth, imageHeight }
   * @param {Object} cursorPosition - Cursor / touch coordinates { cursorX, cursorY }
   * @return {Object} Image coordinates { imageX, imageY }
   */


  function _asyncCreateImage() {
    _asyncCreateImage = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(src) {
      return regenerator.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt("return", new Promise(function (resolve, reject) {
                var img = new Image();

                img.onload = function () {
                  return resolve(img);
                };

                img.onerror = reject;
                img.src = src;
              }));

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _asyncCreateImage.apply(this, arguments);
  }

  function imagePosition(imageSize, cursorPosition) {
    var _window = window,
        windowWidth = _window.innerWidth,
        windowHeight = _window.innerHeight;
    var imageWidth = imageSize.imageWidth,
        imageHeight = imageSize.imageHeight;
    var cursorX = cursorPosition.cursorX,
        cursorY = cursorPosition.cursorY;
    imageWidth = imageWidth < windowWidth ? windowWidth : imageWidth;
    imageHeight = imageHeight < windowHeight ? windowHeight : imageHeight;
    var imageX = Math.floor((imageWidth - windowWidth) * cursorX / windowWidth) * -1;
    var imageY = Math.floor((imageHeight - windowHeight) * cursorY / windowHeight) * -1;
    return {
      imageX: imageX,
      imageY: imageY
    };
  }

  var enterHandler = /*#__PURE__*/function () {
    var _ref3 = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(event) {
      var target, hiResImage, imageWidth, imageHeight, _window2, windowWidth, windowHeight, cursorX, cursorY, hiResContainer, _imagePosition, imageX, imageY;

      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              target = event.currentTarget;

              if (!target.classList.contains('active-scroll')) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return");

            case 3:
              if (!target.querySelector('.slide__hi-res')) {
                _context.next = 9;
                break;
              }

              target.querySelector('img').style.opacity = '1';
              target.querySelector('.slide__hi-res').style.opacity = '0';
              _context.next = 8;
              return waait(300);

            case 8:
              target.removeChild(target.querySelector('.slide__hi-res'));

            case 9:
              _context.next = 11;
              return asyncCreateImage(target.querySelector('img').dataset.full);

            case 11:
              hiResImage = _context.sent;
              imageWidth = hiResImage.naturalWidth, imageHeight = hiResImage.naturalHeight;
              _window2 = window, windowWidth = _window2.innerWidth, windowHeight = _window2.innerHeight;
              cursorX = event.clientX, cursorY = event.clientY; // Check if hi-res image is bigger than screen size

              if (imageWidth > windowWidth || imageHeight > windowHeight) {
                // Add active state class
                event.target.classList.add('active-scroll'); // Create a container for hi-res image

                hiResContainer = document.createElement('div');
                hiResContainer.classList.add('slide__hi-res');
                hiResContainer.style.width = "".concat(hiResImage.width, "px");
                hiResContainer.style.height = "".concat(hiResImage.height, "px");
                hiResContainer.style.opacity = '0';
                hiResContainer.style.setProperty('--hires-width', "".concat(hiResImage.width, "px"));
                event.target.appendChild(hiResContainer); // Set image position based on touch coordinates

                _imagePosition = imagePosition({
                  imageWidth: imageWidth,
                  imageHeight: imageHeight
                }, {
                  cursorX: cursorX,
                  cursorY: cursorY
                }), imageX = _imagePosition.imageX, imageY = _imagePosition.imageY;
                hiResImage.style.transform = "translate(".concat(imageX, "px, ").concat(imageY, "px)"); // Add width and height to hi-res image

                hiResImage.style.width = "".concat(hiResImage.width, "px");
                hiResImage.style.height = "".concat(hiResImage.height, "px");
                hiResImage.style.transitiion = "transform .2s ease-in-out";
                hiResContainer.appendChild(hiResImage);
                setTimeout(function () {
                  hiResContainer.style.opacity = '1';
                  target.querySelector('img').style.opacity = '0';
                }, 100);
              }

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function enterHandler(_x2) {
      return _ref3.apply(this, arguments);
    };
  }();

  var touchStartHandler = /*#__PURE__*/function () {
    var _ref4 = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(event) {
      var target, hiResImage, imageWidth, imageHeight, _window3, windowWidth, windowHeight, _event$changedTouches, cursorX, cursorY, hiResContainer, _imagePosition2, imageX, imageY;

      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              event.preventDefault();
              target = event.currentTarget;

              if (!target.classList.contains('active-scroll')) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt("return");

            case 4:
              if (!target.querySelector('.slide__hi-res')) {
                _context2.next = 10;
                break;
              }

              target.querySelector('img').style.opacity = '1';
              target.querySelector('.slide__hi-res').style.opacity = '0';
              _context2.next = 9;
              return waait(300);

            case 9:
              target.removeChild(target.querySelector('.slide__hi-res'));

            case 10:
              _context2.next = 12;
              return asyncCreateImage(target.querySelector('img').dataset.full);

            case 12:
              hiResImage = _context2.sent;
              imageWidth = hiResImage.naturalWidth, imageHeight = hiResImage.naturalHeight;
              _window3 = window, windowWidth = _window3.innerWidth, windowHeight = _window3.innerHeight;
              _event$changedTouches = event.changedTouches[0], cursorX = _event$changedTouches.clientX, cursorY = _event$changedTouches.clientY; // Check if hi-res image is bigger than screen size

              if (imageWidth > windowWidth || imageHeight > windowHeight) {
                // Add active state class
                target.classList.add('active-scroll'); // Create a container for hi-res image

                hiResContainer = document.createElement('div');
                hiResContainer.classList.add('slide__hi-res');
                hiResContainer.style.width = "".concat(hiResImage.width, "px");
                hiResContainer.style.height = "".concat(hiResImage.height, "px");
                hiResContainer.style.opacity = '0';
                hiResContainer.style.setProperty('--hires-width', "".concat(hiResImage.width, "px"));
                target.appendChild(hiResContainer); // Set image position based on touch coordinates

                _imagePosition2 = imagePosition({
                  imageWidth: imageWidth,
                  imageHeight: imageHeight
                }, {
                  cursorX: cursorX,
                  cursorY: cursorY
                }), imageX = _imagePosition2.imageX, imageY = _imagePosition2.imageY;
                hiResImage.style.transform = "translate(".concat(imageX, "px, ").concat(imageY, "px)"); // Add width and height to hi-res image

                hiResImage.style.width = "".concat(hiResImage.width, "px");
                hiResImage.style.height = "".concat(hiResImage.height, "px");
                hiResContainer.appendChild(hiResImage);
                setTimeout(function () {
                  return hiResContainer.style.opacity = '1';
                }, 100);
              }

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function touchStartHandler(_x3) {
      return _ref4.apply(this, arguments);
    };
  }();

  var leaveHandler = /*#__PURE__*/function () {
    var _ref5 = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(event) {
      var target, hiResContainer;
      return regenerator.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              target = event.currentTarget; // Check if there is an active scrollable image

              if (!target.classList.contains('active-scroll')) {
                _context3.next = 8;
                break;
              }

              hiResContainer = target.querySelector('.slide__hi-res'); // Fade out hi-res image

              hiResContainer.style.opacity = '0';
              target.querySelector('img').style.opacity = '1'; // wait a little

              _context3.next = 7;
              return waait(300);

            case 7:
              try {
                // Remove scrollable image
                target.removeChild(hiResContainer); // Remove active state class

                target.classList.remove('active-scroll');
              } catch (error) {// Fail silently
              }

            case 8:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function leaveHandler(_x4) {
      return _ref5.apply(this, arguments);
    };
  }();

  var touchEndHandler = /*#__PURE__*/function () {
    var _ref6 = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(event) {
      var target, hiResContainer;
      return regenerator.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              event.preventDefault();
              target = event.currentTarget; // Check if there is an active scrollable image

              if (!target.classList.contains('active-scroll')) {
                _context4.next = 8;
                break;
              }

              hiResContainer = target.querySelector('.slide__hi-res'); // Fade out hi-res image

              hiResContainer.style.opacity = '0'; // wait a little

              _context4.next = 7;
              return waait(300);

            case 7:
              try {
                // Remove scrollable image
                target.removeChild(hiResContainer); // Remove active state class

                target.classList.remove('active-scroll');
              } catch (error) {// Fail silently
              }

            case 8:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function touchEndHandler(_x5) {
      return _ref6.apply(this, arguments);
    };
  }();

  var moveHandler = function moveHandler(event) {
    // Check if there is an active scrollable image
    var target = event.currentTarget;

    if (target.classList.contains('active-scroll')) {
      var hiResImage = target.querySelector('.slide__hi-res img');
      var cursorX = event.clientX,
          cursorY = event.clientY;
      var imageWidth = hiResImage.naturalWidth,
          imageHeight = hiResImage.naturalHeight; // Set image position based on touch coordinates

      var _imagePosition3 = imagePosition({
        imageWidth: imageWidth,
        imageHeight: imageHeight
      }, {
        cursorX: cursorX,
        cursorY: cursorY
      }),
          imageX = _imagePosition3.imageX,
          imageY = _imagePosition3.imageY;

      hiResImage.style.transform = "translate(".concat(imageX, "px, ").concat(imageY, "px)");
    }
  };

  var touchMoveHandler = function touchMoveHandler(event) {
    event.preventDefault();
    var target = event.currentTarget; // Check if there is an active scrollable image

    if (target.classList.contains('active-scroll')) {
      var hiResImage = target.querySelector('.slide__hi-res img');
      var _event$changedTouches2 = event.changedTouches[0],
          cursorX = _event$changedTouches2.clientX,
          cursorY = _event$changedTouches2.clientY;
      var imageWidth = hiResImage.naturalWidth,
          imageHeight = hiResImage.naturalHeight;

      var _imagePosition4 = imagePosition({
        imageWidth: imageWidth,
        imageHeight: imageHeight
      }, {
        cursorX: cursorX,
        cursorY: cursorY
      }),
          imageX = _imagePosition4.imageX,
          imageY = _imagePosition4.imageY;

      hiResImage.style.transform = "translate(".concat(imageX, "px, ").concat(imageY, "px)");
    }
  };

  var touchCancelHandler = function touchCancelHandler(event) {
    event.preventDefault();
    console.log('touch event cancelled');
  };

  function asyncFetch(_x, _x2) {
    return _asyncFetch.apply(this, arguments);
  }
  /**
   * A helper function to create asyncFetch options.
   *
   * @param {string} nonce The nonce set up in php.
   * @param {string} method Fetch method, defaults to 'get'.
   * @return {Object} An options object
   */


  function _asyncFetch() {
    _asyncFetch = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(url, options) {
      var response, responseJSON;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fetch(url, options);

            case 2:
              response = _context.sent;
              responseJSON = response.ok ? response.json() : '';
              return _context.abrupt("return", responseJSON);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _asyncFetch.apply(this, arguments);
  }

  /**
   * Get the computed size of an element
   *
   * @param {HTMLElement} element - html element
   * @return {number} element computed height
   */


  function getHeight(element) {
    return element.offsetHeight;
  }

  function HandleScroll() {
    this.body = document.querySelector('body');
    this.scrollPosition = 0;
  }

  HandleScroll.prototype.enable = function () {
    // Store current scroll position
    this.scrollPosition = window.pageYOffset;
    this.body.style.overflow = 'hidden';
    this.body.style.position = 'fixed';
    this.body.style.top = "calc(".concat(this.scrollPosition, "px * -1 + var(--wp-admin-bar, 0px))");
    this.body.style.width = 'calc(100% - var(--scrollbar-width, 11px))';
  };

  HandleScroll.prototype.disable = function () {
    this.body.style.removeProperty('overflow');
    this.body.style.removeProperty('position');
    this.body.style.removeProperty('top');
    this.body.style.removeProperty('width'); // Restore scropp position

    window.scrollTo(0, this.scrollPosition);
  };

  function artworksList(artworks, lang) {
    var html = '';

    if (_typeof_1(artworks) === 'object' && artworks.length >= 1) {
      html += "\n\t\t".concat(lang === "es" ? "<h2>Obras</h2>" : "<h2>Artworks</h2>", "\n\t\t<ul class=\"artworks__list\">\n\t\t");
      artworks.forEach(function (element) {
        var _element$artwork_tech = element.artwork_techniques,
            featuredTechniques = _element$artwork_tech.featured_techniques,
            otherTechniques = _element$artwork_tech.other_techniques;
        html += "\n\t\t\t<li class=\"artwork\" key=\"artwork-".concat(element.slug, "\">\n\t\t\t\t<h3 class=\"artwork__title\"><button>").concat(element.title.rendered, "</button></h3>\n\t\t\t\t<div class=\"artwork__info\">\n\t\t\t\t\t").concat(element.artwork_image_src ? "<div class=\"artwork__thumbnail\"><button type=\"button\" data-artwork=\"".concat(element.id, "\">").concat(element.artwork_image_src, "</button></div>") : '', "\n\t\t\t\t\t<div class=\"artwork__year\">").concat(element.bp_artwork_year, "</div>\n\t\t\t\t\t<div class=\"artwork__copy\">").concat(element.bp_artwork_copy, "</div>\n\t\t\t\t\t").concat(element.bp_artwork_size_image && "<div class=\"artwork__size-image\">".concat(element.bp_artwork_size_image, "</div>"), "\n\t\t\t\t\t<div class=\"artwork__size-sheet\">").concat(element.bp_artwork_size, "</div>\n\t\t\t\t\t<div class=\"artwork__paper\">").concat(element.bp_artwork_paper, "</div>\n\t\t\t\t\t<div class=\"artwork__condition\">").concat(element.bp_artwork_condition, "</div>\n\t\t\t\t\t").concat(element.artwork_info ? "<div class=\"artwork__description\">".concat(element.artwork_info, "</div>") : '', "\n\t\t\t\t\t<div class=\"artwork__techniques\">\n\t\t\t\t\t\t").concat(featuredTechniques.map(function (technique) {
          return "<a class=\"technique\" href=\"".concat(technique[1], "\">").concat(technique[0], "</a>");
        }).join('\n'), "\n\t\t\t\t\t\t").concat(otherTechniques && "<span>".concat(otherTechniques, "</span>"), "\n\t\t\t\t\t</div>\n\t\t\t\t\t").concat(element.artwork_loan ? "<div class=\"artwork__loan\"><a href=\"mailto:arte@britaprinzarte.com\">".concat(element.artwork_loan, "</a></div>") : '', "\n\t\t\t\t\t").concat(element.artwork_sale ? "<div class=\"artwork__sale\"><a href=\"mailto:arte@britaprinzarte.com\">".concat(element.artwork_sale, "</a></div>") : '', "\n\t\t\t\t</div>\n\t\t\t</li>\n\t\t\t");
      });
      html += '</ul>';
    } else {
      html = artworks;
    }

    return html;
  }

  function setCollectionHeaderHeight() {
    var collectionHeader = document.querySelector('.collection__header');
    document.documentElement.style.setProperty('--collection-header-height', "".concat(getHeight(collectionHeader), "px"));
  }

  setCollectionHeaderHeight();
  window.addEventListener('resize', setCollectionHeaderHeight);
  var _ajax_var = ajax_var,
      nonce = _ajax_var.nonce;
  var _ajax_var2 = ajax_var,
      lang = _ajax_var2.lang,
      searchUrl = _ajax_var2.searchUrl,
      artistId = _ajax_var2.artistId;
  var headers = new Headers({
    'Content-Type': 'application/json',
    'X-WP-Nonce': nonce
  });
  var fetchOptions = {
    method: 'get',
    headers: headers,
    credentials: 'same-origin'
  };
  var searchInput = document.querySelector('.artist-search');
  var artistsList = document.querySelector('.artists__list');
  var groupObserver = new IntersectionObserver(initialsCallback, {
    rootMargin: '0px 0px 0px 0px',
    root: artistsList,
    threshold: 0.5
  });
  var artworks = document.querySelector('.artworks');
  var artworkGallery = document.querySelector('.artwork-gallery');
  var handleScroll = new HandleScroll();
  artworkGallery.querySelector('.artwork-gallery__close button').addEventListener('click', function () {
    artworkGallery.classList.toggle('hidden');
    document.body.classList.toggle('no-scroll');
    handleScroll.disable();
  });
  var artworkSlider = artworkGallery.querySelector('.artwork-gallery__slider');
  var initialButtons = document.querySelectorAll('.initial__button'); // Scroll to selected initial group on click

  initialButtons.forEach(function (initial) {
    var moveTo = new MoveTo({
      tolerance: 10,
      duration: 500,
      easing: 'easeOutQuart',
      container: artistsList
    });
    initial.addEventListener('click', function () {
      var target = initial.dataset.target;
      var scrollTo = document.querySelector("[data-initial=".concat(target.toLowerCase(), "]"));
      moveTo.move(scrollTo);
    });
  });
  /**
   * Callback function for groupObserver observer
   * Highlights the intersecting group's initial on initials container
   *
   * @param {Array} entries - Array of intersection entries
   */

  function initialsCallback(entries) {
    entries.forEach(function (entry) {
      var initial = document.querySelector(".initial__button[data-target*=".concat(entry.target.dataset.initial, "]"));

      if (initial) {
        if (initial && entry.intersectionRatio >= 0.5) {
          initial.dataset.active = true;
        } else {
          initial.dataset.active = false;
        }
      }
    });
  }
  /**
   * Displays info and artworks from the artist on which the user clicked
   *
   * @param {Event} event - The event which triggers the function
   * @param {Object} ajax - data object from PHP
   * @param {HTMLElement} target - HTML target element
   * @param {string} currentLang - Language code
   * @param {Object} options - Request options object
   * @param {number} id - An optional artist id
   */


  var artistArtworks = function artistArtworks(event, ajax, target, currentLang, options) {
    var id = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
    var artist;

    if (id) {
      artist = id;
    } else {
      event.preventDefault();
      artist = event.target.dataset.artist;
    }

    var artworksUrl = "".concat(ajax.artworkUrl, "?artist=").concat(artist, "&order=asc&orderby=slug");
    var artistUrl = "".concat(ajax.artistUrl, "/").concat(artist);
    target.innerHTML = ''; // empty artworks container

    target.dataset.state = 'loading';
    var collection = document.querySelector('.collection');
    collection.dataset.state = 'opening';

    var artistsButtons = toConsumableArray(document.querySelectorAll('.artist__button'));

    artistsButtons.forEach(function (buttonToDisable) {
      buttonToDisable.setAttribute('disabled', '');
    }); // Fetch artworks asynchronously

    asyncFetch(artworksUrl, options).then(function (jsonResponse) {
      var html = artworksList(jsonResponse, currentLang);
      target.insertAdjacentHTML('beforeend', html);
      var artworkList = document.querySelectorAll('.artworks__list .artwork');
      var artworksThumbnails = document.querySelectorAll('.artwork__thumbnail button'); // Toggles artwork info visibility

      artworkList.forEach(function (artwork) {
        var artworkInfo = artwork.querySelector('.artwork__info');
        var artworkTitle = artwork.querySelector('.artwork__title button');
        artworkTitle.addEventListener('click', function (artworkEvent) {
          artworkInfo.classList.toggle('visible');
          artwork.classList.toggle('open');
        });
      }); // Shows artwork detailed images when thumbnail is clicked

      artworksThumbnails.forEach(function (thumbnail) {
        thumbnail.addEventListener('click', function (thumbnailEvent) {
          artworkGallery.classList.replace('hidden', 'visible');
          document.body.classList.toggle('no-scroll');
          handleScroll.enable();
          var artwork = thumbnailEvent.currentTarget.dataset.artwork;

          if (jsonResponse.some(function (item) {
            return item.id === parseInt(artwork);
          })) {
            artworkSlider.innerHTML = '';
            var slidesContainer = document.createElement('div');
            slidesContainer.classList.add('slides');
            artworkSlider.insertAdjacentElement('afterbegin', slidesContainer);
            var slides = jsonResponse.filter(function (item) {
              return item.id === parseInt(artwork);
            })[0].artwork_image_gallery; // We create and add every slide

            slides.forEach(function (slide, slideIndex) {
              slidesContainer.insertAdjacentHTML('beforeend', "\n\t\t\t\t\t\t\t\t<figure class=\"slide\" data-index=\"".concat(slideIndex + 1, "\">\n\t\t\t\t\t\t\t\t\t").concat(slide.image, "\n\t\t\t\t\t\t\t\t\t").concat(jsonResponse[0].bp_artwork_multiple_artists ? "<figcaption>".concat(slide.caption, "</figcaption>") : "", "\n\t\t\t\t\t\t\t\t</figure>\n\t\t\t\t\t\t"));
            }); // Then create or slider or lightbox

            new Slider(artworkSlider, true);
            artworkGallery.querySelector('.slides').addEventListener('click', function () {
              artworkGallery.classList.toggle('hidden');
              document.body.classList.toggle('no-scroll');
              handleScroll.disable();
            });
          }
        });
      });
    }).then(function () {
      return target.dataset.state = 'loaded';
    }).then(function () {
      return artistsButtons.forEach(function (buttonToEnable) {
        buttonToEnable.removeAttribute('disabled');
      });
    }); // Fetch artist info asynchronously

    asyncFetch(artistUrl, options).then(function (jsonResponse) {
      var html;
      var name = jsonResponse.name,
          artistBio = jsonResponse.artist_bio;

      if (_typeof_1(jsonResponse) === 'object') {
        html = "\n\t\t\t\t<button class=\"artworks__return return-button\"><</button>\n\t\t\t\t<div class=\"artworks__artist\">\n\t\t\t\t\t<h1 class=\"artist__name\">".concat(name, "</h1>\n\t\t\t\t\t").concat(artistBio ? "<div class=\"artist__bio\">".concat(artistBio, "</div>") : '', "\n\t\t\t\t</div>\n\t\t\t\t");
      } else {
        html = artist;
      }

      target.insertAdjacentHTML('afterbegin', html); // button event listener => go back

      var returnButton = target.querySelector('.artworks__return');
      returnButton.addEventListener('click', /*#__PURE__*/function () {
        var _ref = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(event) {
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  collection.dataset.state = 'closed';
                  target.dataset.state = 'unloading';
                  document.querySelector('button.artist__button[data-active=true]').dataset.active = false;
                  _context.next = 5;
                  return waait(500);

                case 5:
                  target.dataset.state = 'unloaded';
                  target.innerHTML = '';

                case 7:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }).then(function () {
      if (id) {
        document.querySelector("button[data-artist=\"".concat(id, "\"]")).dataset.active = true;
        collection.dataset.state = 'open';
      }
    });
  };
  /**
   * Displays a list of Artists filtered by name
   *
   * @param {string} url - The REST endpoint url
   * @param {Object} options - Request options object
   * @param {HTMLElement} target - HTML target element
   * @param {string|null} currentLang - Current language on the front end. Needed to fix REST URLs when user is logged in. 🤷 blame WPML developers, not me
   */


  var filterArtists = function filterArtists(url, options, target, currentLang) {
    var fixedUrl = "".concat(currentLang ? "".concat(url, "?lang=").concat(currentLang) : "".concat(url));
    target.dataset.state = 'loading';
    asyncFetch(fixedUrl, options).then(function (jsonResponse) {
      target.innerHTML = '';

      if (Array.isArray(jsonResponse)) {
        // Create an a array of unique 'order name' initials
        // temporary fix
        // trimmed order field whitespaces & resorted
        // must sanitize fields on backend instead
        var initialsSet = new Set(jsonResponse.map(function (item) {
          return item.order.trim()[0].toLowerCase();
        }).sort());

        var initials = toConsumableArray(initialsSet); // Create a group for every initial


        initials.forEach(function (initial) {
          var group = document.createElement('div');
          group.classList.add('artists-group');
          group.dataset.initial = initial;
          group.insertAdjacentHTML('afterbegin', "\n\t\t\t\t\t\t\t<span class=\"artists-group__label\">".concat(initial, "</span>\n\t\t\t\t\t\t")); // Group every artist by its initial

          jsonResponse.filter(function (item) {
            return item.order.trim()[0].toLowerCase() === initial;
          }).forEach(function (item) {
            var button = document.createElement('button');
            button.dataset.artist = item.term_id;
            button.classList.add('artist__button');
            button.dataset.active = false;
            button.insertAdjacentText('afterbegin', item.name.replace('&amp;', '&')); // Display artist info and its artworks

            button.addEventListener('click', /*#__PURE__*/function () {
              var _ref2 = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(event) {
                var collection;
                return regenerator.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        collection = document.querySelector('.collection');

                        if (!(event.currentTarget.dataset.active === 'false')) {
                          _context2.next = 8;
                          break;
                        }

                        if (document.querySelector('.artist__button[data-active=true]')) {
                          document.querySelector('.artist__button[data-active=true]').dataset.active = false;
                        }

                        artistArtworks(event, ajax_var, artworks, currentLang, fetchOptions);
                        event.currentTarget.dataset.active = true;
                        collection.dataset.state = 'open';
                        _context2.next = 16;
                        break;

                      case 8:
                        event.currentTarget.dataset.active = false;
                        collection.dataset.state = 'closing';
                        artworks.dataset.state = 'unloading';
                        _context2.next = 13;
                        return waait(500);

                      case 13:
                        collection.dataset.state = 'closed';
                        artworks.dataset.state = 'unloaded';
                        artworks.innerHTML = '';

                      case 16:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());
            group.insertAdjacentElement('beforeend', button);
          });
          target.insertAdjacentElement('beforeend', group);
          groupObserver.observe(group);
        });
      } else {
        target.innerHTML = jsonResponse;
      }
    }).then(function () {
      return target.dataset.state = 'loaded';
    });
  }; // Show artists on load


  filterArtists(searchUrl, fetchOptions, artistsList, lang);

  if (artistId) {
    artistArtworks(null, ajax_var, artworks, lang, fetchOptions, artistId);
  } // Filter artists by input value


  searchInput.addEventListener('keyup', function () {
    filterArtists("".concat(searchUrl, "/").concat(searchInput.value), fetchOptions, artistsList, lang);
  });

}());

//# sourceMappingURL=ajax.js.map
