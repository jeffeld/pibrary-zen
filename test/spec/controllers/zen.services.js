'use strict';

describe('Zen Services: ISBN Codes', function () {

    beforeEach(module('UserApp'));

    var Codes;

    beforeEach(inject(function (_Codes_) {
        Codes = _Codes_;
    }));

    it('should validate ISBN-13 9780000000000', function () {
        expect(Codes.isISBN('9870000000000')).toEqual(true);
    });

    it('should validate ISBN-13 978-000-00000-00', function () {
        expect(Codes.isISBN('978-000-00000-00')).toEqual(true);
    });

    it('should validate ISBN-13 978 000 00000 00', function () {
        expect(Codes.isISBN('978 000 00000 00')).toEqual(true);
    });

    it('should validate ISBN-10 0123456789', function () {
        expect(Codes.isISBN('0123456789')).toEqual(true);
    });

    it('should validate ISBN-10 012345678X', function () {
        expect(Codes.isISBN('012345678X')).toEqual(true);
    });

    it('should fail to validate ISBN-10 012345678Z', function () {
        expect(Codes.isISBN('012345678Z')).toEqual(false);
    });

    it('should fail to validate 1', function () {
        expect(Codes.isISBN('1')).toEqual(false);
    });

    it('should fail to validate ABCDEF', function () {
        expect(Codes.isISBN('ABCDEF')).toEqual(false);
    });

    it('should fail to validate 97800ABC00000', function () {
        expect(Codes.isISBN('9870000000000')).toEqual(true);
    });

});

describe('Zen Services: Member Codes', function () {

    beforeEach(module('UserApp'));

    var Codes;

    beforeEach(inject(function (_Codes_) {
        Codes = _Codes_;
    }));

    it('should validate 123456789', function() {
        expect(Codes.isMembershipCode('123456789')).toEqual(true);
    });

    it('should fail to validate ABCDEFGH', function() {
        expect(Codes.isMembershipCode('ABCDEFGH')).toEqual(false);
    });

});

describe('Zen Services: Stock Codes', function () {

    beforeEach(module('UserApp'));

    var Codes;

    beforeEach(inject(function (_Codes_) {
        Codes = _Codes_;
    }));

    it('should validate STOCKCODE', function() {
        expect(Codes.isStockCode('STOCKCODE')).toEqual(true);
    });

    it('should fail 12345678', function() {
        expect(Codes.isStockCode('12345678')).toEqual(false);
    });

});