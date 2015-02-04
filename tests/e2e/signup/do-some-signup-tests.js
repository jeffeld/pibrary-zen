
var

  _ = require('../../../app/bower_components/underscore'),

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
  errorEmailContinue = element(by.id('error-email-continue')),

  signups = [
    {
      firstName : 'Harry',
      lastName : 'Sullivan',
      mobile: '0871234567',
      email: 'harry@unit.com',
      password: 'HarrySullivan1#',
      role: 'a student'
    },
    {
      firstName : 'Sarah-Jame',
      lastName : 'Smith',
      mobile: '0871234567',
      email: 'sarahjane@unit.com',
      password: 'sarahJane1#',
      role: 'staff'
    },
    {
      firstName : 'Jo',
      lastName : 'Grant',
      mobile: '0871234567',
      email: 'jo@unit.com',
      password: 'JoGrant1#',
      role: 'a parent'
    }
  ]


;

//expect(firstName !== null);
//expect(lastName !== null);
//expect(mobile1 !== null);
//expect(mobile2 !== null);
//expect(email1 !== null);
//expect(email2 !== null);
//expect(password1 !== null);
//expect(password2 !== null);
//expect(registerNow !== null);
//expect(agreeRespect !== null);
//expect(agreePhoto !== null);
//expect(agreeTnC !== null);

ddescribe('Multiple sign ups', function() {


  var fillOut = function (o) {

    browser.get('/signup');
    expect(browser.getTitle()).toEqual('Sign Up');

    firstName.sendKeys(o.firstName);
    lastName.sendKeys(o.lastName);

    mobile1.sendKeys(o.mobile);
    mobile2.sendKeys(o.mobile);

    email1.sendKeys(o.email);
    email2.sendKeys(o.email);

    password1.sendKeys(o.password);
    password2.sendKeys(o.password);

    element(by.cssContainingText('option', o.role)).click();

    agreeRespect.click();
    agreePhoto.click();
    agreeTnC.click();

    expect (registerNow.isEnabled()).toBeTruthy();

  };

  _.each (signups, function (su) {
    it('should sign up ' + su.firstName + ' ' + su.lastName, function () {

      fillOut(su);
      registerNow.click();
      expect(success.isDisplayed()).toBeTruthy();
      successContinue.click();
      expect(browser.getTitle()).toEqual('Library Home');

    });
  });

});
