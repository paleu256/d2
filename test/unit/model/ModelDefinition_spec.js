/* jshint nonew:false */
import fixtures from '../../fixtures/fixtures.js';
import ModelDefinition from '../../../src/model/ModelDefinition.js';

describe('ModelDefinition', () => {
    'use strict';

    var modelDefinition;

    beforeEach(() => {
        modelDefinition = new ModelDefinition('dataElement');
    });

    it('should create a ModelDefinition object', () => {
        expect(modelDefinition).to.be.instanceof(ModelDefinition);
    });

    it('should not add epiEndpoint when it does not exist', () => {
        expect(modelDefinition.apiEndpoint).not.to.be.defined;
    });

    it('should throw an error when a name is not specified', () => {
        function shouldThrow() {
            new ModelDefinition();
        }
        expect(shouldThrow).to.throw('Value should be provided');
    });

    it('should throw if the name is not a string', () => {
        function shouldThrow() {
            new ModelDefinition({});
        }
        expect(shouldThrow).to.throw('Expected [object Object] to have type string');
    });

    describe('instance', () => {
        it('should not be able to change the name', () => {
            var isWritable = Object.getOwnPropertyDescriptor(modelDefinition, 'name').writable;
            var isConfigurable = Object.getOwnPropertyDescriptor(modelDefinition, 'name').configurable;

            expect(isWritable).to.be.false;
            expect(isConfigurable).to.be.false;
        });

        it('should not change the name', () => {
            function shouldThrow() {
                modelDefinition.name = 'anotherName';

                if (modelDefinition.name !== 'anotherName') {
                    throw new Error('');
                }
            }

            expect(modelDefinition.name).to.equal('dataElement');
            expect(shouldThrow).to.throw();
        });

        it('should not be able to change the isMetaData', () => {
            var isWritable = Object.getOwnPropertyDescriptor(modelDefinition, 'isMetaData').writable;
            var isConfigurable = Object.getOwnPropertyDescriptor(modelDefinition, 'isMetaData').configurable;

            expect(isWritable).to.be.false;
            expect(isConfigurable).to.be.false;
        });

        it('should not change the isMetaData', () => {
            function shouldThrow() {
                modelDefinition.isMetaData = true;

                if (modelDefinition.isMetaData !== true) {
                    throw new Error('');
                }
            }

            expect(modelDefinition.isMetaData).to.equal(false);
            expect(shouldThrow).to.throw();
        });
    });

    describe('createFromSchema', () => {
        var dataElementModelDefinition;

        beforeEach(() => {
            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
        });

        it('should be a method on ModelDefinition', () => {
            expect(ModelDefinition.createFromSchema).to.be.defined;
        });

        it('should throw if the schema is not provided', () => {
            expect(ModelDefinition.createFromSchema).to.throw('Schema should be provided');
        });

        describe('dataElementSchema', () => {
            it('should return a ModelDefinition object', () => {
                expect(dataElementModelDefinition).to.be.instanceof(ModelDefinition);
            });

            it('should set the name on the definition', () => {
                expect(dataElementModelDefinition.name).to.equal('dataElement');
            });

            it('should set if it is a metadata model', () => {
                expect(dataElementModelDefinition.isMetaData).to.be.true;
            });

            it('should set the epiEndpoint', () => {
                expect(dataElementModelDefinition.apiEndpoint).to.equal('/dataElements');
            });

            it('should set metadata to false if it is not a metadata model', () => {
                var nonMetaDataModel = fixtures.get('/api/schemas/dataElement');
                nonMetaDataModel.metadata = false;

                dataElementModelDefinition = ModelDefinition.createFromSchema(nonMetaDataModel);

                expect(dataElementModelDefinition.isMetaData).to.be.false;
            });

            it('should a properties property for each of the schema properties', () => {
                expect(Object.keys(dataElementModelDefinition.modelProperties).length).to.equal(34);
            });

            it('should not be able to modify the modelProperties array', () => {
                function shouldThrow() {
                    dataElementModelDefinition.modelProperties.anotherKey = {};

                    //TODO: There is an implementation bug in PhantomJS that does not properly freeze the array
                    if (Object.keys(dataElementModelDefinition.modelProperties).length === 34) {
                        throw new Error();
                    }
                }

                expect(shouldThrow).to.throw();
                expect(Object.keys(dataElementModelDefinition.modelProperties).length).to.equal(34);
            });
        });

        describe('modelProperties', () => {
            var modelProperties;

            beforeEach(() => {
                modelProperties = dataElementModelDefinition.modelProperties;
            });

            it('should be an object', () => {
                expect(modelProperties.name).to.be.instanceof(Object);
            });

            it('should throw an error when a type is not found', () => {
                var dataElementModelDefinition;
                var schema = fixtures.get('/api/schemas/dataElement');
                schema.properties.push({
                    name: 'unknownProperty',
                    propertyType: 'uio.some.unknown.type'
                });
                function shouldThrow() {
                    dataElementModelDefinition = ModelDefinition.createFromSchema(schema);
                }

                expect(shouldThrow).to.throw('Type from schema "uio.some.unknown.type" not found available type list.');
            });

            it('should use the collection name for collections', () => {
                expect(modelProperties.dataElementGroups).to.be.defined;
                expect(modelProperties.dataElementGroup).not.to.be.defined;
            });

            it('should add a get method to the propertyDescriptor', () => {
                expect(modelProperties.name.get).to.be.instanceof(Function);
            });

            it('should add a set method to the propertyDescriptor for name', () => {
                expect(modelProperties.name.set).to.be.instanceof(Function);
            });

            it('should not have a set method for dimensionType', () => {
                //TODO: Implement not being able to set certain properties
                //expect(modelProperties.dimensionType.set).not.to.be.instanceof(Function);
                return;
            });

            it('should create getter function on the propertyDescriptor', () => {
                var model = {
                    dataValues: {
                        name: 'Mark'
                    }
                };

                expect(modelProperties.name.get.call(model)).to.equal('Mark');
            });

            it('should create setter function on the propertyDescriptor', () => {
                var model = {
                    dataValues: {

                    }
                };

                modelProperties.name.set.call(model, 'James');

                expect(model.dataValues.name).to.equal('James');
            });
        });

        describe('modelValidations', () => {
            var modelValidations;

            beforeEach(() => {
                modelValidations = dataElementModelDefinition.modelValidations;
            });

            describe('created', () => {
                it('should set the data object as a type for date fields', () => {
                    expect(modelValidations.created.type).to.equal('DATE');
                });

                it('should be owned by this schema', () => {
                    expect(modelValidations.created.owner).to.be.true;
                });
            });

            describe('externalAccess', () => {
                it('should set the boolean datatype for externalAccess', () => {
                    expect(modelValidations.externalAccess.type).to.equal('BOOLEAN');
                });

                it('should not be owned by this schema', () => {
                    expect(modelValidations.externalAccess.owner).to.be.false;
                });

                //TODO: This currently has some sort of max value
                //it('should not have a maxLength property', () => {
                //    expect(modelValidations.externalAccess.maxLength).toBe(undefined);
                //});
            });

            describe('name', () => {
                it('should have have a type property', () => {
                    expect(modelValidations.name.type).to.equal('TEXT');
                });

                it('should have a maxLength', () => {
                    expect(modelValidations.name.max).to.equal(230);
                });

                it('should have a persisted property', () => {
                    expect(modelValidations.name.persisted).to.be.true;
                });

                it('should have a required property', () => {
                    expect(modelValidations.name.required).to.be.true;
                });

                it('should have an owner property', () => {
                    expect(modelValidations.name.owner).to.be.true;
                });
            });
        });
    });

    describe('create', () => {
        var Model;
        var dataElementModelDefinition;

        //TODO: Figure out a way to mock a require
        beforeEach(() => {
            Model = require('d2/model/Model');

            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
        });

        //TODO: Look at these tests
        //it('should call the model constructor', () => {
        //    dataElementModelDefinition.create();
        //
        //    expect(tempD2.Model).toHaveBeenCalled();
        //});
        //
        //it('should call the model constructor with the the modelDefinition', () => {
        //    dataElementModelDefinition.create();
        //
        //    expect(tempD2.Model).to.be.calledWith(dataElementModelDefinition);
        //});

        //TODO: This is currently not a pure unit test as we haven't mocked out Model
        it('should return an instance of Model', () => {
            expect(dataElementModelDefinition.create()).to.be.instanceof(Model);
        });
    });

    describe('get', () => {
        var dataElementModelDefinition;

        beforeEach (() => {
            ModelDefinition.prototype.api = {
                get: stub().returns(new Promise((resolve) => {
                    resolve({name: 'BS_COLL (N, DSD) TARGET: Blood Units Donated'});
                }))
            };

            dataElementModelDefinition = ModelDefinition.createFromSchema(fixtures.get('/api/schemas/dataElement'));
        });

        it('should throw an error when the given id is not a string', () => {
            function shouldThrow() {
                dataElementModelDefinition.get();
            }

            expect(shouldThrow).to.throw('Identifier should be provided');
        });

        it('should return a promise', () => {
            var modelPromise = dataElementModelDefinition
                .get('d4343fsss');

            expect(modelPromise.then).to.be.instanceof(Function);
        });

        it('should call the api for the requested id', () => {
            dataElementModelDefinition.get('d4343fsss');

            expect(ModelDefinition.prototype.api.get).to.be.calledWith('/dataElements/d4343fsss', {fields: ':all'});
        });

        it('should set the data onto the model when it is available', (done) => {
            dataElementModelDefinition.get('d4343fsss')
                .then((dataElementModel) => {
                    expect(dataElementModel.name).to.equal('BS_COLL (N, DSD) TARGET: Blood Units Donated');
                    done();
                });
        });

        it('should reject the promise with the message when the request fails', (done) => {
            ModelDefinition.prototype.api.get = stub().returns(new Promise((resolve, reject) => {
                reject({data: 'id not found'});
            }));

            dataElementModelDefinition.get('d4343fsss')
                .catch((dataElementError) => {
                    expect(dataElementError).to.equal('id not found');
                    done();
                });
        });
    });
});
/* jshint nonew:true */