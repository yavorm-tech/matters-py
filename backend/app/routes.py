from flask import Blueprint, current_app, request, jsonify
from flask_cors import cross_origin, CORS
import json
from utils.github import manageGitHub, getGitCredentials
from models import db
from uuid import uuid4
import random
import re
import pdb
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


def getUsedDeploymentPorts():
   """  port_in_use = db.session.query(Deployments).filter(
        Deployments.status == 'complete').all()
    ports = []
    for i in port_in_use:
        ports.append(int(i.destination_port))
    found = None
    rand_number = None
    while (found is None):
        rand_number = random.randint(50000, 55000)
        if rand_number not in ports:
            found = 1 """
   rand_number = random.randint(0,10)
   return rand_number



@my_blueprint.route('/', methods=['GET']) # Registry of all matters
def getGitRepos():
   return jsonify({"result": "success"})

@my_blueprint.route('/person', methods=['GET']) # Return Person Panel
def persons():
   return jsonify({"result": "success"})

@my_blueprint.route('/exitdocument', methods=['GET'])
def exitdocuments():
   return jsonify({"result": "success"})

@my_blueprint.route('/enterdocument', methods=['GET'])
def enterdocuments():
   return jsonify({"result": "success"})

@my_blueprint.route('/seedPersons', methods=['POST'])
def seedData():
    faker = InsertFakeData()
    persons = faker.create10Persons()
    pdb.set_trace()
    return jsonify({"result": persons})