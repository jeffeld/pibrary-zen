var
  _ = require ('../../../app/bower_components/underscore'),
  base = require('./base'),

  thePage = {

    load: function () {
      browser.get('/login');
      expect(browser.getTitle()).toEqual('Login');
    },

    userName: function () {
      return this.getElementByModel('Username');
    },

    password: function () {
      return this.getElementByModel('Password');
    },

    loginButton: function () {
      return this.getElementByCSS('.btn-primary');
    }

};

module.exports = _.extend(thePage, base);
