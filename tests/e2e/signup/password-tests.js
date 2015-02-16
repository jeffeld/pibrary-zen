var
  page = require ('../common/signup'),

  _ = require('../../../app/bower_components/underscore'),

  specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+'],
  nonSpecialChars = [':', ';', '.', '-'],
  upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowerChars = 'abcdefghijklmnopqrstuvwxyz',
  digits = '0123456789',
  accentedUpperCase = 'ÁÉÍÓÚ',
  accentedLowerCase = 'áéíóú',

  passwordMinLength = 8,
  passwordMaxLength = 20,

  testChars = function (chars, ele) {
    var n = -1;
    for (n = 0; n < chars.length; n++) {
      expect(ele.isDisplayed()).toBeFalsy();
      page.hiddenPassword1().sendKeys (chars[n]);
      expect(ele.isDisplayed()).toBeTruthy();
      page.hiddenPassword1().clear();
    }
  },

  testNonRecognisedChars = function (chars, ele) {
    var n = -1;
    for (n = 0; n < chars.length; n++) {
      expect(ele.isDisplayed()).toBeFalsy();
      page.hiddenPassword1().sendKeys (chars[n]);
      expect(ele.isDisplayed()).toBeFalsy();
      page.hiddenPassword1().clear();
    }
  }
;


describe('Test password validation', function() {

  page.load();

  it('should recognise uppercase characters', function() {
    page.hiddenPassword1().clear();
    testChars (upperChars, page.has1uc());
  });

  it('should recognise lowercase characters', function() {
    page.hiddenPassword1().clear();
    testChars (lowerChars, page.has1lc());
  });

  it('should recognise digits', function() {
    page.hiddenPassword1().clear();
    testChars (digits, page.has1n());
  });

  it('should recognise special characters', function() {
    page.hiddenPassword1().clear();
    testChars (specialChars, page.has1s());
  });

  it('should not recognise upper case accented characters', function() {
    page.hiddenPassword1().clear();
    testNonRecognisedChars(accentedUpperCase, page.has1uc());
  });

  it('should not recognise lower case accented characters', function() {
    page.hiddenPassword1().clear();
    testNonRecognisedChars(accentedLowerCase, page.has1uc());
  });


  it('should not recognise special characters', function () {
    page.hiddenPassword1().clear();
    testNonRecognisedChars(nonSpecialChars, page.has1s());
  });

  it('check lengths', function() {
    var n = -1;

    // Check that the length ok indicator is not displayed...
    page.hiddenPassword1().clear();
    for (n = 1; n < passwordMinLength; n++) {
      page.hiddenPassword1().sendKeys('A');
      expect(page.lenok().isDisplayed()).toBeFalsy();
    }

    // ...until we get to the minimum length. Then...
    page.hiddenPassword1().sendKeys('A');
    expect(page.lenok().isDisplayed()).toBeTruthy();

    // ...check the indicator is displayed until we get to the maximum length...
    for (n = passwordMinLength + 1; n <= passwordMaxLength; n++) {
      page.hiddenPassword1().sendKeys('A');
      expect(page.lenok().isDisplayed()).toBeTruthy();
    }

    // We don't check the indicator disappears over the max length,
    // as the password field does not allow typing in more than the
    // max length.

  });

});
