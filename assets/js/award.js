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

  var win$1 = window;

  var raf = win$1.requestAnimationFrame
    || win$1.webkitRequestAnimationFrame
    || win$1.mozRequestAnimationFrame
    || win$1.msRequestAnimationFrame
    || function(cb) { return setTimeout(cb, 16); };

  var win = window;

  var caf = win.cancelAnimationFrame
    || win.mozCancelAnimationFrame
    || function(id){ clearTimeout(id); };

  function extend() {
    var obj, name, copy,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length;

    for (; i < length; i++) {
      if ((obj = arguments[i]) !== null) {
        for (name in obj) {
          copy = obj[name];

          if (target === copy) {
            continue;
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  }

  function checkStorageValue (value) {
    return ['true', 'false'].indexOf(value) >= 0 ? JSON.parse(value) : value;
  }

  function setLocalStorage(storage, key, value, access) {
    if (access) {
      try { storage.setItem(key, value); } catch (e) {}
    }
    return value;
  }

  function getSlideId() {
    var id = window.tnsId;
    window.tnsId = !id ? 1 : id + 1;
    
    return 'tns' + window.tnsId;
  }

  function getBody () {
    var doc = document,
        body = doc.body;

    if (!body) {
      body = doc.createElement('body');
      body.fake = true;
    }

    return body;
  }

  var docElement = document.documentElement;

  function setFakeBody (body) {
    var docOverflow = '';
    if (body.fake) {
      docOverflow = docElement.style.overflow;
      //avoid crashing IE8, if background image is used
      body.style.background = '';
      //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
      body.style.overflow = docElement.style.overflow = 'hidden';
      docElement.appendChild(body);
    }

    return docOverflow;
  }

  function resetFakeBody (body, docOverflow) {
    if (body.fake) {
      body.remove();
      docElement.style.overflow = docOverflow;
      // Trigger layout so kinetic scrolling isn't disabled in iOS6+
      // eslint-disable-next-line
      docElement.offsetHeight;
    }
  }

  // get css-calc 

  function calc() {
    var doc = document, 
        body = getBody(),
        docOverflow = setFakeBody(body),
        div = doc.createElement('div'), 
        result = false;

    body.appendChild(div);
    try {
      var str = '(10px * 10)',
          vals = ['calc' + str, '-moz-calc' + str, '-webkit-calc' + str],
          val;
      for (var i = 0; i < 3; i++) {
        val = vals[i];
        div.style.width = val;
        if (div.offsetWidth === 100) { 
          result = val.replace(str, ''); 
          break;
        }
      }
    } catch (e) {}
    
    body.fake ? resetFakeBody(body, docOverflow) : div.remove();

    return result;
  }

  // get subpixel support value

  function percentageLayout() {
    // check subpixel layout supporting
    var doc = document,
        body = getBody(),
        docOverflow = setFakeBody(body),
        wrapper = doc.createElement('div'),
        outer = doc.createElement('div'),
        str = '',
        count = 70,
        perPage = 3,
        supported = false;

    wrapper.className = "tns-t-subp2";
    outer.className = "tns-t-ct";

    for (var i = 0; i < count; i++) {
      str += '<div></div>';
    }

    outer.innerHTML = str;
    wrapper.appendChild(outer);
    body.appendChild(wrapper);

    supported = Math.abs(wrapper.getBoundingClientRect().left - outer.children[count - perPage].getBoundingClientRect().left) < 2;

    body.fake ? resetFakeBody(body, docOverflow) : wrapper.remove();

    return supported;
  }

  function mediaquerySupport () {
    if (window.matchMedia || window.msMatchMedia) {
      return true;
    }
    
    var doc = document,
        body = getBody(),
        docOverflow = setFakeBody(body),
        div = doc.createElement('div'),
        style = doc.createElement('style'),
        rule = '@media all and (min-width:1px){.tns-mq-test{position:absolute}}',
        position;

    style.type = 'text/css';
    div.className = 'tns-mq-test';

    body.appendChild(style);
    body.appendChild(div);

    if (style.styleSheet) {
      style.styleSheet.cssText = rule;
    } else {
      style.appendChild(doc.createTextNode(rule));
    }

    position = window.getComputedStyle ? window.getComputedStyle(div).position : div.currentStyle['position'];

    body.fake ? resetFakeBody(body, docOverflow) : div.remove();

    return position === "absolute";
  }

  // create and append style sheet
  function createStyleSheet (media, nonce) {
    // Create the <style> tag
    var style = document.createElement("style");
    // style.setAttribute("type", "text/css");

    // Add a media (and/or media query) here if you'd like!
    // style.setAttribute("media", "screen")
    // style.setAttribute("media", "only screen and (max-width : 1024px)")
    if (media) { style.setAttribute("media", media); }

    // Add nonce attribute for Content Security Policy
    if (nonce) { style.setAttribute("nonce", nonce); }

    // WebKit hack :(
    // style.appendChild(document.createTextNode(""));

    // Add the <style> element to the page
    document.querySelector('head').appendChild(style);

    return style.sheet ? style.sheet : style.styleSheet;
  }

  // cross browsers addRule method
  function addCSSRule(sheet, selector, rules, index) {
    // return raf(function() {
      'insertRule' in sheet ?
        sheet.insertRule(selector + '{' + rules + '}', index) :
        sheet.addRule(selector, rules, index);
    // });
  }

  // cross browsers addRule method
  function removeCSSRule(sheet, index) {
    // return raf(function() {
      'deleteRule' in sheet ?
        sheet.deleteRule(index) :
        sheet.removeRule(index);
    // });
  }

  function getCssRulesLength(sheet) {
    var rule = ('insertRule' in sheet) ? sheet.cssRules : sheet.rules;
    return rule.length;
  }

  function toDegree (y, x) {
    return Math.atan2(y, x) * (180 / Math.PI);
  }

  function getTouchDirection(angle, range) {
    var direction = false,
        gap = Math.abs(90 - Math.abs(angle));
        
    if (gap >= 90 - range) {
      direction = 'horizontal';
    } else if (gap <= range) {
      direction = 'vertical';
    }

    return direction;
  }

  // https://toddmotto.com/ditch-the-array-foreach-call-nodelist-hack/
  function forEach (arr, callback, scope) {
    for (var i = 0, l = arr.length; i < l; i++) {
      callback.call(scope, arr[i], i);
    }
  }

  var classListSupport = 'classList' in document.createElement('_');

  var hasClass = classListSupport ?
      function (el, str) { return el.classList.contains(str); } :
      function (el, str) { return el.className.indexOf(str) >= 0; };

  var addClass = classListSupport ?
      function (el, str) {
        if (!hasClass(el,  str)) { el.classList.add(str); }
      } :
      function (el, str) {
        if (!hasClass(el,  str)) { el.className += ' ' + str; }
      };

  var removeClass = classListSupport ?
      function (el, str) {
        if (hasClass(el,  str)) { el.classList.remove(str); }
      } :
      function (el, str) {
        if (hasClass(el, str)) { el.className = el.className.replace(str, ''); }
      };

  function hasAttr(el, attr) {
    return el.hasAttribute(attr);
  }

  function getAttr(el, attr) {
    return el.getAttribute(attr);
  }

  function isNodeList(el) {
    // Only NodeList has the "item()" function
    return typeof el.item !== "undefined"; 
  }

  function setAttrs(els, attrs) {
    els = (isNodeList(els) || els instanceof Array) ? els : [els];
    if (Object.prototype.toString.call(attrs) !== '[object Object]') { return; }

    for (var i = els.length; i--;) {
      for(var key in attrs) {
        els[i].setAttribute(key, attrs[key]);
      }
    }
  }

  function removeAttrs(els, attrs) {
    els = (isNodeList(els) || els instanceof Array) ? els : [els];
    attrs = (attrs instanceof Array) ? attrs : [attrs];

    var attrLength = attrs.length;
    for (var i = els.length; i--;) {
      for (var j = attrLength; j--;) {
        els[i].removeAttribute(attrs[j]);
      }
    }
  }

  function arrayFromNodeList (nl) {
    var arr = [];
    for (var i = 0, l = nl.length; i < l; i++) {
      arr.push(nl[i]);
    }
    return arr;
  }

  function hideElement(el, forceHide) {
    if (el.style.display !== 'none') { el.style.display = 'none'; }
  }

  function showElement(el, forceHide) {
    if (el.style.display === 'none') { el.style.display = ''; }
  }

  function isVisible(el) {
    return window.getComputedStyle(el).display !== 'none';
  }

  function whichProperty(props){
    if (typeof props === 'string') {
      var arr = [props],
          Props = props.charAt(0).toUpperCase() + props.substr(1),
          prefixes = ['Webkit', 'Moz', 'ms', 'O'];
          
      prefixes.forEach(function(prefix) {
        if (prefix !== 'ms' || props === 'transform') {
          arr.push(prefix + Props);
        }
      });

      props = arr;
    }

    var el = document.createElement('fakeelement');
        props.length;
    for(var i = 0; i < props.length; i++){
      var prop = props[i];
      if( el.style[prop] !== undefined ){ return prop; }
    }

    return false; // explicit for ie9-
  }

  function has3DTransforms(tf){
    if (!tf) { return false; }
    if (!window.getComputedStyle) { return false; }
    
    var doc = document,
        body = getBody(),
        docOverflow = setFakeBody(body),
        el = doc.createElement('p'),
        has3d,
        cssTF = tf.length > 9 ? '-' + tf.slice(0, -9).toLowerCase() + '-' : '';

    cssTF += 'transform';

    // Add it to the body to get the computed style
    body.insertBefore(el, null);

    el.style[tf] = 'translate3d(1px,1px,1px)';
    has3d = window.getComputedStyle(el).getPropertyValue(cssTF);

    body.fake ? resetFakeBody(body, docOverflow) : el.remove();

    return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
  }

  // get transitionend, animationend based on transitionDuration
  // @propin: string
  // @propOut: string, first-letter uppercase
  // Usage: getEndProperty('WebkitTransitionDuration', 'Transition') => webkitTransitionEnd
  function getEndProperty(propIn, propOut) {
    var endProp = false;
    if (/^Webkit/.test(propIn)) {
      endProp = 'webkit' + propOut + 'End';
    } else if (/^O/.test(propIn)) {
      endProp = 'o' + propOut + 'End';
    } else if (propIn) {
      endProp = propOut.toLowerCase() + 'end';
    }
    return endProp;
  }

  // Test via a getter in the options object to see if the passive property is accessed
  var supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
      }
    });
    window.addEventListener("test", null, opts);
  } catch (e) {}
  var passiveOption = supportsPassive ? { passive: true } : false;

  function addEvents(el, obj, preventScrolling) {
    for (var prop in obj) {
      var option = ['touchstart', 'touchmove'].indexOf(prop) >= 0 && !preventScrolling ? passiveOption : false;
      el.addEventListener(prop, obj[prop], option);
    }
  }

  function removeEvents(el, obj) {
    for (var prop in obj) {
      var option = ['touchstart', 'touchmove'].indexOf(prop) >= 0 ? passiveOption : false;
      el.removeEventListener(prop, obj[prop], option);
    }
  }

  function Events() {
    return {
      topics: {},
      on: function (eventName, fn) {
        this.topics[eventName] = this.topics[eventName] || [];
        this.topics[eventName].push(fn);
      },
      off: function(eventName, fn) {
        if (this.topics[eventName]) {
          for (var i = 0; i < this.topics[eventName].length; i++) {
            if (this.topics[eventName][i] === fn) {
              this.topics[eventName].splice(i, 1);
              break;
            }
          }
        }
      },
      emit: function (eventName, data) {
        data.type = eventName;
        if (this.topics[eventName]) {
          this.topics[eventName].forEach(function(fn) {
            fn(data, eventName);
          });
        }
      }
    };
  }

  function jsTransform(element, attr, prefix, postfix, to, duration, callback) {
    var tick = Math.min(duration, 10),
        unit = (to.indexOf('%') >= 0) ? '%' : 'px',
        to = to.replace(unit, ''),
        from = Number(element.style[attr].replace(prefix, '').replace(postfix, '').replace(unit, '')),
        positionTick = (to - from) / duration * tick;

    setTimeout(moveElement, tick);
    function moveElement() {
      duration -= tick;
      from += positionTick;
      element.style[attr] = prefix + from + unit + postfix;
      if (duration > 0) { 
        setTimeout(moveElement, tick); 
      } else {
        callback();
      }
    }
  }

  // Object.keys
  if (!Object.keys) {
    Object.keys = function(object) {
      var keys = [];
      for (var name in object) {
        if (Object.prototype.hasOwnProperty.call(object, name)) {
          keys.push(name);
        }
      }
      return keys;
    };
  }

  // ChildNode.remove
  if(!("remove" in Element.prototype)){
    Element.prototype.remove = function(){
      if(this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

  var tns = function(options) {
    options = extend({
      container: '.slider',
      mode: 'carousel',
      axis: 'horizontal',
      items: 1,
      gutter: 0,
      edgePadding: 0,
      fixedWidth: false,
      autoWidth: false,
      viewportMax: false,
      slideBy: 1,
      center: false,
      controls: true,
      controlsPosition: 'top',
      controlsText: ['prev', 'next'],
      controlsContainer: false,
      prevButton: false,
      nextButton: false,
      nav: true,
      navPosition: 'top',
      navContainer: false,
      navAsThumbnails: false,
      arrowKeys: false,
      speed: 300,
      autoplay: false,
      autoplayPosition: 'top',
      autoplayTimeout: 5000,
      autoplayDirection: 'forward',
      autoplayText: ['start', 'stop'],
      autoplayHoverPause: false,
      autoplayButton: false,
      autoplayButtonOutput: true,
      autoplayResetOnVisibility: true,
      animateIn: 'tns-fadeIn',
      animateOut: 'tns-fadeOut',
      animateNormal: 'tns-normal',
      animateDelay: false,
      loop: true,
      rewind: false,
      autoHeight: false,
      responsive: false,
      lazyload: false,
      lazyloadSelector: '.tns-lazy-img',
      touch: true,
      mouseDrag: false,
      swipeAngle: 15,
      nested: false,
      preventActionWhenRunning: false,
      preventScrollOnTouch: false,
      freezable: true,
      onInit: false,
      useLocalStorage: true,
      nonce: false
    }, options || {});

    var doc = document,
        win = window,
        KEYS = {
          ENTER: 13,
          SPACE: 32,
          LEFT: 37,
          RIGHT: 39
        },
        tnsStorage = {},
        localStorageAccess = options.useLocalStorage;

    if (localStorageAccess) {
      // check browser version and local storage access
      var browserInfo = navigator.userAgent;
      var uid = new Date;

      try {
        tnsStorage = win.localStorage;
        if (tnsStorage) {
          tnsStorage.setItem(uid, uid);
          localStorageAccess = tnsStorage.getItem(uid) == uid;
          tnsStorage.removeItem(uid);
        } else {
          localStorageAccess = false;
        }
        if (!localStorageAccess) { tnsStorage = {}; }
      } catch(e) {
        localStorageAccess = false;
      }

      if (localStorageAccess) {
        // remove storage when browser version changes
        if (tnsStorage['tnsApp'] && tnsStorage['tnsApp'] !== browserInfo) {
          ['tC', 'tPL', 'tMQ', 'tTf', 't3D', 'tTDu', 'tTDe', 'tADu', 'tADe', 'tTE', 'tAE'].forEach(function(item) { tnsStorage.removeItem(item); });
        }
        // update browserInfo
        localStorage['tnsApp'] = browserInfo;
      }
    }

    var CALC = tnsStorage['tC'] ? checkStorageValue(tnsStorage['tC']) : setLocalStorage(tnsStorage, 'tC', calc(), localStorageAccess),
        PERCENTAGELAYOUT = tnsStorage['tPL'] ? checkStorageValue(tnsStorage['tPL']) : setLocalStorage(tnsStorage, 'tPL', percentageLayout(), localStorageAccess),
        CSSMQ = tnsStorage['tMQ'] ? checkStorageValue(tnsStorage['tMQ']) : setLocalStorage(tnsStorage, 'tMQ', mediaquerySupport(), localStorageAccess),
        TRANSFORM = tnsStorage['tTf'] ? checkStorageValue(tnsStorage['tTf']) : setLocalStorage(tnsStorage, 'tTf', whichProperty('transform'), localStorageAccess),
        HAS3DTRANSFORMS = tnsStorage['t3D'] ? checkStorageValue(tnsStorage['t3D']) : setLocalStorage(tnsStorage, 't3D', has3DTransforms(TRANSFORM), localStorageAccess),
        TRANSITIONDURATION = tnsStorage['tTDu'] ? checkStorageValue(tnsStorage['tTDu']) : setLocalStorage(tnsStorage, 'tTDu', whichProperty('transitionDuration'), localStorageAccess),
        TRANSITIONDELAY = tnsStorage['tTDe'] ? checkStorageValue(tnsStorage['tTDe']) : setLocalStorage(tnsStorage, 'tTDe', whichProperty('transitionDelay'), localStorageAccess),
        ANIMATIONDURATION = tnsStorage['tADu'] ? checkStorageValue(tnsStorage['tADu']) : setLocalStorage(tnsStorage, 'tADu', whichProperty('animationDuration'), localStorageAccess),
        ANIMATIONDELAY = tnsStorage['tADe'] ? checkStorageValue(tnsStorage['tADe']) : setLocalStorage(tnsStorage, 'tADe', whichProperty('animationDelay'), localStorageAccess),
        TRANSITIONEND = tnsStorage['tTE'] ? checkStorageValue(tnsStorage['tTE']) : setLocalStorage(tnsStorage, 'tTE', getEndProperty(TRANSITIONDURATION, 'Transition'), localStorageAccess),
        ANIMATIONEND = tnsStorage['tAE'] ? checkStorageValue(tnsStorage['tAE']) : setLocalStorage(tnsStorage, 'tAE', getEndProperty(ANIMATIONDURATION, 'Animation'), localStorageAccess);

    // get element nodes from selectors
    var supportConsoleWarn = win.console && typeof win.console.warn === "function",
        tnsList = ['container', 'controlsContainer', 'prevButton', 'nextButton', 'navContainer', 'autoplayButton'],
        optionsElements = {};

    tnsList.forEach(function(item) {
      if (typeof options[item] === 'string') {
        var str = options[item],
            el = doc.querySelector(str);
        optionsElements[item] = str;

        if (el && el.nodeName) {
          options[item] = el;
        } else {
          if (supportConsoleWarn) { console.warn('Can\'t find', options[item]); }
          return;
        }
      }
    });

    // make sure at least 1 slide
    if (options.container.children.length < 1) {
      if (supportConsoleWarn) { console.warn('No slides found in', options.container); }
      return;
     }

    // update options
    var responsive = options.responsive,
        nested = options.nested,
        carousel = options.mode === 'carousel' ? true : false;

    if (responsive) {
      // apply responsive[0] to options and remove it
      if (0 in responsive) {
        options = extend(options, responsive[0]);
        delete responsive[0];
      }

      var responsiveTem = {};
      for (var key in responsive) {
        var val = responsive[key];
        // update responsive
        // from: 300: 2
        // to:
        //   300: {
        //     items: 2
        //   }
        val = typeof val === 'number' ? {items: val} : val;
        responsiveTem[key] = val;
      }
      responsive = responsiveTem;
      responsiveTem = null;
    }

    // update options
    function updateOptions (obj) {
      for (var key in obj) {
        if (!carousel) {
          if (key === 'slideBy') { obj[key] = 'page'; }
          if (key === 'edgePadding') { obj[key] = false; }
          if (key === 'autoHeight') { obj[key] = false; }
        }

        // update responsive options
        if (key === 'responsive') { updateOptions(obj[key]); }
      }
    }
    if (!carousel) { updateOptions(options); }


    // === define and set variables ===
    if (!carousel) {
      options.axis = 'horizontal';
      options.slideBy = 'page';
      options.edgePadding = false;

      var animateIn = options.animateIn,
          animateOut = options.animateOut,
          animateDelay = options.animateDelay,
          animateNormal = options.animateNormal;
    }

    var horizontal = options.axis === 'horizontal' ? true : false,
        outerWrapper = doc.createElement('div'),
        innerWrapper = doc.createElement('div'),
        middleWrapper,
        container = options.container,
        containerParent = container.parentNode,
        containerHTML = container.outerHTML,
        slideItems = container.children,
        slideCount = slideItems.length,
        breakpointZone,
        windowWidth = getWindowWidth(),
        isOn = false;
    if (responsive) { setBreakpointZone(); }
    if (carousel) { container.className += ' tns-vpfix'; }

    // fixedWidth: viewport > rightBoundary > indexMax
    var autoWidth = options.autoWidth,
        fixedWidth = getOption('fixedWidth'),
        edgePadding = getOption('edgePadding'),
        gutter = getOption('gutter'),
        viewport = getViewportWidth(),
        center = getOption('center'),
        items = !autoWidth ? Math.floor(getOption('items')) : 1,
        slideBy = getOption('slideBy'),
        viewportMax = options.viewportMax || options.fixedWidthViewportWidth,
        arrowKeys = getOption('arrowKeys'),
        speed = getOption('speed'),
        rewind = options.rewind,
        loop = rewind ? false : options.loop,
        autoHeight = getOption('autoHeight'),
        controls = getOption('controls'),
        controlsText = getOption('controlsText'),
        nav = getOption('nav'),
        touch = getOption('touch'),
        mouseDrag = getOption('mouseDrag'),
        autoplay = getOption('autoplay'),
        autoplayTimeout = getOption('autoplayTimeout'),
        autoplayText = getOption('autoplayText'),
        autoplayHoverPause = getOption('autoplayHoverPause'),
        autoplayResetOnVisibility = getOption('autoplayResetOnVisibility'),
        sheet = createStyleSheet(null, getOption('nonce')),
        lazyload = options.lazyload,
        lazyloadSelector = options.lazyloadSelector,
        slidePositions, // collection of slide positions
        slideItemsOut = [],
        cloneCount = loop ? getCloneCountForLoop() : 0,
        slideCountNew = !carousel ? slideCount + cloneCount : slideCount + cloneCount * 2,
        hasRightDeadZone = (fixedWidth || autoWidth) && !loop ? true : false,
        rightBoundary = fixedWidth ? getRightBoundary() : null,
        updateIndexBeforeTransform = (!carousel || !loop) ? true : false,
        // transform
        transformAttr = horizontal ? 'left' : 'top',
        transformPrefix = '',
        transformPostfix = '',
        // index
        getIndexMax = (function () {
          if (fixedWidth) {
            return function() { return center && !loop ? slideCount - 1 : Math.ceil(- rightBoundary / (fixedWidth + gutter)); };
          } else if (autoWidth) {
            return function() {
              for (var i = 0; i < slideCountNew; i++) {
                if (slidePositions[i] >= - rightBoundary) { return i; }
              }
            };
          } else {
            return function() {
              if (center && carousel && !loop) {
                return slideCount - 1;
              } else {
                return loop || carousel ? Math.max(0, slideCountNew - Math.ceil(items)) : slideCountNew - 1;
              }
            };
          }
        })(),
        index = getStartIndex(getOption('startIndex')),
        indexCached = index;
        getCurrentSlide();
        var indexMin = 0,
        indexMax = !autoWidth ? getIndexMax() : null,
        preventActionWhenRunning = options.preventActionWhenRunning,
        swipeAngle = options.swipeAngle,
        moveDirectionExpected = swipeAngle ? '?' : true,
        running = false,
        onInit = options.onInit,
        events = new Events(),
        // id, class
        newContainerClasses = ' tns-slider tns-' + options.mode,
        slideId = container.id || getSlideId(),
        disable = getOption('disable'),
        disabled = false,
        freezable = options.freezable,
        freeze = freezable && !autoWidth ? getFreeze() : false,
        frozen = false,
        controlsEvents = {
          'click': onControlsClick,
          'keydown': onControlsKeydown
        },
        navEvents = {
          'click': onNavClick,
          'keydown': onNavKeydown
        },
        hoverEvents = {
          'mouseover': mouseoverPause,
          'mouseout': mouseoutRestart
        },
        visibilityEvent = {'visibilitychange': onVisibilityChange},
        docmentKeydownEvent = {'keydown': onDocumentKeydown},
        touchEvents = {
          'touchstart': onPanStart,
          'touchmove': onPanMove,
          'touchend': onPanEnd,
          'touchcancel': onPanEnd
        }, dragEvents = {
          'mousedown': onPanStart,
          'mousemove': onPanMove,
          'mouseup': onPanEnd,
          'mouseleave': onPanEnd
        },
        hasControls = hasOption('controls'),
        hasNav = hasOption('nav'),
        navAsThumbnails = autoWidth ? true : options.navAsThumbnails,
        hasAutoplay = hasOption('autoplay'),
        hasTouch = hasOption('touch'),
        hasMouseDrag = hasOption('mouseDrag'),
        slideActiveClass = 'tns-slide-active',
        slideClonedClass = 'tns-slide-cloned',
        imgCompleteClass = 'tns-complete',
        imgEvents = {
          'load': onImgLoaded,
          'error': onImgFailed
        },
        imgsComplete,
        liveregionCurrent,
        preventScroll = options.preventScrollOnTouch === 'force' ? true : false;

    // controls
    if (hasControls) {
      var controlsContainer = options.controlsContainer,
          controlsContainerHTML = options.controlsContainer ? options.controlsContainer.outerHTML : '',
          prevButton = options.prevButton,
          nextButton = options.nextButton,
          prevButtonHTML = options.prevButton ? options.prevButton.outerHTML : '',
          nextButtonHTML = options.nextButton ? options.nextButton.outerHTML : '',
          prevIsButton,
          nextIsButton;
    }

    // nav
    if (hasNav) {
      var navContainer = options.navContainer,
          navContainerHTML = options.navContainer ? options.navContainer.outerHTML : '',
          navItems,
          pages = autoWidth ? slideCount : getPages(),
          pagesCached = 0,
          navClicked = -1,
          navCurrentIndex = getCurrentNavIndex(),
          navCurrentIndexCached = navCurrentIndex,
          navActiveClass = 'tns-nav-active',
          navStr = 'Carousel Page ',
          navStrCurrent = ' (Current Slide)';
    }

    // autoplay
    if (hasAutoplay) {
      var autoplayDirection = options.autoplayDirection === 'forward' ? 1 : -1,
          autoplayButton = options.autoplayButton,
          autoplayButtonHTML = options.autoplayButton ? options.autoplayButton.outerHTML : '',
          autoplayHtmlStrings = ['<span class=\'tns-visually-hidden\'>', ' animation</span>'],
          autoplayTimer,
          animating,
          autoplayHoverPaused,
          autoplayUserPaused,
          autoplayVisibilityPaused;
    }

    if (hasTouch || hasMouseDrag) {
      var initPosition = {},
          lastPosition = {},
          translateInit,
          panStart = false,
          rafIndex,
          getDist = horizontal ?
            function(a, b) { return a.x - b.x; } :
            function(a, b) { return a.y - b.y; };
    }

    // disable slider when slidecount <= items
    if (!autoWidth) { resetVariblesWhenDisable(disable || freeze); }

    if (TRANSFORM) {
      transformAttr = TRANSFORM;
      transformPrefix = 'translate';

      if (HAS3DTRANSFORMS) {
        transformPrefix += horizontal ? '3d(' : '3d(0px, ';
        transformPostfix = horizontal ? ', 0px, 0px)' : ', 0px)';
      } else {
        transformPrefix += horizontal ? 'X(' : 'Y(';
        transformPostfix = ')';
      }

    }

    if (carousel) { container.className = container.className.replace('tns-vpfix', ''); }
    initStructure();
    initSheet();
    initSliderTransform();

    // === COMMON FUNCTIONS === //
    function resetVariblesWhenDisable (condition) {
      if (condition) {
        controls = nav = touch = mouseDrag = arrowKeys = autoplay = autoplayHoverPause = autoplayResetOnVisibility = false;
      }
    }

    function getCurrentSlide () {
      var tem = carousel ? index - cloneCount : index;
      while (tem < 0) { tem += slideCount; }
      return tem%slideCount + 1;
    }

    function getStartIndex (ind) {
      ind = ind ? Math.max(0, Math.min(loop ? slideCount - 1 : slideCount - items, ind)) : 0;
      return carousel ? ind + cloneCount : ind;
    }

    function getAbsIndex (i) {
      if (i == null) { i = index; }

      if (carousel) { i -= cloneCount; }
      while (i < 0) { i += slideCount; }

      return Math.floor(i%slideCount);
    }

    function getCurrentNavIndex () {
      var absIndex = getAbsIndex(),
          result;

      result = navAsThumbnails ? absIndex :
        fixedWidth || autoWidth ? Math.ceil((absIndex + 1) * pages / slideCount - 1) :
            Math.floor(absIndex / items);

      // set active nav to the last one when reaches the right edge
      if (!loop && carousel && index === indexMax) { result = pages - 1; }

      return result;
    }

    function getItemsMax () {
      // fixedWidth or autoWidth while viewportMax is not available
      if (autoWidth || (fixedWidth && !viewportMax)) {
        return slideCount - 1;
      // most cases
      } else {
        var str = fixedWidth ? 'fixedWidth' : 'items',
            arr = [];

        if (fixedWidth || options[str] < slideCount) { arr.push(options[str]); }

        if (responsive) {
          for (var bp in responsive) {
            var tem = responsive[bp][str];
            if (tem && (fixedWidth || tem < slideCount)) { arr.push(tem); }
          }
        }

        if (!arr.length) { arr.push(0); }

        return Math.ceil(fixedWidth ? viewportMax / Math.min.apply(null, arr) : Math.max.apply(null, arr));
      }
    }

    function getCloneCountForLoop () {
      var itemsMax = getItemsMax(),
          result = carousel ? Math.ceil((itemsMax * 5 - slideCount)/2) : (itemsMax * 4 - slideCount);
      result = Math.max(itemsMax, result);

      return hasOption('edgePadding') ? result + 1 : result;
    }

    function getWindowWidth () {
      return win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth;
    }

    function getInsertPosition (pos) {
      return pos === 'top' ? 'afterbegin' : 'beforeend';
    }

    function getClientWidth (el) {
      if (el == null) { return; }
      var div = doc.createElement('div'), rect, width;
      el.appendChild(div);
      rect = div.getBoundingClientRect();
      width = rect.right - rect.left;
      div.remove();
      return width || getClientWidth(el.parentNode);
    }

    function getViewportWidth () {
      var gap = edgePadding ? edgePadding * 2 - gutter : 0;
      return getClientWidth(containerParent) - gap;
    }

    function hasOption (item) {
      if (options[item]) {
        return true;
      } else {
        if (responsive) {
          for (var bp in responsive) {
            if (responsive[bp][item]) { return true; }
          }
        }
        return false;
      }
    }

    // get option:
    // fixed width: viewport, fixedWidth, gutter => items
    // others: window width => all variables
    // all: items => slideBy
    function getOption (item, ww) {
      if (ww == null) { ww = windowWidth; }

      if (item === 'items' && fixedWidth) {
        return Math.floor((viewport + gutter) / (fixedWidth + gutter)) || 1;

      } else {
        var result = options[item];

        if (responsive) {
          for (var bp in responsive) {
            // bp: convert string to number
            if (ww >= parseInt(bp)) {
              if (item in responsive[bp]) { result = responsive[bp][item]; }
            }
          }
        }

        if (item === 'slideBy' && result === 'page') { result = getOption('items'); }
        if (!carousel && (item === 'slideBy' || item === 'items')) { result = Math.floor(result); }

        return result;
      }
    }

    function getSlideMarginLeft (i) {
      return CALC ?
        CALC + '(' + i * 100 + '% / ' + slideCountNew + ')' :
        i * 100 / slideCountNew + '%';
    }

    function getInnerWrapperStyles (edgePaddingTem, gutterTem, fixedWidthTem, speedTem, autoHeightBP) {
      var str = '';

      if (edgePaddingTem !== undefined) {
        var gap = edgePaddingTem;
        if (gutterTem) { gap -= gutterTem; }
        str = horizontal ?
          'margin: 0 ' + gap + 'px 0 ' + edgePaddingTem + 'px;' :
          'margin: ' + edgePaddingTem + 'px 0 ' + gap + 'px 0;';
      } else if (gutterTem && !fixedWidthTem) {
        var gutterTemUnit = '-' + gutterTem + 'px',
            dir = horizontal ? gutterTemUnit + ' 0 0' : '0 ' + gutterTemUnit + ' 0';
        str = 'margin: 0 ' + dir + ';';
      }

      if (!carousel && autoHeightBP && TRANSITIONDURATION && speedTem) { str += getTransitionDurationStyle(speedTem); }
      return str;
    }

    function getContainerWidth (fixedWidthTem, gutterTem, itemsTem) {
      if (fixedWidthTem) {
        return (fixedWidthTem + gutterTem) * slideCountNew + 'px';
      } else {
        return CALC ?
          CALC + '(' + slideCountNew * 100 + '% / ' + itemsTem + ')' :
          slideCountNew * 100 / itemsTem + '%';
      }
    }

    function getSlideWidthStyle (fixedWidthTem, gutterTem, itemsTem) {
      var width;

      if (fixedWidthTem) {
        width = (fixedWidthTem + gutterTem) + 'px';
      } else {
        if (!carousel) { itemsTem = Math.floor(itemsTem); }
        var dividend = carousel ? slideCountNew : itemsTem;
        width = CALC ?
          CALC + '(100% / ' + dividend + ')' :
          100 / dividend + '%';
      }

      width = 'width:' + width;

      // inner slider: overwrite outer slider styles
      return nested !== 'inner' ? width + ';' : width + ' !important;';
    }

    function getSlideGutterStyle (gutterTem) {
      var str = '';

      // gutter maybe interger || 0
      // so can't use 'if (gutter)'
      if (gutterTem !== false) {
        var prop = horizontal ? 'padding-' : 'margin-',
            dir = horizontal ? 'right' : 'bottom';
        str = prop +  dir + ': ' + gutterTem + 'px;';
      }

      return str;
    }

    function getCSSPrefix (name, num) {
      var prefix = name.substring(0, name.length - num).toLowerCase();
      if (prefix) { prefix = '-' + prefix + '-'; }

      return prefix;
    }

    function getTransitionDurationStyle (speed) {
      return getCSSPrefix(TRANSITIONDURATION, 18) + 'transition-duration:' + speed / 1000 + 's;';
    }

    function getAnimationDurationStyle (speed) {
      return getCSSPrefix(ANIMATIONDURATION, 17) + 'animation-duration:' + speed / 1000 + 's;';
    }

    function initStructure () {
      var classOuter = 'tns-outer',
          classInner = 'tns-inner';
          hasOption('gutter');

      outerWrapper.className = classOuter;
      innerWrapper.className = classInner;
      outerWrapper.id = slideId + '-ow';
      innerWrapper.id = slideId + '-iw';

      // set container properties
      if (container.id === '') { container.id = slideId; }
      newContainerClasses += PERCENTAGELAYOUT || autoWidth ? ' tns-subpixel' : ' tns-no-subpixel';
      newContainerClasses += CALC ? ' tns-calc' : ' tns-no-calc';
      if (autoWidth) { newContainerClasses += ' tns-autowidth'; }
      newContainerClasses += ' tns-' + options.axis;
      container.className += newContainerClasses;

      // add constrain layer for carousel
      if (carousel) {
        middleWrapper = doc.createElement('div');
        middleWrapper.id = slideId + '-mw';
        middleWrapper.className = 'tns-ovh';

        outerWrapper.appendChild(middleWrapper);
        middleWrapper.appendChild(innerWrapper);
      } else {
        outerWrapper.appendChild(innerWrapper);
      }

      if (autoHeight) {
        var wp = middleWrapper ? middleWrapper : innerWrapper;
        wp.className += ' tns-ah';
      }

      containerParent.insertBefore(outerWrapper, container);
      innerWrapper.appendChild(container);

      // add id, class, aria attributes
      // before clone slides
      forEach(slideItems, function(item, i) {
        addClass(item, 'tns-item');
        if (!item.id) { item.id = slideId + '-item' + i; }
        if (!carousel && animateNormal) { addClass(item, animateNormal); }
        setAttrs(item, {
          'aria-hidden': 'true',
          'tabindex': '-1'
        });
      });

      // ## clone slides
      // carousel: n + slides + n
      // gallery:      slides + n
      if (cloneCount) {
        var fragmentBefore = doc.createDocumentFragment(),
            fragmentAfter = doc.createDocumentFragment();

        for (var j = cloneCount; j--;) {
          var num = j%slideCount,
              cloneFirst = slideItems[num].cloneNode(true);
          addClass(cloneFirst, slideClonedClass);
          removeAttrs(cloneFirst, 'id');
          fragmentAfter.insertBefore(cloneFirst, fragmentAfter.firstChild);

          if (carousel) {
            var cloneLast = slideItems[slideCount - 1 - num].cloneNode(true);
            addClass(cloneLast, slideClonedClass);
            removeAttrs(cloneLast, 'id');
            fragmentBefore.appendChild(cloneLast);
          }
        }

        container.insertBefore(fragmentBefore, container.firstChild);
        container.appendChild(fragmentAfter);
        slideItems = container.children;
      }

    }

    function initSliderTransform () {
      // ## images loaded/failed
      if (hasOption('autoHeight') || autoWidth || !horizontal) {
        var imgs = container.querySelectorAll('img');

        // add img load event listener
        forEach(imgs, function(img) {
          var src = img.src;

          if (!lazyload) {
            // not data img
            if (src && src.indexOf('data:image') < 0) {
              img.src = '';
              addEvents(img, imgEvents);
              addClass(img, 'loading');

              img.src = src;
            // data img
            } else {
              imgLoaded(img);
            }
          }
        });

        // set imgsComplete
        raf(function(){ imgsLoadedCheck(arrayFromNodeList(imgs), function() { imgsComplete = true; }); });

        // reset imgs for auto height: check visible imgs only
        if (hasOption('autoHeight')) { imgs = getImageArray(index, Math.min(index + items - 1, slideCountNew - 1)); }

        lazyload ? initSliderTransformStyleCheck() : raf(function(){ imgsLoadedCheck(arrayFromNodeList(imgs), initSliderTransformStyleCheck); });

      } else {
        // set container transform property
        if (carousel) { doContainerTransformSilent(); }

        // update slider tools and events
        initTools();
        initEvents();
      }
    }

    function initSliderTransformStyleCheck () {
      if (autoWidth && slideCount > 1) {
        // check styles application
        var num = loop ? index : slideCount - 1;

        (function stylesApplicationCheck() {
          var left = slideItems[num].getBoundingClientRect().left;
          var right = slideItems[num - 1].getBoundingClientRect().right;

          (Math.abs(left - right) <= 1) ?
            initSliderTransformCore() :
            setTimeout(function(){ stylesApplicationCheck(); }, 16);
        })();

      } else {
        initSliderTransformCore();
      }
    }


    function initSliderTransformCore () {
      // run Fn()s which are rely on image loading
      if (!horizontal || autoWidth) {
        setSlidePositions();

        if (autoWidth) {
          rightBoundary = getRightBoundary();
          if (freezable) { freeze = getFreeze(); }
          indexMax = getIndexMax(); // <= slidePositions, rightBoundary <=
          resetVariblesWhenDisable(disable || freeze);
        } else {
          updateContentWrapperHeight();
        }
      }

      // set container transform property
      if (carousel) { doContainerTransformSilent(); }

      // update slider tools and events
      initTools();
      initEvents();
    }

    function initSheet () {
      // gallery:
      // set animation classes and left value for gallery slider
      if (!carousel) {
        for (var i = index, l = index + Math.min(slideCount, items); i < l; i++) {
          var item = slideItems[i];
          item.style.left = (i - index) * 100 / items + '%';
          addClass(item, animateIn);
          removeClass(item, animateNormal);
        }
      }

      // #### LAYOUT

      // ## INLINE-BLOCK VS FLOAT

      // ## PercentageLayout:
      // slides: inline-block
      // remove blank space between slides by set font-size: 0

      // ## Non PercentageLayout:
      // slides: float
      //         margin-right: -100%
      //         margin-left: ~

      // Resource: https://docs.google.com/spreadsheets/d/147up245wwTXeQYve3BRSAD4oVcvQmuGsFteJOeA5xNQ/edit?usp=sharing
      if (horizontal) {
        if (PERCENTAGELAYOUT || autoWidth) {
          addCSSRule(sheet, '#' + slideId + ' > .tns-item', 'font-size:' + win.getComputedStyle(slideItems[0]).fontSize + ';', getCssRulesLength(sheet));
          addCSSRule(sheet, '#' + slideId, 'font-size:0;', getCssRulesLength(sheet));
        } else if (carousel) {
          forEach(slideItems, function (slide, i) {
            slide.style.marginLeft = getSlideMarginLeft(i);
          });
        }
      }


      // ## BASIC STYLES
      if (CSSMQ) {
        // middle wrapper style
        if (TRANSITIONDURATION) {
          var str = middleWrapper && options.autoHeight ? getTransitionDurationStyle(options.speed) : '';
          addCSSRule(sheet, '#' + slideId + '-mw', str, getCssRulesLength(sheet));
        }

        // inner wrapper styles
        str = getInnerWrapperStyles(options.edgePadding, options.gutter, options.fixedWidth, options.speed, options.autoHeight);
        addCSSRule(sheet, '#' + slideId + '-iw', str, getCssRulesLength(sheet));

        // container styles
        if (carousel) {
          str = horizontal && !autoWidth ? 'width:' + getContainerWidth(options.fixedWidth, options.gutter, options.items) + ';' : '';
          if (TRANSITIONDURATION) { str += getTransitionDurationStyle(speed); }
          addCSSRule(sheet, '#' + slideId, str, getCssRulesLength(sheet));
        }

        // slide styles
        str = horizontal && !autoWidth ? getSlideWidthStyle(options.fixedWidth, options.gutter, options.items) : '';
        if (options.gutter) { str += getSlideGutterStyle(options.gutter); }
        // set gallery items transition-duration
        if (!carousel) {
          if (TRANSITIONDURATION) { str += getTransitionDurationStyle(speed); }
          if (ANIMATIONDURATION) { str += getAnimationDurationStyle(speed); }
        }
        if (str) { addCSSRule(sheet, '#' + slideId + ' > .tns-item', str, getCssRulesLength(sheet)); }

      // non CSS mediaqueries: IE8
      // ## update inner wrapper, container, slides if needed
      // set inline styles for inner wrapper & container
      // insert stylesheet (one line) for slides only (since slides are many)
      } else {
        // middle wrapper styles
        update_carousel_transition_duration();

        // inner wrapper styles
        innerWrapper.style.cssText = getInnerWrapperStyles(edgePadding, gutter, fixedWidth, autoHeight);

        // container styles
        if (carousel && horizontal && !autoWidth) {
          container.style.width = getContainerWidth(fixedWidth, gutter, items);
        }

        // slide styles
        var str = horizontal && !autoWidth ? getSlideWidthStyle(fixedWidth, gutter, items) : '';
        if (gutter) { str += getSlideGutterStyle(gutter); }

        // append to the last line
        if (str) { addCSSRule(sheet, '#' + slideId + ' > .tns-item', str, getCssRulesLength(sheet)); }
      }

      // ## MEDIAQUERIES
      if (responsive && CSSMQ) {
        for (var bp in responsive) {
          // bp: convert string to number
          bp = parseInt(bp);

          var opts = responsive[bp],
              str = '',
              middleWrapperStr = '',
              innerWrapperStr = '',
              containerStr = '',
              slideStr = '',
              itemsBP = !autoWidth ? getOption('items', bp) : null,
              fixedWidthBP = getOption('fixedWidth', bp),
              speedBP = getOption('speed', bp),
              edgePaddingBP = getOption('edgePadding', bp),
              autoHeightBP = getOption('autoHeight', bp),
              gutterBP = getOption('gutter', bp);

          // middle wrapper string
          if (TRANSITIONDURATION && middleWrapper && getOption('autoHeight', bp) && 'speed' in opts) {
            middleWrapperStr = '#' + slideId + '-mw{' + getTransitionDurationStyle(speedBP) + '}';
          }

          // inner wrapper string
          if ('edgePadding' in opts || 'gutter' in opts) {
            innerWrapperStr = '#' + slideId + '-iw{' + getInnerWrapperStyles(edgePaddingBP, gutterBP, fixedWidthBP, speedBP, autoHeightBP) + '}';
          }

          // container string
          if (carousel && horizontal && !autoWidth && ('fixedWidth' in opts || 'items' in opts || (fixedWidth && 'gutter' in opts))) {
            containerStr = 'width:' + getContainerWidth(fixedWidthBP, gutterBP, itemsBP) + ';';
          }
          if (TRANSITIONDURATION && 'speed' in opts) {
            containerStr += getTransitionDurationStyle(speedBP);
          }
          if (containerStr) {
            containerStr = '#' + slideId + '{' + containerStr + '}';
          }

          // slide string
          if ('fixedWidth' in opts || (fixedWidth && 'gutter' in opts) || !carousel && 'items' in opts) {
            slideStr += getSlideWidthStyle(fixedWidthBP, gutterBP, itemsBP);
          }
          if ('gutter' in opts) {
            slideStr += getSlideGutterStyle(gutterBP);
          }
          // set gallery items transition-duration
          if (!carousel && 'speed' in opts) {
            if (TRANSITIONDURATION) { slideStr += getTransitionDurationStyle(speedBP); }
            if (ANIMATIONDURATION) { slideStr += getAnimationDurationStyle(speedBP); }
          }
          if (slideStr) { slideStr = '#' + slideId + ' > .tns-item{' + slideStr + '}'; }

          // add up
          str = middleWrapperStr + innerWrapperStr + containerStr + slideStr;

          if (str) {
            sheet.insertRule('@media (min-width: ' + bp / 16 + 'em) {' + str + '}', sheet.cssRules.length);
          }
        }
      }
    }

    function initTools () {
      // == slides ==
      updateSlideStatus();

      // == live region ==
      outerWrapper.insertAdjacentHTML('afterbegin', '<div class="tns-liveregion tns-visually-hidden" aria-live="polite" aria-atomic="true">slide <span class="current">' + getLiveRegionStr() + '</span>  of ' + slideCount + '</div>');
      liveregionCurrent = outerWrapper.querySelector('.tns-liveregion .current');

      // == autoplayInit ==
      if (hasAutoplay) {
        var txt = autoplay ? 'stop' : 'start';
        if (autoplayButton) {
          setAttrs(autoplayButton, {'data-action': txt});
        } else if (options.autoplayButtonOutput) {
          outerWrapper.insertAdjacentHTML(getInsertPosition(options.autoplayPosition), '<button type="button" data-action="' + txt + '">' + autoplayHtmlStrings[0] + txt + autoplayHtmlStrings[1] + autoplayText[0] + '</button>');
          autoplayButton = outerWrapper.querySelector('[data-action]');
        }

        // add event
        if (autoplayButton) {
          addEvents(autoplayButton, {'click': toggleAutoplay});
        }

        if (autoplay) {
          startAutoplay();
          if (autoplayHoverPause) { addEvents(container, hoverEvents); }
          if (autoplayResetOnVisibility) { addEvents(container, visibilityEvent); }
        }
      }

      // == navInit ==
      if (hasNav) {
        // customized nav
        // will not hide the navs in case they're thumbnails
        if (navContainer) {
          setAttrs(navContainer, {'aria-label': 'Carousel Pagination'});
          navItems = navContainer.children;
          forEach(navItems, function(item, i) {
            setAttrs(item, {
              'data-nav': i,
              'tabindex': '-1',
              'aria-label': navStr + (i + 1),
              'aria-controls': slideId,
            });
          });

        // generated nav
        } else {
          var navHtml = '',
              hiddenStr = navAsThumbnails ? '' : 'style="display:none"';
          for (var i = 0; i < slideCount; i++) {
            // hide nav items by default
            navHtml += '<button type="button" data-nav="' + i +'" tabindex="-1" aria-controls="' + slideId + '" ' + hiddenStr + ' aria-label="' + navStr + (i + 1) +'"></button>';
          }
          navHtml = '<div class="tns-nav" aria-label="Carousel Pagination">' + navHtml + '</div>';
          outerWrapper.insertAdjacentHTML(getInsertPosition(options.navPosition), navHtml);

          navContainer = outerWrapper.querySelector('.tns-nav');
          navItems = navContainer.children;
        }

        updateNavVisibility();

        // add transition
        if (TRANSITIONDURATION) {
          var prefix = TRANSITIONDURATION.substring(0, TRANSITIONDURATION.length - 18).toLowerCase(),
              str = 'transition: all ' + speed / 1000 + 's';

          if (prefix) {
            str = '-' + prefix + '-' + str;
          }

          addCSSRule(sheet, '[aria-controls^=' + slideId + '-item]', str, getCssRulesLength(sheet));
        }

        setAttrs(navItems[navCurrentIndex], {'aria-label': navStr + (navCurrentIndex + 1) + navStrCurrent});
        removeAttrs(navItems[navCurrentIndex], 'tabindex');
        addClass(navItems[navCurrentIndex], navActiveClass);

        // add events
        addEvents(navContainer, navEvents);
      }



      // == controlsInit ==
      if (hasControls) {
        if (!controlsContainer && (!prevButton || !nextButton)) {
          outerWrapper.insertAdjacentHTML(getInsertPosition(options.controlsPosition), '<div class="tns-controls" aria-label="Carousel Navigation" tabindex="0"><button type="button" data-controls="prev" tabindex="-1" aria-controls="' + slideId +'">' + controlsText[0] + '</button><button type="button" data-controls="next" tabindex="-1" aria-controls="' + slideId +'">' + controlsText[1] + '</button></div>');

          controlsContainer = outerWrapper.querySelector('.tns-controls');
        }

        if (!prevButton || !nextButton) {
          prevButton = controlsContainer.children[0];
          nextButton = controlsContainer.children[1];
        }

        if (options.controlsContainer) {
          setAttrs(controlsContainer, {
            'aria-label': 'Carousel Navigation',
            'tabindex': '0'
          });
        }

        if (options.controlsContainer || (options.prevButton && options.nextButton)) {
          setAttrs([prevButton, nextButton], {
            'aria-controls': slideId,
            'tabindex': '-1',
          });
        }

        if (options.controlsContainer || (options.prevButton && options.nextButton)) {
          setAttrs(prevButton, {'data-controls' : 'prev'});
          setAttrs(nextButton, {'data-controls' : 'next'});
        }

        prevIsButton = isButton(prevButton);
        nextIsButton = isButton(nextButton);

        updateControlsStatus();

        // add events
        if (controlsContainer) {
          addEvents(controlsContainer, controlsEvents);
        } else {
          addEvents(prevButton, controlsEvents);
          addEvents(nextButton, controlsEvents);
        }
      }

      // hide tools if needed
      disableUI();
    }

    function initEvents () {
      // add events
      if (carousel && TRANSITIONEND) {
        var eve = {};
        eve[TRANSITIONEND] = onTransitionEnd;
        addEvents(container, eve);
      }

      if (touch) { addEvents(container, touchEvents, options.preventScrollOnTouch); }
      if (mouseDrag) { addEvents(container, dragEvents); }
      if (arrowKeys) { addEvents(doc, docmentKeydownEvent); }

      if (nested === 'inner') {
        events.on('outerResized', function () {
          resizeTasks();
          events.emit('innerLoaded', info());
        });
      } else if (responsive || fixedWidth || autoWidth || autoHeight || !horizontal) {
        addEvents(win, {'resize': onResize});
      }

      if (autoHeight) {
        if (nested === 'outer') {
          events.on('innerLoaded', doAutoHeight);
        } else if (!disable) { doAutoHeight(); }
      }

      doLazyLoad();
      if (disable) { disableSlider(); } else if (freeze) { freezeSlider(); }

      events.on('indexChanged', additionalUpdates);
      if (nested === 'inner') { events.emit('innerLoaded', info()); }
      if (typeof onInit === 'function') { onInit(info()); }
      isOn = true;
    }

    function destroy () {
      // sheet
      sheet.disabled = true;
      if (sheet.ownerNode) { sheet.ownerNode.remove(); }

      // remove win event listeners
      removeEvents(win, {'resize': onResize});

      // arrowKeys, controls, nav
      if (arrowKeys) { removeEvents(doc, docmentKeydownEvent); }
      if (controlsContainer) { removeEvents(controlsContainer, controlsEvents); }
      if (navContainer) { removeEvents(navContainer, navEvents); }

      // autoplay
      removeEvents(container, hoverEvents);
      removeEvents(container, visibilityEvent);
      if (autoplayButton) { removeEvents(autoplayButton, {'click': toggleAutoplay}); }
      if (autoplay) { clearInterval(autoplayTimer); }

      // container
      if (carousel && TRANSITIONEND) {
        var eve = {};
        eve[TRANSITIONEND] = onTransitionEnd;
        removeEvents(container, eve);
      }
      if (touch) { removeEvents(container, touchEvents); }
      if (mouseDrag) { removeEvents(container, dragEvents); }

      // cache Object values in options && reset HTML
      var htmlList = [containerHTML, controlsContainerHTML, prevButtonHTML, nextButtonHTML, navContainerHTML, autoplayButtonHTML];

      tnsList.forEach(function(item, i) {
        var el = item === 'container' ? outerWrapper : options[item];

        if (typeof el === 'object' && el) {
          var prevEl = el.previousElementSibling ? el.previousElementSibling : false,
              parentEl = el.parentNode;
          el.outerHTML = htmlList[i];
          options[item] = prevEl ? prevEl.nextElementSibling : parentEl.firstElementChild;
        }
      });


      // reset variables
      tnsList = animateIn = animateOut = animateDelay = animateNormal = horizontal = outerWrapper = innerWrapper = container = containerParent = containerHTML = slideItems = slideCount = breakpointZone = windowWidth = autoWidth = fixedWidth = edgePadding = gutter = viewport = items = slideBy = viewportMax = arrowKeys = speed = rewind = loop = autoHeight = sheet = lazyload = slidePositions = slideItemsOut = cloneCount = slideCountNew = hasRightDeadZone = rightBoundary = updateIndexBeforeTransform = transformAttr = transformPrefix = transformPostfix = getIndexMax = index = indexCached = indexMin = indexMax = swipeAngle = moveDirectionExpected = running = onInit = events = newContainerClasses = slideId = disable = disabled = freezable = freeze = frozen = controlsEvents = navEvents = hoverEvents = visibilityEvent = docmentKeydownEvent = touchEvents = dragEvents = hasControls = hasNav = navAsThumbnails = hasAutoplay = hasTouch = hasMouseDrag = slideActiveClass = imgCompleteClass = imgEvents = imgsComplete = controls = controlsText = controlsContainer = controlsContainerHTML = prevButton = nextButton = prevIsButton = nextIsButton = nav = navContainer = navContainerHTML = navItems = pages = pagesCached = navClicked = navCurrentIndex = navCurrentIndexCached = navActiveClass = navStr = navStrCurrent = autoplay = autoplayTimeout = autoplayDirection = autoplayText = autoplayHoverPause = autoplayButton = autoplayButtonHTML = autoplayResetOnVisibility = autoplayHtmlStrings = autoplayTimer = animating = autoplayHoverPaused = autoplayUserPaused = autoplayVisibilityPaused = initPosition = lastPosition = translateInit = panStart = rafIndex = getDist = touch = mouseDrag = null;
      // check variables
      // [animateIn, animateOut, animateDelay, animateNormal, horizontal, outerWrapper, innerWrapper, container, containerParent, containerHTML, slideItems, slideCount, breakpointZone, windowWidth, autoWidth, fixedWidth, edgePadding, gutter, viewport, items, slideBy, viewportMax, arrowKeys, speed, rewind, loop, autoHeight, sheet, lazyload, slidePositions, slideItemsOut, cloneCount, slideCountNew, hasRightDeadZone, rightBoundary, updateIndexBeforeTransform, transformAttr, transformPrefix, transformPostfix, getIndexMax, index, indexCached, indexMin, indexMax, resizeTimer, swipeAngle, moveDirectionExpected, running, onInit, events, newContainerClasses, slideId, disable, disabled, freezable, freeze, frozen, controlsEvents, navEvents, hoverEvents, visibilityEvent, docmentKeydownEvent, touchEvents, dragEvents, hasControls, hasNav, navAsThumbnails, hasAutoplay, hasTouch, hasMouseDrag, slideActiveClass, imgCompleteClass, imgEvents, imgsComplete, controls, controlsText, controlsContainer, controlsContainerHTML, prevButton, nextButton, prevIsButton, nextIsButton, nav, navContainer, navContainerHTML, navItems, pages, pagesCached, navClicked, navCurrentIndex, navCurrentIndexCached, navActiveClass, navStr, navStrCurrent, autoplay, autoplayTimeout, autoplayDirection, autoplayText, autoplayHoverPause, autoplayButton, autoplayButtonHTML, autoplayResetOnVisibility, autoplayHtmlStrings, autoplayTimer, animating, autoplayHoverPaused, autoplayUserPaused, autoplayVisibilityPaused, initPosition, lastPosition, translateInit, disX, disY, panStart, rafIndex, getDist, touch, mouseDrag ].forEach(function(item) { if (item !== null) { console.log(item); } });

      for (var a in this) {
        if (a !== 'rebuild') { this[a] = null; }
      }
      isOn = false;
    }

  // === ON RESIZE ===
    // responsive || fixedWidth || autoWidth || !horizontal
    function onResize (e) {
      raf(function(){ resizeTasks(getEvent(e)); });
    }

    function resizeTasks (e) {
      if (!isOn) { return; }
      if (nested === 'outer') { events.emit('outerResized', info(e)); }
      windowWidth = getWindowWidth();
      var bpChanged,
          breakpointZoneTem = breakpointZone,
          needContainerTransform = false;

      if (responsive) {
        setBreakpointZone();
        bpChanged = breakpointZoneTem !== breakpointZone;
        // if (hasRightDeadZone) { needContainerTransform = true; } // *?
        if (bpChanged) { events.emit('newBreakpointStart', info(e)); }
      }

      var indChanged,
          itemsChanged,
          itemsTem = items,
          disableTem = disable,
          freezeTem = freeze,
          arrowKeysTem = arrowKeys,
          controlsTem = controls,
          navTem = nav,
          touchTem = touch,
          mouseDragTem = mouseDrag,
          autoplayTem = autoplay,
          autoplayHoverPauseTem = autoplayHoverPause,
          autoplayResetOnVisibilityTem = autoplayResetOnVisibility,
          indexTem = index;

      if (bpChanged) {
        var fixedWidthTem = fixedWidth,
            autoHeightTem = autoHeight,
            controlsTextTem = controlsText,
            centerTem = center,
            autoplayTextTem = autoplayText;

        if (!CSSMQ) {
          var gutterTem = gutter,
              edgePaddingTem = edgePadding;
        }
      }

      // get option:
      // fixed width: viewport, fixedWidth, gutter => items
      // others: window width => all variables
      // all: items => slideBy
      arrowKeys = getOption('arrowKeys');
      controls = getOption('controls');
      nav = getOption('nav');
      touch = getOption('touch');
      center = getOption('center');
      mouseDrag = getOption('mouseDrag');
      autoplay = getOption('autoplay');
      autoplayHoverPause = getOption('autoplayHoverPause');
      autoplayResetOnVisibility = getOption('autoplayResetOnVisibility');

      if (bpChanged) {
        disable = getOption('disable');
        fixedWidth = getOption('fixedWidth');
        speed = getOption('speed');
        autoHeight = getOption('autoHeight');
        controlsText = getOption('controlsText');
        autoplayText = getOption('autoplayText');
        autoplayTimeout = getOption('autoplayTimeout');

        if (!CSSMQ) {
          edgePadding = getOption('edgePadding');
          gutter = getOption('gutter');
        }
      }
      // update options
      resetVariblesWhenDisable(disable);

      viewport = getViewportWidth(); // <= edgePadding, gutter
      if ((!horizontal || autoWidth) && !disable) {
        setSlidePositions();
        if (!horizontal) {
          updateContentWrapperHeight(); // <= setSlidePositions
          needContainerTransform = true;
        }
      }
      if (fixedWidth || autoWidth) {
        rightBoundary = getRightBoundary(); // autoWidth: <= viewport, slidePositions, gutter
                                            // fixedWidth: <= viewport, fixedWidth, gutter
        indexMax = getIndexMax(); // autoWidth: <= rightBoundary, slidePositions
                                  // fixedWidth: <= rightBoundary, fixedWidth, gutter
      }

      if (bpChanged || fixedWidth) {
        items = getOption('items');
        slideBy = getOption('slideBy');
        itemsChanged = items !== itemsTem;

        if (itemsChanged) {
          if (!fixedWidth && !autoWidth) { indexMax = getIndexMax(); } // <= items
          // check index before transform in case
          // slider reach the right edge then items become bigger
          updateIndex();
        }
      }

      if (bpChanged) {
        if (disable !== disableTem) {
          if (disable) {
            disableSlider();
          } else {
            enableSlider(); // <= slidePositions, rightBoundary, indexMax
          }
        }
      }

      if (freezable && (bpChanged || fixedWidth || autoWidth)) {
        freeze = getFreeze(); // <= autoWidth: slidePositions, gutter, viewport, rightBoundary
                              // <= fixedWidth: fixedWidth, gutter, rightBoundary
                              // <= others: items

        if (freeze !== freezeTem) {
          if (freeze) {
            doContainerTransform(getContainerTransformValue(getStartIndex(0)));
            freezeSlider();
          } else {
            unfreezeSlider();
            needContainerTransform = true;
          }
        }
      }

      resetVariblesWhenDisable(disable || freeze); // controls, nav, touch, mouseDrag, arrowKeys, autoplay, autoplayHoverPause, autoplayResetOnVisibility
      if (!autoplay) { autoplayHoverPause = autoplayResetOnVisibility = false; }

      if (arrowKeys !== arrowKeysTem) {
        arrowKeys ?
          addEvents(doc, docmentKeydownEvent) :
          removeEvents(doc, docmentKeydownEvent);
      }
      if (controls !== controlsTem) {
        if (controls) {
          if (controlsContainer) {
            showElement(controlsContainer);
          } else {
            if (prevButton) { showElement(prevButton); }
            if (nextButton) { showElement(nextButton); }
          }
        } else {
          if (controlsContainer) {
            hideElement(controlsContainer);
          } else {
            if (prevButton) { hideElement(prevButton); }
            if (nextButton) { hideElement(nextButton); }
          }
        }
      }
      if (nav !== navTem) {
        if (nav) {
          showElement(navContainer);
          updateNavVisibility();
        } else {
          hideElement(navContainer);
        }
      }
      if (touch !== touchTem) {
        touch ?
          addEvents(container, touchEvents, options.preventScrollOnTouch) :
          removeEvents(container, touchEvents);
      }
      if (mouseDrag !== mouseDragTem) {
        mouseDrag ?
          addEvents(container, dragEvents) :
          removeEvents(container, dragEvents);
      }
      if (autoplay !== autoplayTem) {
        if (autoplay) {
          if (autoplayButton) { showElement(autoplayButton); }
          if (!animating && !autoplayUserPaused) { startAutoplay(); }
        } else {
          if (autoplayButton) { hideElement(autoplayButton); }
          if (animating) { stopAutoplay(); }
        }
      }
      if (autoplayHoverPause !== autoplayHoverPauseTem) {
        autoplayHoverPause ?
          addEvents(container, hoverEvents) :
          removeEvents(container, hoverEvents);
      }
      if (autoplayResetOnVisibility !== autoplayResetOnVisibilityTem) {
        autoplayResetOnVisibility ?
          addEvents(doc, visibilityEvent) :
          removeEvents(doc, visibilityEvent);
      }

      if (bpChanged) {
        if (fixedWidth !== fixedWidthTem || center !== centerTem) { needContainerTransform = true; }

        if (autoHeight !== autoHeightTem) {
          if (!autoHeight) { innerWrapper.style.height = ''; }
        }

        if (controls && controlsText !== controlsTextTem) {
          prevButton.innerHTML = controlsText[0];
          nextButton.innerHTML = controlsText[1];
        }

        if (autoplayButton && autoplayText !== autoplayTextTem) {
          var i = autoplay ? 1 : 0,
              html = autoplayButton.innerHTML,
              len = html.length - autoplayTextTem[i].length;
          if (html.substring(len) === autoplayTextTem[i]) {
            autoplayButton.innerHTML = html.substring(0, len) + autoplayText[i];
          }
        }
      } else {
        if (center && (fixedWidth || autoWidth)) { needContainerTransform = true; }
      }

      if (itemsChanged || fixedWidth && !autoWidth) {
        pages = getPages();
        updateNavVisibility();
      }

      indChanged = index !== indexTem;
      if (indChanged) {
        events.emit('indexChanged', info());
        needContainerTransform = true;
      } else if (itemsChanged) {
        if (!indChanged) { additionalUpdates(); }
      } else if (fixedWidth || autoWidth) {
        doLazyLoad();
        updateSlideStatus();
        updateLiveRegion();
      }

      if (itemsChanged && !carousel) { updateGallerySlidePositions(); }

      if (!disable && !freeze) {
        // non-mediaqueries: IE8
        if (bpChanged && !CSSMQ) {
          // middle wrapper styles

          // inner wrapper styles
          if (edgePadding !== edgePaddingTem || gutter !== gutterTem) {
            innerWrapper.style.cssText = getInnerWrapperStyles(edgePadding, gutter, fixedWidth, speed, autoHeight);
          }

          if (horizontal) {
            // container styles
            if (carousel) {
              container.style.width = getContainerWidth(fixedWidth, gutter, items);
            }

            // slide styles
            var str = getSlideWidthStyle(fixedWidth, gutter, items) +
                      getSlideGutterStyle(gutter);

            // remove the last line and
            // add new styles
            removeCSSRule(sheet, getCssRulesLength(sheet) - 1);
            addCSSRule(sheet, '#' + slideId + ' > .tns-item', str, getCssRulesLength(sheet));
          }
        }

        // auto height
        if (autoHeight) { doAutoHeight(); }

        if (needContainerTransform) {
          doContainerTransformSilent();
          indexCached = index;
        }
      }

      if (bpChanged) { events.emit('newBreakpointEnd', info(e)); }
    }





    // === INITIALIZATION FUNCTIONS === //
    function getFreeze () {
      if (!fixedWidth && !autoWidth) {
        var a = center ? items - (items - 1) / 2 : items;
        return  slideCount <= a;
      }

      var width = fixedWidth ? (fixedWidth + gutter) * slideCount : slidePositions[slideCount],
          vp = edgePadding ? viewport + edgePadding * 2 : viewport + gutter;

      if (center) {
        vp -= fixedWidth ? (viewport - fixedWidth) / 2 : (viewport - (slidePositions[index + 1] - slidePositions[index] - gutter)) / 2;
      }

      return width <= vp;
    }

    function setBreakpointZone () {
      breakpointZone = 0;
      for (var bp in responsive) {
        bp = parseInt(bp); // convert string to number
        if (windowWidth >= bp) { breakpointZone = bp; }
      }
    }

    // (slideBy, indexMin, indexMax) => index
    var updateIndex = (function () {
      return loop ?
        carousel ?
          // loop + carousel
          function () {
            var leftEdge = indexMin,
                rightEdge = indexMax;

            leftEdge += slideBy;
            rightEdge -= slideBy;

            // adjust edges when has edge paddings
            // or fixed-width slider with extra space on the right side
            if (edgePadding) {
              leftEdge += 1;
              rightEdge -= 1;
            } else if (fixedWidth) {
              if ((viewport + gutter)%(fixedWidth + gutter)) { rightEdge -= 1; }
            }

            if (cloneCount) {
              if (index > rightEdge) {
                index -= slideCount;
              } else if (index < leftEdge) {
                index += slideCount;
              }
            }
          } :
          // loop + gallery
          function() {
            if (index > indexMax) {
              while (index >= indexMin + slideCount) { index -= slideCount; }
            } else if (index < indexMin) {
              while (index <= indexMax - slideCount) { index += slideCount; }
            }
          } :
        // non-loop
        function() {
          index = Math.max(indexMin, Math.min(indexMax, index));
        };
    })();

    function disableUI () {
      if (!autoplay && autoplayButton) { hideElement(autoplayButton); }
      if (!nav && navContainer) { hideElement(navContainer); }
      if (!controls) {
        if (controlsContainer) {
          hideElement(controlsContainer);
        } else {
          if (prevButton) { hideElement(prevButton); }
          if (nextButton) { hideElement(nextButton); }
        }
      }
    }

    function enableUI () {
      if (autoplay && autoplayButton) { showElement(autoplayButton); }
      if (nav && navContainer) { showElement(navContainer); }
      if (controls) {
        if (controlsContainer) {
          showElement(controlsContainer);
        } else {
          if (prevButton) { showElement(prevButton); }
          if (nextButton) { showElement(nextButton); }
        }
      }
    }

    function freezeSlider () {
      if (frozen) { return; }

      // remove edge padding from inner wrapper
      if (edgePadding) { innerWrapper.style.margin = '0px'; }

      // add class tns-transparent to cloned slides
      if (cloneCount) {
        var str = 'tns-transparent';
        for (var i = cloneCount; i--;) {
          if (carousel) { addClass(slideItems[i], str); }
          addClass(slideItems[slideCountNew - i - 1], str);
        }
      }

      // update tools
      disableUI();

      frozen = true;
    }

    function unfreezeSlider () {
      if (!frozen) { return; }

      // restore edge padding for inner wrapper
      // for mordern browsers
      if (edgePadding && CSSMQ) { innerWrapper.style.margin = ''; }

      // remove class tns-transparent to cloned slides
      if (cloneCount) {
        var str = 'tns-transparent';
        for (var i = cloneCount; i--;) {
          if (carousel) { removeClass(slideItems[i], str); }
          removeClass(slideItems[slideCountNew - i - 1], str);
        }
      }

      // update tools
      enableUI();

      frozen = false;
    }

    function disableSlider () {
      if (disabled) { return; }

      sheet.disabled = true;
      container.className = container.className.replace(newContainerClasses.substring(1), '');
      removeAttrs(container, ['style']);
      if (loop) {
        for (var j = cloneCount; j--;) {
          if (carousel) { hideElement(slideItems[j]); }
          hideElement(slideItems[slideCountNew - j - 1]);
        }
      }

      // vertical slider
      if (!horizontal || !carousel) { removeAttrs(innerWrapper, ['style']); }

      // gallery
      if (!carousel) {
        for (var i = index, l = index + slideCount; i < l; i++) {
          var item = slideItems[i];
          removeAttrs(item, ['style']);
          removeClass(item, animateIn);
          removeClass(item, animateNormal);
        }
      }

      // update tools
      disableUI();

      disabled = true;
    }

    function enableSlider () {
      if (!disabled) { return; }

      sheet.disabled = false;
      container.className += newContainerClasses;
      doContainerTransformSilent();

      if (loop) {
        for (var j = cloneCount; j--;) {
          if (carousel) { showElement(slideItems[j]); }
          showElement(slideItems[slideCountNew - j - 1]);
        }
      }

      // gallery
      if (!carousel) {
        for (var i = index, l = index + slideCount; i < l; i++) {
          var item = slideItems[i],
              classN = i < index + items ? animateIn : animateNormal;
          item.style.left = (i - index) * 100 / items + '%';
          addClass(item, classN);
        }
      }

      // update tools
      enableUI();

      disabled = false;
    }

    function updateLiveRegion () {
      var str = getLiveRegionStr();
      if (liveregionCurrent.innerHTML !== str) { liveregionCurrent.innerHTML = str; }
    }

    function getLiveRegionStr () {
      var arr = getVisibleSlideRange(),
          start = arr[0] + 1,
          end = arr[1] + 1;
      return start === end ? start + '' : start + ' to ' + end;
    }

    function getVisibleSlideRange (val) {
      if (val == null) { val = getContainerTransformValue(); }
      var start = index, end, rangestart, rangeend;

      // get range start, range end for autoWidth and fixedWidth
      if (center || edgePadding) {
        if (autoWidth || fixedWidth) {
          rangestart = - (parseFloat(val) + edgePadding);
          rangeend = rangestart + viewport + edgePadding * 2;
        }
      } else {
        if (autoWidth) {
          rangestart = slidePositions[index];
          rangeend = rangestart + viewport;
        }
      }

      // get start, end
      // - check auto width
      if (autoWidth) {
        slidePositions.forEach(function(point, i) {
          if (i < slideCountNew) {
            if ((center || edgePadding) && point <= rangestart + 0.5) { start = i; }
            if (rangeend - point >= 0.5) { end = i; }
          }
        });

      // - check percentage width, fixed width
      } else {

        if (fixedWidth) {
          var cell = fixedWidth + gutter;
          if (center || edgePadding) {
            start = Math.floor(rangestart/cell);
            end = Math.ceil(rangeend/cell - 1);
          } else {
            end = start + Math.ceil(viewport/cell) - 1;
          }

        } else {
          if (center || edgePadding) {
            var a = items - 1;
            if (center) {
              start -= a / 2;
              end = index + a / 2;
            } else {
              end = index + a;
            }

            if (edgePadding) {
              var b = edgePadding * items / viewport;
              start -= b;
              end += b;
            }

            start = Math.floor(start);
            end = Math.ceil(end);
          } else {
            end = start + items - 1;
          }
        }

        start = Math.max(start, 0);
        end = Math.min(end, slideCountNew - 1);
      }

      return [start, end];
    }

    function doLazyLoad () {
      if (lazyload && !disable) {
        var arg = getVisibleSlideRange();
        arg.push(lazyloadSelector);

        getImageArray.apply(null, arg).forEach(function (img) {
          if (!hasClass(img, imgCompleteClass)) {
            // stop propagation transitionend event to container
            var eve = {};
            eve[TRANSITIONEND] = function (e) { e.stopPropagation(); };
            addEvents(img, eve);

            addEvents(img, imgEvents);

            // update src
            img.src = getAttr(img, 'data-src');

            // update srcset
            var srcset = getAttr(img, 'data-srcset');
            if (srcset) { img.srcset = srcset; }

            addClass(img, 'loading');
          }
        });
      }
    }

    function onImgLoaded (e) {
      imgLoaded(getTarget(e));
    }

    function onImgFailed (e) {
      imgFailed(getTarget(e));
    }

    function imgLoaded (img) {
      addClass(img, 'loaded');
      imgCompleted(img);
    }

    function imgFailed (img) {
      addClass(img, 'failed');
      imgCompleted(img);
    }

    function imgCompleted (img) {
      addClass(img, imgCompleteClass);
      removeClass(img, 'loading');
      removeEvents(img, imgEvents);
    }

    function getImageArray (start, end, imgSelector) {
      var imgs = [];
      if (!imgSelector) { imgSelector = 'img'; }

      while (start <= end) {
        forEach(slideItems[start].querySelectorAll(imgSelector), function (img) { imgs.push(img); });
        start++;
      }

      return imgs;
    }

    // check if all visible images are loaded
    // and update container height if it's done
    function doAutoHeight () {
      var imgs = getImageArray.apply(null, getVisibleSlideRange());
      raf(function(){ imgsLoadedCheck(imgs, updateInnerWrapperHeight); });
    }

    function imgsLoadedCheck (imgs, cb) {
      // execute callback function if all images are complete
      if (imgsComplete) { return cb(); }

      // check image classes
      imgs.forEach(function (img, index) {
        if (!lazyload && img.complete) { imgCompleted(img); } // Check image.complete
        if (hasClass(img, imgCompleteClass)) { imgs.splice(index, 1); }
      });

      // execute callback function if selected images are all complete
      if (!imgs.length) { return cb(); }

      // otherwise execute this functiona again
      raf(function(){ imgsLoadedCheck(imgs, cb); });
    }

    function additionalUpdates () {
      doLazyLoad();
      updateSlideStatus();
      updateLiveRegion();
      updateControlsStatus();
      updateNavStatus();
    }


    function update_carousel_transition_duration () {
      if (carousel && autoHeight) {
        middleWrapper.style[TRANSITIONDURATION] = speed / 1000 + 's';
      }
    }

    function getMaxSlideHeight (slideStart, slideRange) {
      var heights = [];
      for (var i = slideStart, l = Math.min(slideStart + slideRange, slideCountNew); i < l; i++) {
        heights.push(slideItems[i].offsetHeight);
      }

      return Math.max.apply(null, heights);
    }

    // update inner wrapper height
    // 1. get the max-height of the visible slides
    // 2. set transitionDuration to speed
    // 3. update inner wrapper height to max-height
    // 4. set transitionDuration to 0s after transition done
    function updateInnerWrapperHeight () {
      var maxHeight = autoHeight ? getMaxSlideHeight(index, items) : getMaxSlideHeight(cloneCount, slideCount),
          wp = middleWrapper ? middleWrapper : innerWrapper;

      if (wp.style.height !== maxHeight) { wp.style.height = maxHeight + 'px'; }
    }

    // get the distance from the top edge of the first slide to each slide
    // (init) => slidePositions
    function setSlidePositions () {
      slidePositions = [0];
      var attr = horizontal ? 'left' : 'top',
          attr2 = horizontal ? 'right' : 'bottom',
          base = slideItems[0].getBoundingClientRect()[attr];

      forEach(slideItems, function(item, i) {
        // skip the first slide
        if (i) { slidePositions.push(item.getBoundingClientRect()[attr] - base); }
        // add the end edge
        if (i === slideCountNew - 1) { slidePositions.push(item.getBoundingClientRect()[attr2] - base); }
      });
    }

    // update slide
    function updateSlideStatus () {
      var range = getVisibleSlideRange(),
          start = range[0],
          end = range[1];

      forEach(slideItems, function(item, i) {
        // show slides
        if (i >= start && i <= end) {
          if (hasAttr(item, 'aria-hidden')) {
            removeAttrs(item, ['aria-hidden', 'tabindex']);
            addClass(item, slideActiveClass);
          }
        // hide slides
        } else {
          if (!hasAttr(item, 'aria-hidden')) {
            setAttrs(item, {
              'aria-hidden': 'true',
              'tabindex': '-1'
            });
            removeClass(item, slideActiveClass);
          }
        }
      });
    }

    // gallery: update slide position
    function updateGallerySlidePositions () {
      var l = index + Math.min(slideCount, items);
      for (var i = slideCountNew; i--;) {
        var item = slideItems[i];

        if (i >= index && i < l) {
          // add transitions to visible slides when adjusting their positions
          addClass(item, 'tns-moving');

          item.style.left = (i - index) * 100 / items + '%';
          addClass(item, animateIn);
          removeClass(item, animateNormal);
        } else if (item.style.left) {
          item.style.left = '';
          addClass(item, animateNormal);
          removeClass(item, animateIn);
        }

        // remove outlet animation
        removeClass(item, animateOut);
      }

      // removing '.tns-moving'
      setTimeout(function() {
        forEach(slideItems, function(el) {
          removeClass(el, 'tns-moving');
        });
      }, 300);
    }

    // set tabindex on Nav
    function updateNavStatus () {
      // get current nav
      if (nav) {
        navCurrentIndex = navClicked >= 0 ? navClicked : getCurrentNavIndex();
        navClicked = -1;

        if (navCurrentIndex !== navCurrentIndexCached) {
          var navPrev = navItems[navCurrentIndexCached],
              navCurrent = navItems[navCurrentIndex];

          setAttrs(navPrev, {
            'tabindex': '-1',
            'aria-label': navStr + (navCurrentIndexCached + 1)
          });
          removeClass(navPrev, navActiveClass);

          setAttrs(navCurrent, {'aria-label': navStr + (navCurrentIndex + 1) + navStrCurrent});
          removeAttrs(navCurrent, 'tabindex');
          addClass(navCurrent, navActiveClass);

          navCurrentIndexCached = navCurrentIndex;
        }
      }
    }

    function getLowerCaseNodeName (el) {
      return el.nodeName.toLowerCase();
    }

    function isButton (el) {
      return getLowerCaseNodeName(el) === 'button';
    }

    function isAriaDisabled (el) {
      return el.getAttribute('aria-disabled') === 'true';
    }

    function disEnableElement (isButton, el, val) {
      if (isButton) {
        el.disabled = val;
      } else {
        el.setAttribute('aria-disabled', val.toString());
      }
    }

    // set 'disabled' to true on controls when reach the edges
    function updateControlsStatus () {
      if (!controls || rewind || loop) { return; }

      var prevDisabled = (prevIsButton) ? prevButton.disabled : isAriaDisabled(prevButton),
          nextDisabled = (nextIsButton) ? nextButton.disabled : isAriaDisabled(nextButton),
          disablePrev = (index <= indexMin) ? true : false,
          disableNext = (!rewind && index >= indexMax) ? true : false;

      if (disablePrev && !prevDisabled) {
        disEnableElement(prevIsButton, prevButton, true);
      }
      if (!disablePrev && prevDisabled) {
        disEnableElement(prevIsButton, prevButton, false);
      }
      if (disableNext && !nextDisabled) {
        disEnableElement(nextIsButton, nextButton, true);
      }
      if (!disableNext && nextDisabled) {
        disEnableElement(nextIsButton, nextButton, false);
      }
    }

    // set duration
    function resetDuration (el, str) {
      if (TRANSITIONDURATION) { el.style[TRANSITIONDURATION] = str; }
    }

    function getSliderWidth () {
      return fixedWidth ? (fixedWidth + gutter) * slideCountNew : slidePositions[slideCountNew];
    }

    function getCenterGap (num) {
      if (num == null) { num = index; }

      var gap = edgePadding ? gutter : 0;
      return autoWidth ? ((viewport - gap) - (slidePositions[num + 1] - slidePositions[num] - gutter))/2 :
        fixedWidth ? (viewport - fixedWidth) / 2 :
          (items - 1) / 2;
    }

    function getRightBoundary () {
      var gap = edgePadding ? gutter : 0,
          result = (viewport + gap) - getSliderWidth();

      if (center && !loop) {
        result = fixedWidth ? - (fixedWidth + gutter) * (slideCountNew - 1) - getCenterGap() :
          getCenterGap(slideCountNew - 1) - slidePositions[slideCountNew - 1];
      }
      if (result > 0) { result = 0; }

      return result;
    }

    function getContainerTransformValue (num) {
      if (num == null) { num = index; }

      var val;
      if (horizontal && !autoWidth) {
        if (fixedWidth) {
          val = - (fixedWidth + gutter) * num;
          if (center) { val += getCenterGap(); }
        } else {
          var denominator = TRANSFORM ? slideCountNew : items;
          if (center) { num -= getCenterGap(); }
          val = - num * 100 / denominator;
        }
      } else {
        val = - slidePositions[num];
        if (center && autoWidth) {
          val += getCenterGap();
        }
      }

      if (hasRightDeadZone) { val = Math.max(val, rightBoundary); }

      val += (horizontal && !autoWidth && !fixedWidth) ? '%' : 'px';

      return val;
    }

    function doContainerTransformSilent (val) {
      resetDuration(container, '0s');
      doContainerTransform(val);
    }

    function doContainerTransform (val) {
      if (val == null) { val = getContainerTransformValue(); }
      container.style[transformAttr] = transformPrefix + val + transformPostfix;
    }

    function animateSlide (number, classOut, classIn, isOut) {
      var l = number + items;
      if (!loop) { l = Math.min(l, slideCountNew); }

      for (var i = number; i < l; i++) {
          var item = slideItems[i];

        // set item positions
        if (!isOut) { item.style.left = (i - index) * 100 / items + '%'; }

        if (animateDelay && TRANSITIONDELAY) {
          item.style[TRANSITIONDELAY] = item.style[ANIMATIONDELAY] = animateDelay * (i - number) / 1000 + 's';
        }
        removeClass(item, classOut);
        addClass(item, classIn);

        if (isOut) { slideItemsOut.push(item); }
      }
    }

    // make transfer after click/drag:
    // 1. change 'transform' property for mordern browsers
    // 2. change 'left' property for legacy browsers
    var transformCore = (function () {
      return carousel ?
        function () {
          resetDuration(container, '');
          if (TRANSITIONDURATION || !speed) {
            // for morden browsers with non-zero duration or
            // zero duration for all browsers
            doContainerTransform();
            // run fallback function manually
            // when duration is 0 / container is hidden
            if (!speed || !isVisible(container)) { onTransitionEnd(); }

          } else {
            // for old browser with non-zero duration
            jsTransform(container, transformAttr, transformPrefix, transformPostfix, getContainerTransformValue(), speed, onTransitionEnd);
          }

          if (!horizontal) { updateContentWrapperHeight(); }
        } :
        function () {
          slideItemsOut = [];

          var eve = {};
          eve[TRANSITIONEND] = eve[ANIMATIONEND] = onTransitionEnd;
          removeEvents(slideItems[indexCached], eve);
          addEvents(slideItems[index], eve);

          animateSlide(indexCached, animateIn, animateOut, true);
          animateSlide(index, animateNormal, animateIn);

          // run fallback function manually
          // when transition or animation not supported / duration is 0
          if (!TRANSITIONEND || !ANIMATIONEND || !speed || !isVisible(container)) { onTransitionEnd(); }
        };
    })();

    function render (e, sliderMoved) {
      if (updateIndexBeforeTransform) { updateIndex(); }

      // render when slider was moved (touch or drag) even though index may not change
      if (index !== indexCached || sliderMoved) {
        // events
        events.emit('indexChanged', info());
        events.emit('transitionStart', info());
        if (autoHeight) { doAutoHeight(); }

        // pause autoplay when click or keydown from user
        if (animating && e && ['click', 'keydown'].indexOf(e.type) >= 0) { stopAutoplay(); }

        running = true;
        transformCore();
      }
    }

    /*
     * Transfer prefixed properties to the same format
     * CSS: -Webkit-Transform => webkittransform
     * JS: WebkitTransform => webkittransform
     * @param {string} str - property
     *
     */
    function strTrans (str) {
      return str.toLowerCase().replace(/-/g, '');
    }

    // AFTER TRANSFORM
    // Things need to be done after a transfer:
    // 1. check index
    // 2. add classes to visible slide
    // 3. disable controls buttons when reach the first/last slide in non-loop slider
    // 4. update nav status
    // 5. lazyload images
    // 6. update container height
    function onTransitionEnd (event) {
      // check running on gallery mode
      // make sure trantionend/animationend events run only once
      if (carousel || running) {
        events.emit('transitionEnd', info(event));

        if (!carousel && slideItemsOut.length > 0) {
          for (var i = 0; i < slideItemsOut.length; i++) {
            var item = slideItemsOut[i];
            // set item positions
            item.style.left = '';

            if (ANIMATIONDELAY && TRANSITIONDELAY) {
              item.style[ANIMATIONDELAY] = '';
              item.style[TRANSITIONDELAY] = '';
            }
            removeClass(item, animateOut);
            addClass(item, animateNormal);
          }
        }

        /* update slides, nav, controls after checking ...
         * => legacy browsers who don't support 'event'
         *    have to check event first, otherwise event.target will cause an error
         * => or 'gallery' mode:
         *   + event target is slide item
         * => or 'carousel' mode:
         *   + event target is container,
         *   + event.property is the same with transform attribute
         */
        if (!event ||
            !carousel && event.target.parentNode === container ||
            event.target === container && strTrans(event.propertyName) === strTrans(transformAttr)) {

          if (!updateIndexBeforeTransform) {
            var indexTem = index;
            updateIndex();
            if (index !== indexTem) {
              events.emit('indexChanged', info());

              doContainerTransformSilent();
            }
          }

          if (nested === 'inner') { events.emit('innerLoaded', info()); }
          running = false;
          indexCached = index;
        }
      }

    }

    // # ACTIONS
    function goTo (targetIndex, e) {
      if (freeze) { return; }

      // prev slideBy
      if (targetIndex === 'prev') {
        onControlsClick(e, -1);

      // next slideBy
      } else if (targetIndex === 'next') {
        onControlsClick(e, 1);

      // go to exact slide
      } else {
        if (running) {
          if (preventActionWhenRunning) { return; } else { onTransitionEnd(); }
        }

        var absIndex = getAbsIndex(),
            indexGap = 0;

        if (targetIndex === 'first') {
          indexGap = - absIndex;
        } else if (targetIndex === 'last') {
          indexGap = carousel ? slideCount - items - absIndex : slideCount - 1 - absIndex;
        } else {
          if (typeof targetIndex !== 'number') { targetIndex = parseInt(targetIndex); }

          if (!isNaN(targetIndex)) {
            // from directly called goTo function
            if (!e) { targetIndex = Math.max(0, Math.min(slideCount - 1, targetIndex)); }

            indexGap = targetIndex - absIndex;
          }
        }

        // gallery: make sure new page won't overlap with current page
        if (!carousel && indexGap && Math.abs(indexGap) < items) {
          var factor = indexGap > 0 ? 1 : -1;
          indexGap += (index + indexGap - slideCount) >= indexMin ? slideCount * factor : slideCount * 2 * factor * -1;
        }

        index += indexGap;

        // make sure index is in range
        if (carousel && loop) {
          if (index < indexMin) { index += slideCount; }
          if (index > indexMax) { index -= slideCount; }
        }

        // if index is changed, start rendering
        if (getAbsIndex(index) !== getAbsIndex(indexCached)) {
          render(e);
        }

      }
    }

    // on controls click
    function onControlsClick (e, dir) {
      if (running) {
        if (preventActionWhenRunning) { return; } else { onTransitionEnd(); }
      }
      var passEventObject;

      if (!dir) {
        e = getEvent(e);
        var target = getTarget(e);

        while (target !== controlsContainer && [prevButton, nextButton].indexOf(target) < 0) { target = target.parentNode; }

        var targetIn = [prevButton, nextButton].indexOf(target);
        if (targetIn >= 0) {
          passEventObject = true;
          dir = targetIn === 0 ? -1 : 1;
        }
      }

      if (rewind) {
        if (index === indexMin && dir === -1) {
          goTo('last', e);
          return;
        } else if (index === indexMax && dir === 1) {
          goTo('first', e);
          return;
        }
      }

      if (dir) {
        index += slideBy * dir;
        if (autoWidth) { index = Math.floor(index); }
        // pass e when click control buttons or keydown
        render((passEventObject || (e && e.type === 'keydown')) ? e : null);
      }
    }

    // on nav click
    function onNavClick (e) {
      if (running) {
        if (preventActionWhenRunning) { return; } else { onTransitionEnd(); }
      }

      e = getEvent(e);
      var target = getTarget(e), navIndex;

      // find the clicked nav item
      while (target !== navContainer && !hasAttr(target, 'data-nav')) { target = target.parentNode; }
      if (hasAttr(target, 'data-nav')) {
        var navIndex = navClicked = Number(getAttr(target, 'data-nav')),
            targetIndexBase = fixedWidth || autoWidth ? navIndex * slideCount / pages : navIndex * items,
            targetIndex = navAsThumbnails ? navIndex : Math.min(Math.ceil(targetIndexBase), slideCount - 1);
        goTo(targetIndex, e);

        if (navCurrentIndex === navIndex) {
          if (animating) { stopAutoplay(); }
          navClicked = -1; // reset navClicked
        }
      }
    }

    // autoplay functions
    function setAutoplayTimer () {
      autoplayTimer = setInterval(function () {
        onControlsClick(null, autoplayDirection);
      }, autoplayTimeout);

      animating = true;
    }

    function stopAutoplayTimer () {
      clearInterval(autoplayTimer);
      animating = false;
    }

    function updateAutoplayButton (action, txt) {
      setAttrs(autoplayButton, {'data-action': action});
      autoplayButton.innerHTML = autoplayHtmlStrings[0] + action + autoplayHtmlStrings[1] + txt;
    }

    function startAutoplay () {
      setAutoplayTimer();
      if (autoplayButton) { updateAutoplayButton('stop', autoplayText[1]); }
    }

    function stopAutoplay () {
      stopAutoplayTimer();
      if (autoplayButton) { updateAutoplayButton('start', autoplayText[0]); }
    }

    // programaitcally play/pause the slider
    function play () {
      if (autoplay && !animating) {
        startAutoplay();
        autoplayUserPaused = false;
      }
    }
    function pause () {
      if (animating) {
        stopAutoplay();
        autoplayUserPaused = true;
      }
    }

    function toggleAutoplay () {
      if (animating) {
        stopAutoplay();
        autoplayUserPaused = true;
      } else {
        startAutoplay();
        autoplayUserPaused = false;
      }
    }

    function onVisibilityChange () {
      if (doc.hidden) {
        if (animating) {
          stopAutoplayTimer();
          autoplayVisibilityPaused = true;
        }
      } else if (autoplayVisibilityPaused) {
        setAutoplayTimer();
        autoplayVisibilityPaused = false;
      }
    }

    function mouseoverPause () {
      if (animating) {
        stopAutoplayTimer();
        autoplayHoverPaused = true;
      }
    }

    function mouseoutRestart () {
      if (autoplayHoverPaused) {
        setAutoplayTimer();
        autoplayHoverPaused = false;
      }
    }

    // keydown events on document
    function onDocumentKeydown (e) {
      e = getEvent(e);
      var keyIndex = [KEYS.LEFT, KEYS.RIGHT].indexOf(e.keyCode);

      if (keyIndex >= 0) {
        onControlsClick(e, keyIndex === 0 ? -1 : 1);
      }
    }

    // on key control
    function onControlsKeydown (e) {
      e = getEvent(e);
      var keyIndex = [KEYS.LEFT, KEYS.RIGHT].indexOf(e.keyCode);

      if (keyIndex >= 0) {
        if (keyIndex === 0) {
          if (!prevButton.disabled) { onControlsClick(e, -1); }
        } else if (!nextButton.disabled) {
          onControlsClick(e, 1);
        }
      }
    }

    // set focus
    function setFocus (el) {
      el.focus();
    }

    // on key nav
    function onNavKeydown (e) {
      e = getEvent(e);
      var curElement = doc.activeElement;
      if (!hasAttr(curElement, 'data-nav')) { return; }

      // var code = e.keyCode,
      var keyIndex = [KEYS.LEFT, KEYS.RIGHT, KEYS.ENTER, KEYS.SPACE].indexOf(e.keyCode),
          navIndex = Number(getAttr(curElement, 'data-nav'));

      if (keyIndex >= 0) {
        if (keyIndex === 0) {
          if (navIndex > 0) { setFocus(navItems[navIndex - 1]); }
        } else if (keyIndex === 1) {
          if (navIndex < pages - 1) { setFocus(navItems[navIndex + 1]); }
        } else {
          navClicked = navIndex;
          goTo(navIndex, e);
        }
      }
    }

    function getEvent (e) {
      e = e || win.event;
      return isTouchEvent(e) ? e.changedTouches[0] : e;
    }
    function getTarget (e) {
      return e.target || win.event.srcElement;
    }

    function isTouchEvent (e) {
      return e.type.indexOf('touch') >= 0;
    }

    function preventDefaultBehavior (e) {
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
    }

    function getMoveDirectionExpected () {
      return getTouchDirection(toDegree(lastPosition.y - initPosition.y, lastPosition.x - initPosition.x), swipeAngle) === options.axis;
    }

    function onPanStart (e) {
      if (running) {
        if (preventActionWhenRunning) { return; } else { onTransitionEnd(); }
      }

      if (autoplay && animating) { stopAutoplayTimer(); }

      panStart = true;
      if (rafIndex) {
        caf(rafIndex);
        rafIndex = null;
      }

      var $ = getEvent(e);
      events.emit(isTouchEvent(e) ? 'touchStart' : 'dragStart', info(e));

      if (!isTouchEvent(e) && ['img', 'a'].indexOf(getLowerCaseNodeName(getTarget(e))) >= 0) {
        preventDefaultBehavior(e);
      }

      lastPosition.x = initPosition.x = $.clientX;
      lastPosition.y = initPosition.y = $.clientY;
      if (carousel) {
        translateInit = parseFloat(container.style[transformAttr].replace(transformPrefix, ''));
        resetDuration(container, '0s');
      }
    }

    function onPanMove (e) {
      if (panStart) {
        var $ = getEvent(e);
        lastPosition.x = $.clientX;
        lastPosition.y = $.clientY;

        if (carousel) {
          if (!rafIndex) { rafIndex = raf(function(){ panUpdate(e); }); }
        } else {
          if (moveDirectionExpected === '?') { moveDirectionExpected = getMoveDirectionExpected(); }
          if (moveDirectionExpected) { preventScroll = true; }
        }

        if ((typeof e.cancelable !== 'boolean' || e.cancelable) && preventScroll) {
          e.preventDefault();
        }
      }
    }

    function panUpdate (e) {
      if (!moveDirectionExpected) {
        panStart = false;
        return;
      }
      caf(rafIndex);
      if (panStart) { rafIndex = raf(function(){ panUpdate(e); }); }

      if (moveDirectionExpected === '?') { moveDirectionExpected = getMoveDirectionExpected(); }
      if (moveDirectionExpected) {
        if (!preventScroll && isTouchEvent(e)) { preventScroll = true; }

        try {
          if (e.type) { events.emit(isTouchEvent(e) ? 'touchMove' : 'dragMove', info(e)); }
        } catch(err) {}

        var x = translateInit,
            dist = getDist(lastPosition, initPosition);
        if (!horizontal || fixedWidth || autoWidth) {
          x += dist;
          x += 'px';
        } else {
          var percentageX = TRANSFORM ? dist * items * 100 / ((viewport + gutter) * slideCountNew): dist * 100 / (viewport + gutter);
          x += percentageX;
          x += '%';
        }

        container.style[transformAttr] = transformPrefix + x + transformPostfix;
      }
    }

    function onPanEnd (e) {
      if (panStart) {
        if (rafIndex) {
          caf(rafIndex);
          rafIndex = null;
        }
        if (carousel) { resetDuration(container, ''); }
        panStart = false;

        var $ = getEvent(e);
        lastPosition.x = $.clientX;
        lastPosition.y = $.clientY;
        var dist = getDist(lastPosition, initPosition);

        if (Math.abs(dist)) {
          // drag vs click
          if (!isTouchEvent(e)) {
            // prevent "click"
            var target = getTarget(e);
            addEvents(target, {'click': function preventClick (e) {
              preventDefaultBehavior(e);
              removeEvents(target, {'click': preventClick});
            }});
          }

          if (carousel) {
            rafIndex = raf(function() {
              if (horizontal && !autoWidth) {
                var indexMoved = - dist * items / (viewport + gutter);
                indexMoved = dist > 0 ? Math.floor(indexMoved) : Math.ceil(indexMoved);
                index += indexMoved;
              } else {
                var moved = - (translateInit + dist);
                if (moved <= 0) {
                  index = indexMin;
                } else if (moved >= slidePositions[slideCountNew - 1]) {
                  index = indexMax;
                } else {
                  var i = 0;
                  while (i < slideCountNew && moved >= slidePositions[i]) {
                    index = i;
                    if (moved > slidePositions[i] && dist < 0) { index += 1; }
                    i++;
                  }
                }
              }

              render(e, dist);
              events.emit(isTouchEvent(e) ? 'touchEnd' : 'dragEnd', info(e));
            });
          } else {
            if (moveDirectionExpected) {
              onControlsClick(e, dist > 0 ? -1 : 1);
            }
          }
        }
      }

      // reset
      if (options.preventScrollOnTouch === 'auto') { preventScroll = false; }
      if (swipeAngle) { moveDirectionExpected = '?'; }
      if (autoplay && !animating) { setAutoplayTimer(); }
    }

    // === RESIZE FUNCTIONS === //
    // (slidePositions, index, items) => vertical_conentWrapper.height
    function updateContentWrapperHeight () {
      var wp = middleWrapper ? middleWrapper : innerWrapper;
      wp.style.height = slidePositions[index + items] - slidePositions[index] + 'px';
    }

    function getPages () {
      var rough = fixedWidth ? (fixedWidth + gutter) * slideCount / viewport : slideCount / items;
      return Math.min(Math.ceil(rough), slideCount);
    }

    /*
     * 1. update visible nav items list
     * 2. add "hidden" attributes to previous visible nav items
     * 3. remove "hidden" attrubutes to new visible nav items
     */
    function updateNavVisibility () {
      if (!nav || navAsThumbnails) { return; }

      if (pages !== pagesCached) {
        var min = pagesCached,
            max = pages,
            fn = showElement;

        if (pagesCached > pages) {
          min = pages;
          max = pagesCached;
          fn = hideElement;
        }

        while (min < max) {
          fn(navItems[min]);
          min++;
        }

        // cache pages
        pagesCached = pages;
      }
    }

    function info (e) {
      return {
        container: container,
        slideItems: slideItems,
        navContainer: navContainer,
        navItems: navItems,
        controlsContainer: controlsContainer,
        hasControls: hasControls,
        prevButton: prevButton,
        nextButton: nextButton,
        items: items,
        slideBy: slideBy,
        cloneCount: cloneCount,
        slideCount: slideCount,
        slideCountNew: slideCountNew,
        index: index,
        indexCached: indexCached,
        displayIndex: getCurrentSlide(),
        navCurrentIndex: navCurrentIndex,
        navCurrentIndexCached: navCurrentIndexCached,
        pages: pages,
        pagesCached: pagesCached,
        sheet: sheet,
        isOn: isOn,
        event: e || {},
      };
    }

    return {
      version: '2.9.3',
      getInfo: info,
      events: events,
      goTo: goTo,
      play: play,
      pause: pause,
      isOn: isOn,
      updateSliderHeight: updateInnerWrapperHeight,
      refresh: initSliderTransform,
      destroy: destroy,
      rebuild: function() {
        return tns(extend(options, optionsElements));
      }
    };
  };

  function catalogueGalleryHTML(catalogImages) {
    if (catalogImages.length === 0) {
      console.log('no images');
      return '';
    }

    var images = '';
    catalogImages.forEach(function (image) {
      images += "<div class=\"tns-slide\"><figure>".concat(image, "</figure></div>");
    });
    var html = catalogImages ? "\n\t\t<div class=\"catalogue__gallery-container\">\n\t\t\t<button class=\"previous-slide\"><</button>\n\t\t\t<button class=\"next-slide\">></button>\n\t\t\t<div class=\"catalogue__gallery\">\n\t\t\t\t".concat(images, "\n\t\t\t</div>\n\t\t</div>\n\t\t") : '';
    return html;
  }

  function setCatalogueGallery(selector) {
    var container = document.querySelector(selector);
    if (container === null) return;
    var prevButton = document.querySelector('.previous-slide');
    var nextButton = document.querySelector('.next-slide');
    tns({
      container: container,
      items: 2,
      slideBy: 1,
      mouseDrag: false,
      swipeAngle: false,
      speed: 500,
      autoplay: false,
      arrowKeys: true,
      rewind: true,
      fixedWidth: 280,
      prevButton: prevButton,
      nextButton: nextButton,
      nav: false,
      touch: false,
      responsive: {
        480: {
          fixedWidth: 350
        },
        640: {
          fixedWidth: 500
        },
        768: {
          center: true
        },
        1024: {
          fixedWidth: 450,
          center: false
        },
        1280: {
          fixedWidth: 500
        }
      }
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
   * @param type
   * @return {string} Returns HTML string containing Award edition info.
   */

  function showAwardInfo(triggers, target, ajaxUrl, lang, options, callback, type) {
    if (type === 'award') {
      // Add event listeners to prize images on first load
      window.addEventListener('load', function () {
        var edition = document.querySelector('.artwork-gallery').dataset.edition;
        asyncFetch("".concat(ajaxUrl, "/").concat(edition), options).then(function (jsonResponse) {
          var award = jsonResponse.award;
          awardGalleryImage(award);
        });
      });
    } else if (type === 'catalogues') {
      setCatalogueGallery('.catalogue__gallery');
    } // Add event listeners to edition buttons and handle gallery toggling on and off


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
      html += "\n\t\t<li id=\"award-se-".concat(edition.bp_award_se_year, "\" class=\"award-se__edition\">\n\t\t\t<div class=\"edition__year\">\n\t\t\t\t<p>").concat(edition.bp_award_se_year, "</p>\n\t\t\t</div>\n\t\t\t<div class=\"edition__winners\">").concat(edition.bp_award_se_winners, "</div>\n\t\t</li>\n\t\t");
    });
    return html;
  }

  /**
   * @param {Object} payload A JSON object
   * @param {HTMLElement} target
   * @param {string} lang Current language
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
    target.insertAdjacentElement('afterbegin', returnButton);
    setCatalogueGallery('.catalogue__gallery');
  }

  function catalogueHTML(payload) {
    var html = payload && "<article id=\"post-".concat(payload.id, "\">\n\t\t\t<div class=\"entry-content catalogue\">\n\t\t\t\t<h1 class=\"catalogue__title\">\n\t\t\t\t\t<p>").concat(payload.lang === 'es' ? 'Catálogo' : 'Catalogue', "</p>\n\t\t\t\t\t<p>").concat(payload.catalogueEdition, "</p>\n\t\t\t\t</h1>\n\t\t\t\t").concat(payload.catalogueCover ? "<figure class=\"catalogue__cover\">".concat(payload.catalogueCover, "</figure>") : "", "\n\t\t\t\t<div class=\"catalogue__link\">\n\t\t\t\t\t<a href=\"").concat(payload.catalogueUrl, "\">\n\t\t\t\t\t\t").concat(payload.lang === 'es' ? 'Descargar PDF' : 'Download PDF', "\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t\t").concat(catalogueGalleryHTML(payload.catalogueGallery), "\n\t\t\t</div>\n\t\t</article>");
    return html;
  }

  var _awardPayload = awardPayload,
      nonce = _awardPayload.nonce,
      awardUrl = _awardPayload.awardUrl,
      type = _awardPayload.type,
      lang = _awardPayload.lang; // eslint-disable-line no-undef

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
  editionContainer.insertAdjacentElement('afterbegin', returnButton);

  if (type === 'award') {
    // Where gallery images will be displayed
    var awardGallery = document.querySelector('.artwork-gallery');
    var handleScroll = new HandleScroll();
    awardGallery.querySelector('.artwork-gallery__close button').addEventListener('click', function () {
      awardGallery.classList.toggle('hidden');
      document.body.classList.toggle('no-scroll');
      handleScroll.disable();
    });
    showAwardInfo(buttons, editionContainer, awardUrl, lang, asyncFetchOptions(nonce, 'get'), awardEditionHTML, type);
  } else if (type === 'catalogues') {
    showAwardInfo(buttons, editionContainer, awardUrl, lang, asyncFetchOptions(nonce, 'get'), catalogueEditionHTML, type);
  }

}());

//# sourceMappingURL=award.js.map
