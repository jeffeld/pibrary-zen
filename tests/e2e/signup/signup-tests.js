var
  firstName = element(by.model('FirstName')),
  lastName = element(by.model('LastName')),

  mobile1 = element(by.model('Mobile1')),
  mobile2 = element(by.model('Mobile2')),

  email1 = element(by.model('Email1')),
  email2 = element(by.model('Email2')),

  password1 = element(by.id('hpassword1')),
  password2 = element(by.id('hpassword2')),

  agreeRespect = element(by.model('AgreeRespect')),
  agreePhoto = element(by.model('AgreePhoto')),
  agreeTnC = element(by.model('AgreeTnC')),

  registerNow = element(by.buttonText('Register now')),

  signup = element(by.id('signup')),
  success = element(by.id('success')),
  errorEmail = element(by.id('error-email')),

  successContinue = element(by.id('success-continue')),
  errorEmailContinue = element(by.id('error-email-continue'))
;

expect(firstName !== null);
expect(lastName !== null);
expect(mobile1 !== null);
expect(mobile2 !== null);
expect(email1 !== null);
expect(email2 !== null);
expect(password1 !== null);
expect(password2 !== null);
expect(registerNow !== null);
expect(agreeRespect !== null);
expect(agreePhoto !== null);
expect(agreeTnC !== null);

describe('Sign Up page', function() {


  var fillOut = function () {

    browser.get('/signup');
    expect(browser.getTitle()).toEqual('Sign Up');

    firstName.sendKeys('Harry');
    expect (registerNow.isEnabled()).toBeFalsy();
    lastName.sendKeys('Sullivan');
    expect (registerNow.isEnabled()).toBeFalsy();

    mobile1.sendKeys('0871234567');
    expect (registerNow.isEnabled()).toBeFalsy();
    mobile2.sendKeys('0871234567');
    expect (registerNow.isEnabled()).toBeFalsy();

    email1.sendKeys('harry@sullivan.com');
    expect (registerNow.isEnabled()).toBeFalsy();
    email2.sendKeys('harry@sullivan.com');
    expect (registerNow.isEnabled()).toBeFalsy();

    password1.sendKeys('HarrySullivan1*');
    expect (registerNow.isEnabled()).toBeFalsy();
    password2.sendKeys('HarrySullivan1*');
    expect (registerNow.isEnabled()).toBeFalsy();

    element(by.cssContainingText('option', 'a student')).click();
    expect (registerNow.isEnabled()).toBeFalsy();

    agreeRespect.click();
    expect (registerNow.isEnabled()).toBeFalsy();
    agreePhoto.click();
    expect (registerNow.isEnabled()).toBeFalsy();
    agreeTnC.click();

    expect (registerNow.isEnabled()).toBeTruthy();

  };

  it('should sign up a user', function() {

    fillOut();
    registerNow.click();
    expect (success.isDisplayed()).toBeTruthy();
    successContinue.click();
    expect(browser.getTitle()).toEqual('Library Home');

  });

  it('should detect a duplicate email address', function () {

    fillOut();
    registerNow.click();
    expect (errorEmail.isDisplayed()).toBeTruthy();

    errorEmailContinue.click();
    expect (signup.isDisplayed()).toBeTruthy();

    email1.getText().then (function (v) {
      expect(v.length).toBe(0)
    });

    email2.getText().then (function (v) {
      expect(v.length).toBe(0)
    });


  });







});
