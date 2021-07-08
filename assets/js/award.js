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

  function asyncFetchOptions(nonce, method) {
    var headers = new Headers({
      'Content-Type': 'application/json',
      'X-WP-Nonce': nonce
    });
    var options = {
      method: method || 'get',
      headers: headers,
      credentials: 'same-origin'
    };
    return options;
  }

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
    this.slider = slider;
    this.scroll = scroll;
    this.lightbox = lightbox; // Handle slides < 4 cases

    if (this.slides.childElementCount === 1) {
      // If there is only one slide
      // then there's nothing to slide
      this.lightbox = true;
    } else if (this.slides.childElementCount < 4) {
      // Slider doesn't look great with less than 4 slides
      // so we duplicate them
      Array.from(this.slides.children).forEach(function (child) {
        return _this.slides.append(child.cloneNode(true));
      });
    } // Create navigation buttons


    if (this.lightbox === false) {
      console.log(this.lightbox);
      slider.insertAdjacentHTML('beforeend', "<button class=\"previous-slide\"><</button><button class=\"next-slide\">></button>");
    }

    var prevButton = slider.querySelector('.previous-slide');
    var nextButton = slider.querySelector('.next-slide'); // when this slider is created, run the start slider function

    this.startSlider();
    this.applyClasses();
    this.scroll && this.scrollImage(); // requestAnimationFrame(this.autoplay);
    // Event listeners

    prevButton && prevButton.addEventListener('click', function () {
      return _this.move('back');
    });
    nextButton && nextButton.addEventListener('click', function () {
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
  };

  Slider.prototype.scrollImage = function () {
    if (this.lightbox === false) {
      [this.next, this.prev].forEach(function (slide) {
        slide.removeEventListener('mouseenter', enterHandler, false);
        slide.removeEventListener('mouseleave', leaveHandler, false);
        slide.removeEventListener('mousemove', moveHandler, false);
      });
    }

    this.current.addEventListener('mouseenter', enterHandler, false);
    this.current.addEventListener('mouseleave', leaveHandler, false);
    this.current.addEventListener('mousemove', moveHandler, false);
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

  function _asyncCreateImage() {
    _asyncCreateImage = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(src) {
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", new Promise(function (resolve, reject) {
                var img = new Image();

                img.onload = function () {
                  return resolve(img);
                };

                img.onerror = reject;
                img.src = src;
              }));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _asyncCreateImage.apply(this, arguments);
  }

  var enterHandler = /*#__PURE__*/function () {
    var _ref3 = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(event) {
      var hiResImage, imageWidth, imageHeight, _window, windowWidth, windowHeight, hiResContainer;

      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return asyncCreateImage(event.currentTarget.querySelector('img').dataset.full);

            case 2:
              hiResImage = _context.sent;
              imageWidth = hiResImage.naturalWidth, imageHeight = hiResImage.naturalHeight;
              _window = window, windowWidth = _window.innerWidth, windowHeight = _window.innerHeight; // Check if hi-res image is bigger than screen size

              if (imageWidth > windowWidth || imageHeight > windowHeight) {
                // Add active state class
                event.target.classList.add('active-scroll'); // Create a container for hi-res image

                hiResContainer = document.createElement('div');
                hiResContainer.classList.add('slide__hi-res');
                hiResContainer.style.width = "".concat(hiResImage.width, "px");
                hiResContainer.style.height = "".concat(hiResImage.height, "px");
                hiResContainer.style.opacity = '0';
                hiResContainer.style.setProperty('--hires-width', "".concat(hiResImage.width, "px"));
                event.target.appendChild(hiResContainer); // Add width and height to hi-res image

                hiResImage.style.width = "".concat(hiResImage.width, "px");
                hiResImage.style.height = "".concat(hiResImage.height, "px");
                hiResContainer.appendChild(hiResImage);
                setTimeout(function () {
                  return hiResContainer.style.opacity = '1';
                }, 50);
              }

            case 6:
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

  var leaveHandler = function leaveHandler(event) {
    // Check if there is an active scrollable image
    if (event.currentTarget.classList.contains('active-scroll')) {
      // Remove scrollable image
      var hiResContainer = event.currentTarget.querySelector('.slide__hi-res');
      hiResContainer.style.opacity = '0';
      event.currentTarget.removeChild(hiResContainer); // Remove active state class

      event.currentTarget.classList.remove('active-scroll');
    }
  };

  var moveHandler = function moveHandler(event) {
    // Check if there is an active scrollable image
    if (event.currentTarget.classList.contains('active-scroll')) {
      var hiResImage = event.currentTarget.querySelector('.slide__hi-res img');
      var _window2 = window,
          windowWidth = _window2.innerWidth,
          windowHeight = _window2.innerHeight;
      var cursorX = event.clientX,
          cursorY = event.clientY;
      var imageWidth = hiResImage.naturalWidth,
          imageHeight = hiResImage.naturalHeight;
      imageWidth = imageWidth < windowWidth ? windowWidth : imageWidth;
      imageHeight = imageHeight < windowHeight ? windowHeight : imageHeight;
      var imageX = Math.floor((imageWidth - windowWidth) * cursorX / windowWidth) * -1;
      var imageY = Math.floor((imageHeight - windowHeight) * cursorY / windowHeight) * -1;
      hiResImage.style.transform = "translate(".concat(imageX, "px, ").concat(imageY, "px)");
    }
  };

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

  function showAwardGallery(payload) {
    if (payload === null) return;
    var event = payload.event,
        images = payload.images;
    var imageId = event.currentTarget.dataset.image;
    var handleScroll = new HandleScroll();
    var target = document.querySelector('.artwork-gallery');
    var targetSlider = target.querySelector('.artwork-gallery__slider');
    targetSlider.innerHTML = '';
    targetSlider.insertAdjacentHTML('afterbegin', "\n\t\t<div class=\"slides\">\n\t\t<figure class=\"slide\">".concat(images.filter(function (image) {
      return image.id === imageId;
    }).map(function (image) {
      return image.rendered;
    })[0], "</figure>\n\t\t</div>\n\t\t"));
    new Slider(targetSlider, false, true);
    document.body.classList.toggle('no-scroll');
    handleScroll.enable();
    target.classList.toggle('hidden');
  }

  function awardGalleryImage(payload) {
    if (payload === null) return;
    var images = payload.map(function (prize) {
      return {
        id: prize.bp_award_image,
        rendered: prize.bp_award_image_rendered
      };
    });
    var imageTriggers = document.querySelectorAll('.prize__image button');
    imageTriggers.forEach(function (trigger) {
      return trigger.addEventListener('click', function (event) {
        return showAwardGallery({
          event: event,
          images: images
        });
      });
    });
  }

  /**
   * Outputs Award info.
   *
   * @param {NodeList} triggers An object containing button triggers.
   * @param {Node} target Where the info will be printed in.
   * @param {string} ajaxUrl The REST API endpoint
   * @param {Object} options
   * @param {string} lang
   * @param {callback} callback The function that will generate the content
   * @return {string} Returns HTML string containing Award edition info.
   */

  function showAwardInfo(triggers, target, ajaxUrl, lang, options, callback) {
    // Add event listeners to prize images on first load
    window.addEventListener('load', function () {
      var edition = document.querySelector('.artwork-gallery').dataset.edition;
      asyncFetch("".concat(ajaxUrl, "/").concat(edition), options).then(function (jsonResponse) {
        var award = jsonResponse.award;
        awardGalleryImage(award);
      });
    }); // Add event listeners to edition buttons and handle gallery toggling on and off

    var awardHtml = '';
    triggers.forEach(function (button) {
      button.addEventListener('click', /*#__PURE__*/function () {
        var _ref = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(event) {
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(event.currentTarget.dataset.active === 'false')) {
                    _context.next = 9;
                    break;
                  }

                  target.dataset.state = 'loading';
                  target.parentElement.dataset.state = 'loaded'; // Search for an active button

                  if (document.querySelector('.edition-item__button[data-active="true"]')) {
                    // Make active button inactive
                    document.querySelector('.edition-item__button[data-active="true"]').dataset.active = false;
                  } // Fetch AJAX data


                  asyncFetch("".concat(ajaxUrl, "/").concat(event.currentTarget.dataset.edition), options).then(function (jsonResponse) {
                    callback(jsonResponse, target, lang); // Toggle target loading state

                    target.dataset.state = 'loaded';
                  }); // Make current button active

                  event.currentTarget.dataset.active = true;
                  button.setAttribute('aria-pressed', 'true');
                  _context.next = 18;
                  break;

                case 9:
                  // If pressed button is already active
                  // Make it inactive
                  event.currentTarget.dataset.active = false;
                  button.setAttribute('aria-pressed', 'false'); // Change target loading state

                  target.dataset.state = 'unloading';
                  target.parentElement.dataset.state = 'unloading'; // Wait half a second

                  _context.next = 15;
                  return waait(500);

                case 15:
                  // Change target loading state
                  target.dataset.state = 'unloaded';
                  target.parentElement.dataset.state = 'unloaded'; // Empty target container

                  target.innerHTML = '';

                case 18:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }(), false);
    });
    return awardHtml;
  }

  function handleReturnButton(_x, _x2) {
    return _handleReturnButton.apply(this, arguments);
  }

  function _handleReturnButton() {
    _handleReturnButton = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(button, target) {
      var activeButton;
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              activeButton = document.querySelector('.edition-item__button[data-active="true"]');

              if (activeButton) {
                activeButton.dataset.active = false;
                activeButton.setAttribute('aria-pressed', 'false');
              }

              if (button.getAttribute('aria-pressed') === 'true') {
                button.setAttribute('aria-pressed', 'false');
              } else {
                button.setAttribute('aria-pressed', 'true');
              }

              target.dataset.state = 'unloading';
              target.parentElement.dataset.state = 'unloading';
              _context.next = 7;
              return waait(500);

            case 7:
              target.dataset.state = 'unloaded';
              target.parentElement.dataset.state = 'unloaded';
              target.innerHTML = '';

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _handleReturnButton.apply(this, arguments);
  }

  /**
   * @param {Object} payload A JSON object
   * @param {HTMLElement} target - DOM Element where the info will be displayed
   * @param {string} lang
   * @return {void}
   */

  function awardEditionHTML(payload, target, lang) {
    var title = payload.title.rendered,
        mentions = payload.bp_award_mentions,
        isSpecialEdition = payload.bp_award_se_toggle,
        specialEdition = payload.award_se,
        awardPrizes = payload.award,
        id = payload.id;
    var mentionsHTML = '';

    if (mentions) {
      mentionsHTML += "<ul class=\"prizes__mentions\">";
      mentions.forEach(function (mention) {
        mentionsHTML += "\n\t\t\t<li class=\"mention\">\n\t\t\t\t<h2 class=\"mention__title\">".concat(mention.bp_award_mentions_title, "</h2>\n\t\t\t\t<p class=\"mention__text\">").concat(mention.bp_award_mentions_text, "</p>\n\t\t\t</li>");
      });
      mentionsHTML += "</ul>";
    }

    var html = "\n\t<article id=\"post-".concat(id, "\">\n\t\t<div class=\"entry-content award\">\n\t\t\t").concat(title && "<div class=\"award__title\">\n\t\t\t\t\t<h1>".concat(title, "</h1>\n\t\t\t\t</div>"), "\n\t\t\t").concat(isSpecialEdition ? "\n\t\t\t\t\t<ul id=\"award-se\" class=\"award-se\">\n\t\t\t\t\t\t".concat(specialEditionHTML(specialEdition), "\n\t\t\t\t\t</ul>\n\t\t\t\t\t") : "\t\n\t\t\t\t\t".concat(awardPrizes ? "\n\t\t\t\t\t\t<div class=\"award__prizes\">\n\t\t\t\t\t\t\t<ol class=\"prizes__list\">".concat(prizesListHTML(awardPrizes), "</ol>\n\t\t\t\t\t\t\t").concat(mentions && mentionsHTML, "\n\t\t\t\t\t\t</div>") : ""), "\n\t\t</div>\n\t</article>");
    target.innerHTML = '';
    target.insertAdjacentHTML('afterbegin', html); // Handle gallery toggling on and off

    awardGalleryImage(awardPrizes);
    var returnButton = document.createElement('button');
    returnButton.classList.add('award-edition-container__return-button');
    returnButton.classList.add('return-button');
    returnButton.setAttribute('aria-pressed', 'false');
    returnButton.innerHTML = '<';
    returnButton.addEventListener('click', function () {
      handleReturnButton(returnButton, target);
    }, false);
    target.insertAdjacentElement('afterbegin', returnButton);
  }

  function prizesListHTML(payload) {
    var html = "";

    if (payload) {
      payload.forEach(function (prize, index) {
        html += "\n\t\t<li id=\"prize-".concat(index + 1, "\" class=\"prize__category prize__category-").concat(index + 1, "\">\n\t\t\t<h2 class=\"prize__name\">").concat(prize.bp_award_category, "</h2>\n\t\t\t<p class=\"prize__artist\">").concat(prize.bp_award_artist, "</p>\n\t\t\t<div class=\"prize__image\">\n\t\t\t\t<button type=\"button\" data-image=\"").concat(prize.bp_award_image, "\">\n\t\t\t\t\t<figure>").concat(prize.bp_award_image_thumbnail, "</figure>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<p class=\"prize__artwork\">").concat(prize.bp_award_title, "</p>\n\t\t\t<p class=\"prize__technique\">").concat(prize.bp_award_technique, "</p>\n\t\t\t<p class=\"prize__size\">").concat(prize.bp_award_size, "</p>\n\t\t\t<p class=\"prize__year\">").concat(prize.bp_award_year, "</p>\n\t\t</li>\n\t\t");
      });
    }

    return html;
  }

  function specialEditionHTML(payload) {
    var html = "";
    payload.forEach(function (edition) {
      console.log(edition.bp_award_se_year);
      html += "\n\t\t<li id=\"award-se-".concat(edition.bp_award_se_year, "\" class=\"award-se__edition\">\n\t\t\t<div class=\"edition__year\">\n\t\t\t\t<p>").concat(edition.bp_award_se_year, "</p>\n\t\t\t</div>\n\t\t\t<div class=\"edition__winners\">").concat(edition.bp_award_se_winners, "</div>\n\t\t</li>\n\t\t");
    });
    return html;
  }

  createCommonjsModule(function (module) {
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

  /**
   * @param {Object} payload A JSON object
   * @param target
   * @param {string} lang Current language
   * @return {string} HTML string
   */

  function catalogueEditionHTML(payload, target, lang) {
    var catalogueEdition = payload.title.rendered,
        catalogueUrl = payload.award_catalogue,
        catalogueGallery = payload.award_catalog_gallery,
        catalogueCover = payload.award_catalog_cover,
        id = payload.id;
    var html = "\n\t".concat(catalogueUrl && catalogueHTML({
      catalogueUrl: catalogueUrl,
      catalogueEdition: catalogueEdition,
      catalogueGallery: catalogueGallery,
      lang: lang,
      catalogueCover: catalogueCover,
      id: id
    }), "\n\t");
    target.innerHTML = '';
    target.insertAdjacentHTML('afterbegin', html);
    var returnButton = document.createElement('button');
    returnButton.classList.add('award-edition-container__return-button');
    returnButton.classList.add('return-button');
    returnButton.setAttribute('aria-pressed', 'false');
    returnButton.innerHTML = '<';
    returnButton.addEventListener('click', function () {
      handleReturnButton(returnButton, target);
    }, false);
    target.insertAdjacentElement('afterbegin', returnButton); // catalogueGalleryHTML(catalogueGallery, id);
  }

  function catalogueHTML(payload) {
    var html = payload && "<article id=\"post-".concat(payload.id, "\">\n\t\t\t<div class=\"entry-content catalogue\">\n\t\t\t\t<h1 class=\"catalogue__title\">\n\t\t\t\t\t<p>").concat(payload.lang === 'es' ? 'Catálogo' : 'Catalogue', "</p>\n\t\t\t\t\t<p>").concat(payload.catalogueEdition, "</p>\n\t\t\t\t</h1>\n\t\t\t\t").concat(payload.catalogueCover ? "<figure class=\"catalogue__cover\">".concat(payload.catalogueCover, "</figure>") : "", "\n\t\t\t\t<div class=\"catalogue__link\">\n\t\t\t\t\t<a href=\"").concat(payload.catalogueUrl, "\">\n\t\t\t\t\t\t").concat(payload.lang === 'es' ? 'Descargar PDF' : 'Download PDF', "\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t\t").concat(payload.catalogueGallery.length ? "<div class=\"catalogue__gallery-toggle\">\n\t\t\t\t\t\t\t<button class=\"gallery-toggle\">".concat(payload.lang === 'es' ? 'Ver catálogo' : 'View catalog', "</button>\n\t\t\t\t\t\t</div>") : "", "\n\t\t\t</div>\n\t\t</article>");
    return html;
  }

  // Data received from php.

  var _awardPayload = awardPayload,
      nonce = _awardPayload.nonce,
      awardUrl = _awardPayload.awardUrl,
      type = _awardPayload.type,
      lang = _awardPayload.lang; // eslint-disable-line no-undef
  // console.log(awardPayload);

  var returnButton = document.querySelector('.award-edition-container__return-button'); // Where AJAX data will be displawed

  var editionContainer = document.querySelector('.award-edition-container'); // Make first button active

  var buttons = document.querySelectorAll('.edition-item__button');
  buttons[0].dataset.active = true;
  buttons[0].setAttribute('aria-pressed', 'true'); // Animate first load

  var awardContainer = document.querySelector('.award-container');

  function fakeButtonPress() {
    return _fakeButtonPress.apply(this, arguments);
  }

  function _fakeButtonPress() {
    _fakeButtonPress = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return waait(1500);

            case 2:
              awardContainer.dataset.state = 'loaded';

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _fakeButtonPress.apply(this, arguments);
  }

  document.addEventListener('DOMContentLoaded', fakeButtonPress, false); // Handle return button

  returnButton.addEventListener('click', function () {
    handleReturnButton(returnButton, editionContainer);
  }, false);
  editionContainer.insertAdjacentElement('afterbegin', returnButton); // Where gallery images will be displayed

  var awardGallery = document.querySelector('.artwork-gallery');
  var handleScroll = new HandleScroll();
  awardGallery.querySelector('.artwork-gallery__close button').addEventListener('click', function () {
    awardGallery.classList.toggle('hidden');
    document.body.classList.toggle('no-scroll');
    handleScroll.disable();
  }); // console.log(awardUrl);

  if (type === 'award') {
    showAwardInfo(buttons, editionContainer, awardUrl, lang, asyncFetchOptions(nonce, 'get'), awardEditionHTML);
  } else if (type === 'catalogues') {
    showAwardInfo(buttons, editionContainer, awardUrl, lang, asyncFetchOptions(nonce, 'get'), catalogueEditionHTML);
  } // const slider = tns({
  // 	container: '.award-gallery__slider',
  // 	items: 1,
  // 	slideBy: 1,
  // 	mouseDrag: true,
  // 	swipeAngle: false,
  // 	speed: 400,
  // 	autoplay: false,
  // 	arrowKeys: true,
  // 	center: true,
  // 	// edgePadding: 20,
  // 	// fixedWidth: 1500,
  // 	// autoHeight: true,
  // 	// viewportMax: '60%',
  // 	responsive: {
  // 		480: {
  // 			items: 2,
  // 		},
  // 	},
  // 	useLocalStorage: true,
  // });
  // SwiperCore.use([Navigation]);
  // const swiper = new Swiper('.swiper-container', {
  // 	// Optional parameters
  // 	direction: 'horizontal',
  // 	loop: true,
  // 	spaceBetween: 0,
  // 	centeredSlides: true,
  // 	slidesPerView: 3,
  // 	navigation: {
  // 		nextEl: '.swiper-button-next',
  // 		prevEl: '.swiper-button-prev',
  // 	},
  // });
  // swiper.init();
  // const galleryButton = document.querySelector('.gallery-toggle');
  // const gallery = document.querySelector('.award-gallery');
  // galleryButton.addEventListener('click', () => {
  // 	if (gallery.classList.contains('hidden')) {
  // 		gallery.classList.replace('hidden', 'visible');
  // 	}
  // });
  // gallery
  // 	.querySelector('.award-gallery__close button')
  // 	.addEventListener('click', () =>
  // 		gallery.classList.replace('visible', 'hidden')
  // 	);
  // window.addEventListener('keyup', (event) => {
  // 	if (gallery.classList.contains('visible')) {
  // 		if (event.key === 'Escape' || event.keyCode === 72) {
  // 			gallery.classList.replace('visible', 'hidden');
  // 		}
  // 	}
  // });
  // window.addEventListener('resize', () => {
  // 	slider.updateSliderHeight();
  // });

}());

//# sourceMappingURL=award.js.map
