var
  _ = require ('../../../app/bower_components/underscore'),
  base = require('./base'),

  thePage = {

    load: function () {
      browser.get('/signup');
      // expect(browser.getTitle()).toEqual('Sign Up');
    },

    firstName: function () {
      return this.getElementByModel('FirstName');
    },

    lastName: function () {
      return this.getElementByModel('LastName');
    },

    mobileGroup : function () {
      return this.getElementById('mobile-group');
    },

    mobile1: function () {
      return this.getElementByModel('Mobile1');
    },

    mobile2: function () {
      return this.getElementByModel('Mobile2');
    },

    emailGroup : function () {
      return this.getElementById('email-group');
    },

    email1: function () {
      return this.getElementByModel('Email1');
    },

    email2: function () {
      return this.getElementByModel('Email2');
    },

    passwordGroup: function () {
      return this.getElementById('password-group');
    },

    hiddenPassword1: function () {
      return this.getElementById('hpassword1');
    },

    hiddenPassword2: function () {
      return this.getElementById('hpassword2');
    },

    shownPassword1: function () {
      return this.getElementById('password1');
    },

    showPassword2: function () {
      return this.getElementById('password2');
    },

    other: function () {
      return this.getElementByModel('Other');
    },

    agreeRespect: function () {
      return this.getElementByModel('AgreeRespect');
    },

    agreePhoto: function () {
      return this.getElementByModel('AgreePhoto');
    },

    agreeTnC: function () {
      return this.getElementByModel('AgreeTnC');
    },

    registerNow: function () {
      return this.getElementByButtonText('Register now');
    },

    signup: function () {
      return this.getElementById('signup');
    },

    success: function () {
      return this.getElementById('success');
    },

    errorEmail: function () {
      return this.getElementById('error-email');
    },

    role: function (v) {
      return this.getSelectElementOption (v);
    },

    successContinue: function () {
      return this.getElementById('success-continue');
    },

    errorEmailContinue: function () {
      return this.getElementById('error-email-continue');
    },

    has1uc: function () {
      return this.getElementById('has1uc');
    },

    has1lc: function () {
      return this.getElementById('has1lc');
    },

    has1n: function () {
      return this.getElementById('has1n');
    },

    has1s: function () {
      return this.getElementById('has1s');
    },

    lenok: function () {
      return this.getElementById('lenok');
    },

    fillOut: function (o) {

      this.load();

      this.firstName().sendKeys(o.firstName);
      this.lastName().sendKeys(o.lastName);

      this.mobile1().sendKeys(o.mobile);
      this.mobile2().sendKeys(o.mobile);


      this.email1().sendKeys(o.email);
      this.email2().sendKeys(o.email);

      this.hiddenPassword1().sendKeys(o.password);
      this.hiddenPassword2().sendKeys(o.password);

      this.role(o.role).click();

      if (o.hasOwnProperty('other')) {
        this.other().sendKeys(o.other);
      }

      this.agreeRespect().click();
      this.agreePhoto().click();
      this.agreeTnC().click();

      expect (this.registerNow().isEnabled()).toBeTruthy();
    }
  };

module.exports = _.extend(thePage, base);
