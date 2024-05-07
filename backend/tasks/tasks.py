from celery import shared_task
from git import Repo, Git
from git.exc import GitCommandError
import os
import pdb
import traceback
from python_on_whales import docker
from python_on_whales import exceptions as POWExceptions
from models import db, Person, PersonProperty
import sys
import shutil
import boto3
from models import db
from celery.contrib.abortable import AbortableTask
import logging
logger = logging.getLogger()

docker_host = os.environ.get("DOCKER_HOST")


@shared_task(name='Add two numbers', bind=True, base=AbortableTask)
def add(self, x, y):
    return x + y


@shared_task(name='update person', bind=True, base=AbortableTask)
def updatePersonTask(self, params):
    try:
        person = Person.query.get(params['id'])
        person.first_name = params['first_name']
        person.middle_name = params['middle_name']
        person.last_name = params['last_name']
        person.egn = params['egn']
        person.eik = params['eik']
        person.fpn = params['fpn']
        db.session.commit()
        return True
    except Exception as e:
        logger.error(f"Error updating person with id {params['id']}")
        logger.error(e)
        return (e)


@shared_task(name='delete person', bind=True, base=AbortableTask)
def deletePersonTask(self, id):
    try:
        Person.query.filter_by(id=id).delete()
        db.session.commit()
        return True
    except Exception as e:
        logger.error(f"Error deleting person with id {id}")
        logger.error(e)
        return (e)


@shared_task(name='delete person property', bind=True, base=AbortableTask)
def deletePersonPropertyTask(self, id):
    result = 0
    try:
        PersonProperty.query.filter_by(id=id).delete()
        db.session.commit()
    except Exception as e:
        logger.error("Error deleting person property")
        logger.error(e)
        result = 1
    return (result)


@shared_task(name="add person", bind=True, base=AbortableTask)
def addPersonTask(self, params):
    first_name = params['first_name']
    middle_name = params['middle_name']
    last_name = params['last_name']
    egn = params['egn']
    eik = params['eik']
    fpn = params['fpn']
    result = False
    try:
        new_person = Person(first_name=first_name, middle_name=middle_name,
                            last_name=last_name, egn=egn, eik=eik, fpn=fpn)
        db.session.add(new_person)
        db.session.commit()
        result = True
    except Exception as e:
        print(e)
    return result


@shared_task(name="add person property", bind=True, base=AbortableTask)
def addPersonPropertyTask(self, params):
    title = params['title']
    type = params['type']
    description = params['description']
    result = False
    # if person id is selected add it to the property table ** TODO
    try:
        new_personproperty = PersonProperty(title=title, type=type,
                                            description=description)
        db.session.add(new_personproperty)
        db.session.commit()
        result = True
    except Exception as e:
        print(e)
    return result
