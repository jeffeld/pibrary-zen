

describe('Prime a production system', function() {

  it('should load the Landing page', function () {
    browser.get ('/');
  });

  it('should load the user mode Home page', function () {
    browser.get ('/home');
  });

  it('should load the Sign Up page', function () {
    browser.get ('/signup');
  });

  it('should login a super-user', function() {

    browser.get('/login');

    expect(browser.getTitle()).toEqual('Login');

    element(by.model('Username')).sendKeys(browser.params.adminUserId);
    element(by.model('Password')).sendKeys(browser.params.adminPassword);
    element(by.css('.btn-primary')).click();

  });

  it('should load the Overdues page', function () {
    browser.get ('/overdues');
  });

  it('should load the Admin Sign Ups page', function () {
    browser.get ('/adminsignups');
  });

  it('should load the Activations page', function () {
    browser.get ('/adminactivations');
  });

  it('should load an ISBN page', function () {
    browser.get ('/9780597748');
  });


});
