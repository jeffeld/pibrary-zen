
var pagesBase = {

  getElementByModel: function (v) {
    var e = element(by.model(v));
    expect(e !== null).toBeTruthy();
    return e;
  },

  getElementById: function (v) {
    var e = element(by.id(v));
    expect(e !== null).toBeTruthy();
    return e;
  },

  getElementByCSS: function (v) {
    var e = element(by.css(v));
    expect(e !== null).toBeTruthy();
    return e;
  },

  getElementByButtonText: function (v) {
    var e = element(by.buttonText(v));
    expect(e !== null).toBeTruthy();
    return e;
  },

  getSelectElementOption: function (v) {
    var e = element(by.cssContainingText('option', v));
    expect(e !== null).toBeTruthy();
    return e;
  },

  hasClass: function (e, c) {
    return e.getAttribute('class').then(function (classes) {
      console.log (classes.split(' '));
      return classes.split(' ').indexOf(c) !== -1;
    });
  }



};

module.exports = pagesBase;


