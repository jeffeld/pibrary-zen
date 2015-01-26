var

  password1 = element(by.id('hpassword1')),
  password2 = element(by.id('hpassword2')),

  has1uc = element(by.id('has1uc')),
  has1lc = element(by.id('has1lc')),
  has1n = element(by.id('has1n')),
  has1s = element(by.id('has1s')),
  lenok = element(by.id('lenok')),

  specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+'],

  nonSpecialChars = [],

  upperChars = 'A', //BCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowerChars = 'a', //bcdefghijklmnopqrstuvwxyz',
  digits = '0', //123456789',

  passwordMinLength = 8,
  passwordMaxLength = 20,

  testChars = function (chars, ele) {
    var n = -1;
    for (n = 0; n < chars.length; n++) {
      expect(ele.isDisplayed()).toBeFalsy();
      password1.sendKeys (chars[n]);
      expect(ele.isDisplayed()).toBeTruthy();
      password1.clear();
    }
  }
;


describe('Sign Up page password tests', function() {

  browser.get('/signup');

  it('check each character class is recognised', function() {

    expect(password1 !== null);
    expect(password2 !== null);

    testChars (upperChars, has1uc);
    testChars (lowerChars, has1lc);
    testChars (digits, has1n);
    testChars (specialChars, has1s);


  });

  it('check lengths', function() {
    var n = -1;

    // Check that the length ok indicator is not displayed...
    password1.clear();
    for (n = 1; n < passwordMinLength; n++) {
      password1.sendKeys('A');
      expect(lenok.isDisplayed()).toBeFalsy();
    }

    // ...until we get to the minimum length. Then...
    password1.sendKeys('A');
    expect(lenok.isDisplayed()).toBeTruthy();

    // ...check the indicator is displayed until we get to the maximum length...
    for (n = passwordMinLength + 1; n <= passwordMaxLength; n++) {
      password1.sendKeys('A');
      expect(lenok.isDisplayed()).toBeTruthy();
    }

    // We don't check the indicator disappears over the max length,
    // as the password field does not allow typing in more than the
    // max length.

  });

});
