// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

sc_require('models/record');
sc_require('models/record_attribute');

/** @class
  
  SingleAttribute is a subclass of RecordAttribute and handles to-one
  relationships.

  There are many ways you can configure a SingleAttribute:
  
  {{{
    group: SC.Record.toOne('MyApp.Group', { 
      inverse: 'contacts', // set the key used to represent the inverse 
      isMaster: YES|NO, // indicate whether changing this should dirty
      transform: function(), // transforms value <=> storeKey,
      isEditable: YES|NO, make editable or not
    });
  }}}
  
  @extends SC.RecordAttribute
  @since SproutCore 1.0
*/
SC.SingleAttribute = SC.RecordAttribute.extend(
  /** @scope SC.SingleAttribute.prototype */ {

  /**
    Specifies the property on the member record that represents the inverse
    of the current relationship.  If set, then modifying this relationship
    will also alter the opposite side of the relationship.
  */
  inverse: null,
  
  /**
    If set, determines that when an inverse relationship changes whether this
    record should become dirty also or not.
  */
  isMaster: YES,
  
  
  /**
    @private - implements support for handling inverse relationships.
  */
  // call: function(record, key, newRec) {
  //     var isWrite = (newRec === undefined),
  //         inverseKey, isMaster, oldRec, attr, ret;
  // 
  //     // can only take other records
  //     if (!SC.instanceOf(newRec, SC.Record)) {
  //       throw "%@ is not an instance of SC.Record".fmt(newRec);
  //     }
  // 
  //     // if we have an inverse relationship, save info for updates
  //     if (isWrite && (inverseKey = this.get('inverse'))) {
  //       oldRec = this._scsa_call(record, key); // read old value
  //     }
  //     
  //     ret = sc_super(); // do normal read/write
  // 
  //     // ok, now if we have an inverse relationship, get the inverse 
  //     // relationship and notify it of what is happening.  This will allow it
  //     // to update itself as needed.  The callbacks implemented here are 
  //     // supported by both SingleAttribute and ManyAttribute.
  //     //
  //     if (isWrite && inverseKey && (oldRec !== newRec)) {
  // 
  //       if (oldRec && (attr = oldRec[inverseKey])) {
  //         attr.inverseDidRemoveRecord(oldRec, inverseKey, record, key);
  //       }
  //       
  //       if (newRec && (attr = newRec[inverseKey])) {
  //         attr.inverseDidAddRecord(newRec, inverseKey, record, key);
  //       }
  //     }
  //     
  //     return ret ;
  //   },
  
  /** @private - save original call() impl */
  _scsa_call: SC.RecordAttribute.prototype.call,
  
  /**
    Called by an inverse relationship whenever the receiver is no longer part
    of the relationship.  If this matches the inverse setting of the attribute
    then it will update itself accordingly.
  */
  inverseDidRemoveRecord: function(record, key, inverseRecord, inverseKey) {
    
    var myInverseKey  = this.get('inverse'),
        curRec   = this._scsa_call(record, key),
        isMaster = this.get('isMaster'), attr;

    // ok, you removed me, I'll remove you...  if isMaster, notify change.
    record.writeAttribute(key, null, !isMaster);

    // if we have another value, notify them as well...
    if ((curRec !== inverseRecord) || (inverseKey !== myInverseKey)) {
      if (curRec && (attr = curRec[myInverseKey])) {
        attr.inverseDidRemoveRecord(curRec, myInverseKey, record, key);
      }
    }
  },
  
  /**
    Called by an inverse relationship whenever the receiver is added to the 
    inverse relationship.  This will set the value of this inverse record to 
    the new record.
  */
  inverseDidAddRecord: function(record, key, inverseRecord, inverseKey) {
    
    var myInverseKey  = this.get('inverse'),
        curRec   = this._scsa_call(record, key),
        isMaster = this.get('isMaster'), 
        attr, nvalue; 

    // ok, replace myself with the new value...
    nvalue = this.fromType(record, key, inverseRecord); // convert to attr.
    record.writeAttribute(key, null, !isMaster);

    // if we have another value, notify them as well...
    if ((curRec !== inverseRecord) || (inverseKey !== myInverseKey)) {
      if (curRec && (attr = curRec[myInverseKey])) {
        attr.inverseDidRemoveRecord(curRec, myInverseKey, record, key);
      }
    }
  }

});