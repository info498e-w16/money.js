/*!
 * money.js / fx() v0.2
 * Copyright 2014 Open Exchange Rates
 *
 * JavaScript library for realtime currency conversion and exchange rate calculation.
 *
 * Freely distributable under the MIT license.
 * Portions of money.js are inspired by or borrowed from underscore.js
 *
 * This code has been modified slightly for the assignment at hand.
 * 
 * YOUR TASK: add comments to this code!
 *  - you'll need to practice reading the language to understand it
 *  - make sure to describe the parameters and return values of each method!
 */
(function(root, undefined) { //creates an anonymous function to "contain" the code. Passed a reference to the "root" scope (e.g., a global object we might want to use). Root will be `window` in browser or `global` on the server:

  //is fx an object or a function (OR BOTH?!)
	var fx = function(obj) {
		return new fxWrapper(obj);
	};


	fx.version = '0.2';


  /* Setup */

	var fxSetup = root.fxSetup || {
		rates : {},
		base : ""
	};


	fx.rates = fxSetup.rates;

	fx.baseRate = fxSetup.baseRate;

	fx.settings = {
		from : fxSetup.from || fx.baseRate,
		to : fxSetup.to || fx.baseRate
	};


	/* --- Conversion --- */

	var convert = fx.convert = function(val, opts) {
		if (typeof val === 'object' && val.length) {
			for (var i = 0; i< val.length; i++ ) {
				val[i] = convert(val[i], opts);
			}
			return val;
		}

		opts = opts || {};

		if( !opts.from ) opts.from = fx.settings.from;
		if( !opts.to ) opts.to = fx.settings.to;

		return val * getRate( opts.to, opts.from );
	};


	var getRate = function(to, from) {
		var rates = fx.rates;

		rates[fx.baseRate] = 1;

		if ( !rates[to] || !rates[from] ) throw "fx error";

		if ( from === fx.baseRate ) {
			return rates[to];
		}

		if ( to === fx.baseRate ) {
			return 1 / rates[from];
		}

		return rates[to] * (1 / rates[from]);
	};



  /** The below code is already commented; but you might read through it to make sure you follow what is going on! **/

	/* --- OOP wrapper and chaining --- */

	// If fx(val) is called as a function, it returns a wrapped object that can be used OO-style
	var fxWrapper = function(val) {
		// Experimental: parse strings to pull out currency code and value:
		if ( typeof	val === "string" ) {
			this._v = parseFloat(val.replace(/[^0-9-.]/g, ""));
			this._fx = val.replace(/([^A-Za-z])/g, "");
		} else {
			this._v = val;
		}
	};

	// Expose `wrapper.prototype` as `fx.prototype`
	var fxProto = fx.prototype = fxWrapper.prototype;

	// fx(val).convert(opts) does the same thing as fx.convert(val, opts)
	fxProto.convert = function() {
		var args = Array.prototype.slice.call(arguments);
		args.unshift(this._v);
		return convert.apply(fx, args);
	};

	// fx(val).from(currency) returns a wrapped `fx` where the value has been converted from
	// `currency` to the `fx.baseRate` currency. Should be followed by `.to(otherCurrency)`
	fxProto.from = function(currency) {
		var wrapped = fx(convert(this._v, {from: currency, to: fx.baseRate}));
		wrapped._fx = fx.base;
		return wrapped;
	};

	// fx(val).to(currency) returns the value, converted from `fx.base` to `currency`
	fxProto.to = function(currency) {
		return convert(this._v, {from: this._fx ? this._fx : fx.settings.from, to: currency});
	};


	/* --- Module Definition --- */

	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = fx;
		}
		exports.fx = fx;

}(this));
