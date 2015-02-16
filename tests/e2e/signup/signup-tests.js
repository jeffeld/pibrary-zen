var
  _ = require('../../../app/bower_components/underscore'),
  bootstrap = require('../common/bootstrap'),
  page = require ('../common/signup'),

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
      firstName : 'Sarah-Jane',
      lastName : 'Smith',
      mobile: '0879876543',
      email: 'sarahjane@unit.com',
      password: 'sarahJane1#',
      role: 'staff'
    },
    {
      firstName : 'Jo',
      lastName : 'Grant',
      mobile: '0872143658',
      email: 'jo@unit.com',
      password: 'JoGrant1#',
      role: 'a parent'
    },
    {
      firstName : 'Liz',
      lastName : 'Shaw',
      mobile: '0871112234',
      email: 'liz@unit.com',
      password: 'LizShaw1#',
      role: 'none of the above',
      other: 'a scientist'
    }

  ]

;


describe('Sign Up page', function() {

  _.each (signups, function (su) {
    it('should sign up ' + su.firstName + ' ' + su.lastName, function () {

      page.fillOut(su);

      if (su.hasOwnProperty('other')) {
        expect(page.other().isDisplayed()).toBeTruthy();
      }

      page.registerNow().click();
      expect(page.success().isDisplayed()).toBeTruthy();
      page.successContinue().click();
      expect(browser.getTitle()).toEqual('Library Home');

    });
  });


  it('should detect a duplicate email address', function () {

    page.fillOut(signups[0]);
    page.registerNow().click();
    expect (page.errorEmail().isDisplayed()).toBeTruthy();

    page.errorEmailContinue().click();
    expect (page.signup().isDisplayed()).toBeTruthy();

    page.email1().getText().then (function (v) {
      expect(v.length).toBe(0)
    });

    page.email2().getText().then (function (v) {
      expect(v.length).toBe(0)
    });


  });

  it('should detect email address group has an error', function () {

    var
      e1 = page.email1(),
      e2 = page.email2(),
      eg = page.emailGroup();

    e1.sendKeys(signups[0].email);
    e2.sendKeys(signups[1].email);

    expect(page.hasClass(eg, bootstrap.classes.hasError)).toBeTruthy();

    e2.clear();
    e2.sendKeys(signups[0].email);

    expect(page.hasClass(eg, bootstrap.classes.hasError)).not.toBeTruthy();

  });

  it ('should detect mobile number group has an error', function () {

    var
      m1 = page.mobile1(),
      m2 = page.mobile2(),
      mg = page.mobileGroup();

    m1.clear();
    m2.clear();

    m1.sendKeys(signups[0].mobile);
    m2.sendKeys(signups[1].mobile);

    expect(page.hasClass(mg, bootstrap.classes.hasError)).toBeTruthy();

    m2.clear();
    m2.sendKeys(signups[0].mobile);

    expect(page.hasClass(mg, bootstrap.classes.hasError)).not.toBeTruthy();

  });

  it ('should detect password group has an error', function () {

    var
      p1 = page.hiddenPassword1(),
      p2 = page.hiddenPassword2(),
      pg = page.passwordGroup();

    p1.clear();
    p2.clear();

    p1.sendKeys(signups[0].password);
    p2.sendKeys(signups[1].password);

    expect(page.hasClass(pg, bootstrap.classes.hasError)).toBeTruthy();

    p2.clear();
    p2.sendKeys(signups[0].password);

    expect(page.hasClass(pg, bootstrap.classes.hasError)).not.toBeTruthy();

  });


});
