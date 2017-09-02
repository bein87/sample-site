'use strict'
const supertest = require("supertest"),
      chai   = require('chai'),
      chaiHttp = require('chai-http'),
      server = supertest.agent("https://tzachbein.com"),
      webCrawlerSite = supertest.agent("https://www.timeanddate.com/weather/?low=4&sort=1"),
      expect = chai.expect,
      should = chai.should()

chai.use(chaiHttp)
chai.should()

describe("weather site that needs to be crawled unit test",function(){
    it("should return status 200",function(done){
        webCrawlerSite.get("/")
        .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.status.should.equal(200);
                done()
            })
    })
})

describe("ui.router redirection unit test",function(){
    it("should return status 200",function(done){
        server.get("/gibrish-and-some-more-gibrish")
        .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.status.should.equal(200);
                done()
            })
    })
})

describe("Get home page unit test",function(){
    it("should return status:200",function(done){
        server.get("/phonebook/clients")
        .expect(200) // THis is HTTP response
            .end(function(err,res){
                // HTTP status should be 200
                res.status.should.equal(200);
                done()
            })
    })
})

describe("Get clients db unit test",function(){
    it("should return status:200 + content-type:json",function(done){
        server.get("/phonebook/clients")
        .expect("Content-type",/json/)
        .expect(200) // THis is HTTP response
        .end(function(err,res){
            // Content Type should be JSON
            res.type.should.equal('application/json')
            // HTTP status should be 200
            res.status.should.equal(200);
            done()
        })
    })
})

describe("Post new client entity unit test",function(){
    it("should return status 200",function(done){
        let newClientEntity = {
            "id" : 1,
            "name" : "test",
            "address" : "test",
            "phone" : 999
        }
        server.post("/phonebook/clients/addClient",newClientEntity)
        .expect(200) // THis is HTTP response
            .end(function(err,res){
                res.status.should.equal(200);
                done()
            })
    })
})
