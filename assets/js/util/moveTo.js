/**
 * TEMPORARY FIX
 * Must delete this file and import moveTo from node_modules when package is updated
 */

/*!
 * MoveTo - A lightweight scroll animation javascript library without any dependency.
 * Version 1.8.3 (21-07-2019 00:32)
 * Licensed under MIT
 * Copyright 2019 Hasan Aydoğdu <hsnaydd@gmail.com>
 */
'use strict';

const MoveTo = (function () {
	/**
	 * Defaults
	 *
	 * @type {Object}
	 */
	const defaults = {
		tolerance: 0,
		duration: 800,
		easing: 'easeOutQuart',
		container: window,
		callback: function callback() {},
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
		const obj3 = {};
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
		const options =
			arguments.length > 0 && arguments[0] !== undefined
				? arguments[0]
				: {};
		const easeFunctions =
			arguments.length > 1 && arguments[1] !== undefined
				? arguments[1]
				: {};
		this.options = mergeObject(defaults, options);
		this.easeFunctions = mergeObject(
			{
				easeOutQuart,
			},
			easeFunctions
		);
	}
	/**
	 * Register a dom element as trigger
	 *
	 * @param  {HTMLElement} dom Dom trigger element
	 * @param  {Function} callback Callback function
	 * @return {Function | void} unregister function
	 */

	MoveTo.prototype.registerTrigger = function (dom, callback) {
		const _this = this;

		if (!dom) {
			return;
		}

		const href =
			dom.getAttribute('href') || dom.getAttribute('data-target'); // The element to be scrolled

		const target =
			href && href !== '#'
				? document.getElementById(href.substring(1))
				: document.body;
		const options = mergeObject(
			this.options,
			_getOptionsFromTriggerDom(dom, this.options)
		);

		if (typeof callback === 'function') {
			options.callback = callback;
		}

		const listener = function listener(e) {
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
		const _this2 = this;

		let options =
			arguments.length > 1 && arguments[1] !== undefined
				? arguments[1]
				: {};

		if (target !== 0 && !target) {
			return;
		}

		options = mergeObject(this.options, options);
		const containerDistance =
			options.container === window
				? target.getBoundingClientRect().top
				: target.getBoundingClientRect().top -
				  options.container.getBoundingClientRect().top;
		let distance = typeof target === 'number' ? target : containerDistance;
		const from = countScrollTop(options.container);
		let startTime = null;
		let lastYOffset;
		distance -= options.tolerance; // rAF loop

		const loop = function loop(currentTime) {
			const currentYOffset = countScrollTop(_this2.options.container);

			if (!startTime) {
				// To starts time from 1, we subtracted 1 from current time
				// If time starts from 1 The first loop will not do anything,
				// because easing value will be zero
				startTime = currentTime - 1;
			}

			const timeElapsed = currentTime - startTime;

			if (lastYOffset) {
				if (
					(distance > 0 && lastYOffset > currentYOffset) ||
					(distance < 0 && lastYOffset < currentYOffset)
				) {
					return options.callback(target);
				}
			}

			lastYOffset = currentYOffset;

			const val = _this2.easeFunctions[options.easing](
				timeElapsed,
				from,
				distance,
				options.duration
			);

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
		const domOptions = {};
		Object.keys(options).forEach(function (key) {
			const value = dom.getAttribute('data-mt-'.concat(kebabCase(key)));

			if (value) {
				domOptions[key] = isNaN(value) ? value : parseInt(value, 10);
			}
		});
		return domOptions;
	}

	return MoveTo;
})();

// if (typeof module !== 'undefined') {
//   module.exports = MoveTo;
// } else {
//   window.MoveTo = MoveTo;
// }

export default MoveTo;
