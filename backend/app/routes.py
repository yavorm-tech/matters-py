from flask import Blueprint, current_app, request, jsonify
from flask_cors import cross_origin, CORS
import json
from utils.github import manageGitHub, getGitCredentials
from models import db
from uuid import uuid4
import random
import re
import pdb

from celery import group
#from utils import AddPushEvent, returnValueFromIndex
#from tasks.tasks import pullRepo, deployRepo, buildContainer, getContainerIpv4Address
from utils.awss3 import GetS3Objects
from utils.nginx import substituteNginxConfParams
from utils.ssh import restartNginx
from utils.receivewebhook import ParseGitPayload
from utils.githubpayloads import getPayloads
from os import path, mkdir
from os import remove as removeFile
from utils.substitudeinfile import substitueStringInFile

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


@my_blueprint.route('/', methods=['GET'])
def getGitRepos():
   return jsonify({"result": "success"})

