/*
    OlORun is Tool to apply traditional testing on api 
    - Type
    - Length
    - Injection Payloads
    Author: Ahmed Zakaria Mohamed
*/

// Imports
const fs = require('fs');
const { faker, base } = require('@faker-js/faker');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let expectChai = chai.expect;
chai.use(chaiHttp);

// Functions
function readConfigurationFile()
{
    let conf = fs.readFileSync('conf.json');
    conf = JSON.parse(conf);
    return conf;
}

function randomFixedInteger(length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
}

function randomFixedFloat(length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1))+0.5;
}

function payloadGenerator(type,length)
{
    let payload;

    if(type == 'int')
        payload = randomFixedInteger(length);
    else if(type == 'float')
        payload = randomFixedFloat(length);
    else if(type == 'string')
        payload = faker.string.alpha(length);
    else
        payload = null

    return payload;
}

function typePayloadGenerator(type)
{
    let payload;
    if(type == 'int')
        payload = [50.0,'A','AAAAAAAAAAA',true,[10,20]]
    else if(type == 'float')
        payload = [50,'A','AAAAAAAAAAA',true,[10,20]]
    else if(type == 'char')
        payload = [50,50.0,'AAAAAAAAAAA',true,[10,20]]
    else if(type == 'String')
        payload = [50,50.0,-10,true,[10,20]]
    else if(type == 'bool')
        payload = [50,50.0,'AAAAAAAAAAA','A',[10,20]]
    
    return payload;
}

const sqlInjectionPayloads = fs.readFileSync('security/sql_injection.txt',{ encoding: 'utf8', flag: 'r' }).toString().split('\n');
const xssInjectionPayloads = fs.readFileSync('security/xss.txt',{ encoding: 'utf8', flag: 'r' }).toString().split('\n');



// Implementation 
let conf = readConfigurationFile();
let numberOfEndPoints = conf.endPoints.length;
let endPoints = conf.endPoints;
let typePayloadLength = 5;
let sqlConf = conf.sqlInection;
let xssConf = conf.xss;

describe('OlORun - API Testing | Number Of EndPoints = ' + numberOfEndPoints, function()
{
    this.timeout(10000);
    
    for(let i = 0; i < numberOfEndPoints; i++)
    {
        currentEndPoint = endPoints[i];
        currentParamters = currentEndPoint.paramters;
        
        describe(currentEndPoint.path + ' | Happy Path', function()
        {
            for(let p = 0; p < currentParamters.length; p++)
            {
                
                it('Minmum Length',(done) => 
                {
                    paramter = currentParamters[p];
                    console.log('Current Paramter -> ', paramter.name)
                    let payload = payloadGenerator(paramter.type,paramter.minLength);
                    let header = currentEndPoint.headers[0];
                    let feilds = JSON.parse(JSON.stringify(currentEndPoint.defaultValidFeilds));
                    let happayStatus = currentEndPoint.happyPathStatus;
                    feilds[paramter.name] = payload;
                    console.log(feilds);
                    if(currentEndPoint.method == 'GET')
                    {
                        chai.request(currentEndPoint.baseUrl).get(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                        {
                            expectChai(res.status).to.be.oneOf(happayStatus);
                            //res.should.have.status(200);
                            done();
                        });
                    }
                    else if(currentEndPoint.method == 'POST')
                    {
                        chai.request(currentEndPoint.baseUrl).post(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                        {
                            expectChai(res.status).to.be.oneOf(happayStatus);
                            //res.should.have.status(200);
                            done();
                        });
                    }
                    else if(currentEndPoint.method == 'PUT')
                    {
                        chai.request(currentEndPoint.baseUrl).put(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                        {
                            expectChai(res.status).to.be.oneOf(happayStatus);
                            //res.should.have.status(200);
                            done();
                        });
                    }
                    else if(currentEndPoint.method == 'DELETE')
                    {
                        chai.request(currentEndPoint.baseUrl).delete(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                        {
                            expectChai(res.status).to.be.oneOf(happayStatus);
                            //res.should.have.status(200);
                            done();
                        });
                    }
                    else{
                        console.log('Method Not Allowed');
                    }

                    
                });

                
            }

            for(let p = 0; p < currentParamters.length; p++)
            {
                
                it('Max Length',(done) => 
                {
                    paramter = currentParamters[p];
                    console.log('Current Paramter -> ', paramter.name)
                    let payload = payloadGenerator(paramter.type,paramter.maxLength);
                    let header = currentEndPoint.headers[0];
                    let feilds = JSON.parse(JSON.stringify(currentEndPoint.defaultValidFeilds));
                    let happayStatus = currentEndPoint.happyPathStatus;
                    feilds[paramter.name] = payload;
                    console.log(feilds);
                    if(currentEndPoint.method == 'GET')
                    {
                        chai.request(currentEndPoint.baseUrl).get(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                        {
                            expectChai(res.status).to.be.oneOf(happayStatus);
                            //res.should.have.status(200);
                            done();
                        });
                    }
                    else if(currentEndPoint.method == 'POST')
                    {
                        chai.request(currentEndPoint.baseUrl).post(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                        {
                            expectChai(res.status).to.be.oneOf(happayStatus);
                            //res.should.have.status(200);
                            done();
                        });
                    }
                    else if(currentEndPoint.method == 'PUT')
                    {
                        chai.request(currentEndPoint.baseUrl).put(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                        {
                            expectChai(res.status).to.be.oneOf(happayStatus);
                            //res.should.have.status(200);
                            done();
                        });
                    }
                    else if(currentEndPoint.method == 'DELETE')
                    {
                        chai.request(currentEndPoint.baseUrl).delete(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                        {
                            expectChai(res.status).to.be.oneOf(happayStatus);
                            //res.should.have.status(200);
                            done();
                        });
                    }
                    else{
                        console.log('Method Not Allowed');
                    }

                    
                });

                
            }
            
        });

        describe(currentEndPoint.path + ' | Evil Path', function()
        {
            for(let p = 0; p < currentParamters.length; p++)
            {
                
                it(' Payload < Minmum Length',(done) => 
                {
                    paramter = currentParamters[p];
                    console.log('Current Paramter -> ', paramter.name)
                    let payload = payloadGenerator(paramter.type,paramter.minLength - 1);
                    let header = currentEndPoint.headers[0];
                    let feilds = JSON.parse(JSON.stringify(currentEndPoint.defaultValidFeilds));
                    let filteredStatus = currentEndPoint.filteredStatus;
                    feilds[paramter.name] = payload;
                    console.log(feilds);
                    if(currentEndPoint.method == 'GET')
                    {
                        chai.request(currentEndPoint.baseUrl).get(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                        {
                            expectChai(res.status).to.be.oneOf(filteredStatus);
                            //res.should.have.status(200);
                            done();
                        });
                    }
                    else if(currentEndPoint.method == 'POST')
                    {
                        chai.request(currentEndPoint.baseUrl).post(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                        {
                            expectChai(res.status).to.be.oneOf(filteredStatus);
                            //res.should.have.status(200);
                            done();
                        });
                    }
                    else if(currentEndPoint.method == 'PUT')
                    {
                        chai.request(currentEndPoint.baseUrl).put(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                        {
                            expectChai(res.status).to.be.oneOf(filteredStatus);
                            //res.should.have.status(200);
                            done();
                        });
                    }
                    else if(currentEndPoint.method == 'DELETE')
                    {
                        chai.request(currentEndPoint.baseUrl).delete(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                        {
                            expectChai(res.status).to.be.oneOf(filteredStatus);
                            //res.should.have.status(200);
                            done();
                        });
                    }
                    else{
                        console.log('Method Not Allowed');
                    }

                    
                });

                
            }

            for(let p = 0; p < currentParamters.length; p++)
            {
                
                it('Payload > Maxmuim Length',(done) => 
                {
                    paramter = currentParamters[p];
                    console.log('Current Paramter -> ', paramter.name)
                    let payload = payloadGenerator(paramter.type,paramter.maxLength + 1);
                    let header = currentEndPoint.headers[0];
                    let feilds = JSON.parse(JSON.stringify(currentEndPoint.defaultValidFeilds));
                    let filteredStatus = currentEndPoint.filteredStatus;
                    feilds[paramter.name] = payload;
                    console.log(feilds);
                    if(currentEndPoint.method == 'GET')
                    {
                        chai.request(currentEndPoint.baseUrl).get(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                        {
                            expectChai(res.status).to.be.oneOf(filteredStatus);
                            //res.should.have.status(200);
                            done();
                        });
                    }
                    else if(currentEndPoint.method == 'POST')
                    {
                        chai.request(currentEndPoint.baseUrl).post(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                        {
                            expectChai(res.status).to.be.oneOf(filteredStatus);
                            //res.should.have.status(200);
                            done();
                        });
                    }
                    else if(currentEndPoint.method == 'PUT')
                    {
                        chai.request(currentEndPoint.baseUrl).put(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                        {
                            expectChai(res.status).to.be.oneOf(filteredStatus);
                            //res.should.have.status(200);
                            done();
                        });
                    }
                    else if(currentEndPoint.method == 'DELETE')
                    {
                        chai.request(currentEndPoint.baseUrl).delete(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                        {
                            expectChai(res.status).to.be.oneOf(filteredStatus);
                            //res.should.have.status(200);
                            done();
                        });
                    }
                    else{
                        console.log('Method Not Allowed');
                    }

                    
                });

                
            }

            for(let p = 0; p < currentParamters.length; p++)
            {

                for (let j = 0; j < typePayloadLength; j++)
                {
                    it('Type Validation | ' + j,(done) => 
                    {
                        paramter = currentParamters[p];
                        console.log('Current Paramter -> ', paramter.name)
                        let payload = typePayloadGenerator(paramter.type);
                        let header = currentEndPoint.headers[0];
                        let feilds = JSON.parse(JSON.stringify(currentEndPoint.defaultValidFeilds));
                        let filteredStatus = currentEndPoint.filteredStatus;
                        feilds[paramter.name] = payload[j];
                        console.log('Current Payload -> ', payload[j]);
                        console.log(feilds);
                        if(currentEndPoint.method == 'GET')
                        {
                            chai.request(currentEndPoint.baseUrl).get(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                            {
                                expectChai(res.status).to.be.oneOf(filteredStatus);
                                //res.should.have.status(200);
                                done();
                            });
                        }
                        else if(currentEndPoint.method == 'POST')
                        {
                            chai.request(currentEndPoint.baseUrl).post(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                            {
                                expectChai(res.status).to.be.oneOf(filteredStatus);
                                //res.should.have.status(200);
                                done();
                            });
                        }
                        else if(currentEndPoint.method == 'PUT')
                        {
                            chai.request(currentEndPoint.baseUrl).put(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                            {
                                expectChai(res.status).to.be.oneOf(filteredStatus);
                                //res.should.have.status(200);
                                done();
                            });
                        }
                        else if(currentEndPoint.method == 'DELETE')
                        {
                            chai.request(currentEndPoint.baseUrl).delete(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                            {
                                expectChai(res.status).to.be.oneOf(filteredStatus);
                                //res.should.have.status(200);
                                done();
                            });
                        }
                        else{
                            console.log('Method Not Allowed');
                        }


                    });
                    

                
                }
                
            }

        });

        describe(currentEndPoint.path + ' | Injections', function()
        {
            // Sql Injection
            if (sqlConf.flag == true)
            {
                for(let j = 0; j < sqlConf.numberOfPayloads; j++)
                {
                    let payload = sqlInjectionPayloads[j];

                    for(let p = 0; p < currentParamters.length; p++)
                    {
                        it('Sql Injection',(done) => 
                        {
                            console.log('Payload -> ', payload);
                            paramter = currentParamters[p];
                            console.log('Current Paramter -> ', paramter.name)
                            let header = currentEndPoint.headers[0];
                            let feilds = JSON.parse(JSON.stringify(currentEndPoint.defaultValidFeilds));
                            let filteredStatus = currentEndPoint.filteredStatus;
                            feilds[paramter.name] = payload;
                            console.log(feilds);
                            if(currentEndPoint.method == 'GET')
                            {
                                chai.request(currentEndPoint.baseUrl).get(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                                {
                                    expectChai(res.status).to.be.oneOf(filteredStatus);
                                    //res.should.have.status(200);
                                    done();
                                });
                            }
                            else if(currentEndPoint.method == 'POST')
                            {
                                chai.request(currentEndPoint.baseUrl).post(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                                {
                                    expectChai(res.status).to.be.oneOf(filteredStatus);
                                    //res.should.have.status(200);
                                    done();
                                });
                            }
                            else if(currentEndPoint.method == 'PUT')
                            {
                                chai.request(currentEndPoint.baseUrl).put(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                                {
                                    expectChai(res.status).to.be.oneOf(filteredStatus);
                                    //res.should.have.status(200);
                                    done();
                                });
                            }
                            else if(currentEndPoint.method == 'DELETE')
                            {
                                chai.request(currentEndPoint.baseUrl).delete(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                                {
                                    expectChai(res.status).to.be.oneOf(filteredStatus);
                                    //res.should.have.status(200);
                                    done();
                                });
                            }
                            else{
                                console.log('Method Not Allowed');
                            }
                            });
                    
                    }
                    
                }
            }
            

            // Xss
            if (xssConf.flag == true)
            {
                for(let j = 0; j < xssConf.numberOfPayloads; j++)
                {
                    let payload = xssInjectionPayloads[j];
    
                    for(let p = 0; p < currentParamters.length; p++)
                    {
                        it('XSS',(done) => 
                        {
                            console.log('Payload -> ', payload);
                            paramter = currentParamters[p];
                            console.log('Current Paramter -> ', paramter.name)
                            let header = currentEndPoint.headers[0];
                            let feilds = JSON.parse(JSON.stringify(currentEndPoint.defaultValidFeilds));
                            let filteredStatus = currentEndPoint.filteredStatus;
                            feilds[paramter.name] = payload;
                            console.log(feilds);
                            if(currentEndPoint.method == 'GET')
                            {
                                chai.request(currentEndPoint.baseUrl).get(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                                {
                                    expectChai(res.status).to.be.oneOf(filteredStatus);
                                    //res.should.have.status(200);
                                    done();
                                });
                            }
                            else if(currentEndPoint.method == 'POST')
                            {
                                chai.request(currentEndPoint.baseUrl).post(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                                {
                                    expectChai(res.status).to.be.oneOf(filteredStatus);
                                    //res.should.have.status(200);
                                    done();
                                });
                            }
                            else if(currentEndPoint.method == 'PUT')
                            {
                                chai.request(currentEndPoint.baseUrl).put(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                                {
                                    expectChai(res.status).to.be.oneOf(filteredStatus);
                                    //res.should.have.status(200);
                                    done();
                                });
                            }
                            else if(currentEndPoint.method == 'DELETE')
                            {
                                chai.request(currentEndPoint.baseUrl).delete(currentEndPoint.path).set(header.key,header.value).field(feilds).end((err,res) => 
                                {
                                    expectChai(res.status).to.be.oneOf(filteredStatus);
                                    //res.should.have.status(200);
                                    done();
                                });
                            }
                            else{
                                console.log('Method Not Allowed');
                            }
                            });
                    
                    }
                    
                }
            }
           
        });
    }
});


