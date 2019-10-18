const {describe, it, beforeEach, before, after, afterEach} = require('mocha')
var assert = require('assert').strict;
const {createDefaultSession} = require('../renderer/NdlrSessionMaker')
const {validateSession, contains, isBetween,} = require('../renderer/NdlrSessionValidator')


describe('contains(val, set)', function() {
  it('should return true when passed (60, [20,40,60])', function() {
    assert(contains(60, [20,40,60]))
  })

  it('should return true when passed (-1, [-1,0,1])', function() {
    assert(contains(60, [20,40,60]))
  })

  it('should return true when passed (4, [1,2,3,4,5,6,7])', function() {
    assert(contains(60, [20,40,60]))
  })

  it('should throw an error when passed (15, [20,40,60])', function() {
    assert.throws( function() {
      contains(15, [20,40,60])
    })
  })
})

describe('between(vals, range)', function() {
  it('should return true when passed ([0], [0, 128])', function (){
    assert(isBetween([0], [0, 128]))
  })

  it('should return true when passed ([128], [0, 128])', function (){
    assert(isBetween([128], [0, 128]))
  })

  it('should return true when passed ([50], [0, 128])', function (){
    assert(isBetween([50], [0, 128]))
  })

  it('should throw an error when passed ([50, 200], [0, 128])', function (){
    assert.throws( function() {
      isBetween([200, 200], [0, 128])
    })
  })
})

describe('validateSession(session)', function() {

  let validTests = [
    { session: createDefaultSession(), message: 'should return true when passed a default session'},

  ]
  let invalidTests = [
    { session: createDefaultSession(), message: 'should throw an error when a session is missing a pattern'},
    { session: createDefaultSession(), message: 'should throw an error when the session is missing a pattern element'},
    { session: createDefaultSession(), message: 'should throw an error when a pattern element is negative'},
    { session: createDefaultSession(), message: 'should throw an error when a pattern element is not a number'},
  ]

  validTests.forEach(function(test) {
    it(test.message, function() {
      assert(validateSession(test.session))
    })
  })

  invalidTests.forEach(function(test) {
    it(test.message, function() {
      assert.throws(function() {validateSession(test.session)}, )
    })
  })
})



