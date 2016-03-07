/**
 * Created by 15050971 on 2016/3/4.
 */

var assert = require('assert');
describe('Array',function(){
    describe('#indexOf()',function(){
        it('should return -1 when the value is not present',()=>{
           assert.equal(-1,[1,2,3].indexOf(5));
           assert.equal(-1,[1,2,3].indexOf(0));
        });
    });
});


var should = require('should');
describe('Should test',function(){
    it('number',function(){
        (123).should.be.a.Number;
    });
    it('object property',()=>{
        var obj = {name:'minghe',email:'xxx@139.com'};
        obj.should.have.property('name','minghe');
        obj.should.have.property('email');
    });
});

