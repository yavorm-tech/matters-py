from flask import Blueprint, current_app, request, jsonify, make_response
from flask_cors import cross_origin, CORS
import json
import logging
from models import db, Person, PersonProperty
from uuid import uuid4
import random
import re
import pdb
from tasks.tasks import deletePersonTask, addPersonTask, deletePersonPropertyTask, updatePersonTask, addPersonPropertyTask
from seeders.insert_person_records import InsertFakeData
from celery import group
from os import path, mkdir
from sqlalchemy.exc import IntegrityError

logger = logging.getLogger()

my_blueprint = Blueprint('my blueprint', __name__)


@my_blueprint.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    # Other headers can be added here if needed
    return response


@my_blueprint.route('/', methods=['GET'])  # Registry of all matters
def index():
    return jsonify({"result": "success"})


@my_blueprint.route('/person', methods=['GET'])  # Return Person Panel
def persons():
    persons = db.session.query(Person).all()
    data = []
    for person in persons:
        data.append(person.to_dict(
            show=['id', 'first_name', 'middle_name', 'last_name', 'egn', 'eik', 'fpn']))
    print(data)
    return jsonify(data)


@my_blueprint.route('/exitdocument', methods=['GET'])
def exitdocuments():
    return jsonify({"result": "success"})


@my_blueprint.route('/enterdocument', methods=['GET'])
def enterdocuments():
    return jsonify({"result": "success"})


@my_blueprint.route('/person', methods=['POST'])
def addperson():
    result = False
    if (request.get_data()):
        params = json.loads(request.get_data())
        result = addPersonTask(params)
    return jsonify({"result": result})


@my_blueprint.route('/person/<id>', methods=['DELETE'])
def deletepersons(id):
    result = deletePersonTask(id)

    if isinstance(result, IntegrityError):
        print(result)
        return "The Person has records in property. Delete corresponding property records first.", 406
    if (result == True):
        return "Record deleted", 200

    print(result)
    return "Undefined error", 400


@my_blueprint.route('/person/<id>', methods=['PUT'])
def updatepersons(id):
    data = json.loads(request.get_data())
    data['id'] = id
    result = updatePersonTask(data)
    if (result == True):
        return "Record updated", 201
    print(result)
    return "Undefined error", 400


@my_blueprint.route('/person-property', methods=['GET'])
def getAllPersonProperty():
    person_prop = db.session.query(PersonProperty, Person).join(
        Person, PersonProperty.person_id == Person.id).order_by(PersonProperty.id.desc()).all()
    data = []
    for prop in person_prop:
        person_property = prop[0].to_dict(
            show=['id', 'title', 'type', 'description'])

        person = prop[1].to_dict(
            show=['first_name', 'middle_name', 'last_name', 'egn'], _hide=['id'])
        print(person)
        person_property.update(person)
        data.append(person_property)
    return jsonify(data)


@ my_blueprint.route('/person-property/<id>', methods=['GET'])
def getPersonPropertyById():
    pass


@ my_blueprint.route('/person-property', methods=['POST'])
def addPersonProperty():
    result = False
    if (request.get_data()):
        params = json.loads(request.get_data())
        result = addPersonPropertyTask(params)
        if (result == True):
            return "Property created", 201
        else:
            return "Undefined error", 400


@ my_blueprint.route('/person-property/<id>', methods=['DELETE'])
def deletePersonProperty(id):
    result = deletePersonPropertyTask(id)
    return jsonify({"result": result})


@ my_blueprint.route('/person-property/<id>', methods=['PATCH'])
def updatePersonProperty():
    pass


@ my_blueprint.route('/seedpersons', methods=['GET'])
def seedPersons():
    faker = InsertFakeData()
    persons = faker.create10Persons()
    return jsonify({"result": persons})
