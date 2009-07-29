// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

/**
  @class
  
  An error, used to represent an error state.
  
  Many API's within SproutCore will return an instance of this object whenever
  they have an error occur.  An error includes an error code, description,
  and optional human readable label that indicates the item that failed. 
  
  Depending on the error, other properties may also be added to the object
  to help you recover from the failure.
  
  You can pass error objects to various UI elements to display the error in
  the interface. You can easily determine if the value returned by some API is 
  an error or not using the helper SC.ok(value).
  
  h2. Faking Error Objects
  
  You can actually make any object you want to be treated like an Error object
  by simply implementing two properties: isError and errorValue.  If you 
  set isError to YES, then calling SC.ok(obj) on your object will return NO.
  If isError is YES, then SC.val(obj) will return your errorValue property 
  instead of the receiver.
  
  @extends SC.Object
  @since SproutCore 1.0
*/
SC.Error = SC.Object.extend(
/** @scope SC.Error.prototype */ {
  
  /**
    error code.  Used to designate the error type.
  */
  code: -1,
  
  /**
    Human readable description of the error.  This can also be a non-localized
    key.
  */
  message: '',
  
  /**
    The value the error represents.  This is used when wrapping a value inside
    of an error to represent the validation failure.
  */
  errorValue: null,
  
  /**
    Human readable name of the item with the error.
  */
  label: null,
  
  toString: function() {
    return "SC.Error:%@:%@ (%@)".fmt(SC.guidFor(this), this.get('message'), this.get('code'));
  },
  
  /**
    Walk like a duck.
  */
  isError: YES
}) ;

Error.prototype.isError = YES ; // also walk like a duck

/**
  Creates a new SC.Error instance with the passed description, label, and
  code.  All parameters are optional.
  
  @param description {String} human readable description of the error
  @param label {String} human readable name of the item with the error
  @param code {Number} an error code to use for testing.
  @returns {SC.Error} new error instance.
*/
SC.Error.desc = function(description, label, value, code) {
  var opts = { message: description } ;
  if (label !== undefined) opts.label = label ;
  if (code !== undefined) opts.code = code ;
  if (value !== undefined) opts.errorValue = value ;
  return this.create(opts) ;
} ;

/**
  Shorthand form of the SC.Error.desc method.

  @param description {String} human readable description of the error
  @param label {String} human readable name of the item with the error
  @param code {Number} an error code to use for testing.
  @returns {SC.Error} new error instance.
*/
SC.$error = function(description, label, value, c) { 
  return SC.Error.desc(description,label, value, c); 
} ;

/**
  Returns YES if the passed value is an error object or false.
*/
SC.ok = SC.$ok = function(ret) {
  return (ret !== false) && !(ret && ret.isError);
};

/**
  Returns the value of an object.  If the passed object is an error, returns
  the value associated with the error; otherwise returns the receiver itself.
  
  @param {Object} obj the object
  @returns {Object} value 
*/
SC.val = SC.$val = function(obj) {
  if (obj && obj.isError) {
    return obj.get ? obj.get('errorValue') : null ; // Error has no value
  } else return obj ;
};

// STANDARD ERROR OBJECTS

/**
  Standard error code for errors that do not support multiple values.
*/
SC.Error.HAS_MULTIPLE_VALUES = -100 ;