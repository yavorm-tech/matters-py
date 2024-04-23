from flask import Blueprint, current_app, request, jsonify
from flask_cors import cross_origin, CORS
import json
from models import db, Person
from uuid import uuid4
import random
import re
import pdb
from tasks.tasks import deletePersonTask, addPersonTask
from seeders.insert_person_records import InsertFakeData
from celery import group
from os import path, mkdir


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
    result = 0
    result = deletePersonTask(id)
    print(result)
    return jsonify({"result": result})


@my_blueprint.route('/seedpersons', methods=['GET'])
def seedPersons():
    faker = InsertFakeData()
    persons = faker.create10Persons()
    return jsonify({"result": persons})
