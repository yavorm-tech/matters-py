from celery import shared_task
from git import Repo, Git
from git.exc import GitCommandError
import os
import pdb
import traceback
from python_on_whales import docker
from python_on_whales import exceptions as POWExceptions
import sys
import shutil
import boto3
from models import db
from celery.contrib.abortable import AbortableTask

docker_host = os.environ.get("DOCKER_HOST")





@shared_task(name='Add two numbers', bind=True, base=AbortableTask)
def add(x, y):
    return x + y


