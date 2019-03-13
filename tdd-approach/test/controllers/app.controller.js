const chai = require("chai");
const expect = chai.expect;
// import our getIndexPage function
var sinon = require('sinon');
const indexPage = require("../../src/controllers/app.controller.js");

user = {
  addUser: (name) => {
    this.name = name;
  }
}



describe("User", function() {
  describe("addUser", function() {
    it("should add a user", function() {
      
    
      sinon.spy(user, "addUser");

      user.addUser('John Doe');

      // lets log `addUser` and see what we get
     // console.log(user.addUser);
      expect(user.addUser.calledOnce).to.be.true;
    });
  });
});

describe("AppController", function()  {
  describe("getIndexPage", function() {
    it("should send hey when user is logged in", function() {
      // instantiate a user object with an empty isLoggedIn function
      let user = {
        isLoggedIn: function(){}
      }

      // Stub isLoggedIn function and make it return true always
      const isLoggedInStub = sinon.stub(user, "isLoggedIn").returns(true);

      // pass user into the req object
      let req = {
        user: user
      }

      // Have `res` have a send key with a function value coz we use `res.send()` in our func
      let res = {
        send: function(){}
      }

      // mock res
      const mock = sinon.mock(res);
      // build how we expect it t work
      mock.expects("send").once().withExactArgs("Hey");

      indexPage.getIndexPage(req, res);
      expect(isLoggedInStub.calledOnce).to.be.true;

      // verify that mock works as expected
      mock.verify();
    });
  });

 


  describe("getIndexPage2", function() {
    it("should send hey when user is logged in", function() {
      // instantiate a user object with an empty isLoggedIn function
      let user = {
        isLoggedIn: function(){}
      }

      // Stub isLoggedIn function and make it return true always
      const isLoggedInStub = sinon.stub(user, "isLoggedIn").returns(false);

      // pass user into the req object
      let req = {
        user: user
      }

      // Have `res` have a send key with a function value coz we use `res.send()` in our func
      let res = {
        send: function(){}
      }

      // mock res
      indexPage.getIndexPage(req, res);
      expect(isLoggedInStub.calledOnce).to.be.true;

   
    });
 });
});