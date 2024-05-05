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
    f_name = params['fname']
    m_name = params['mname']
    l_name = params['lname']
    egn = params['egn']
    eik = params['eik']
    fpn = params['fpn']
    result = False
    try:
        new_person = Person(first_name=f_name, middle_name=m_name,
                            last_name=l_name, egn=egn, eik=eik, fpn=fpn)
        db.session.add(new_person)
        db.session.commit()
        result = True
    except Exception as e:
        print(e)
    return result
