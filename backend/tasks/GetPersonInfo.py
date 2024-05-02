from models import db, Person, PersonProperty
from git import Repo, Git
from flask import jsonify
import os
import pdb
import shutil
import traceback
import json
from git.exc import GitCommandError
from celery.utils.log import get_task_logger
import logging
from uuid import uuid4
from celery import Task
from celery.contrib.abortable import AbortableTask
from celery.worker.request import Request
from celery.utils.log import get_task_logger
from celery import shared_task
from utils.substitudeinfile import substitueStringInFile
from utils.ssh import restartNginx

logger = logging.getLogger()


class MyRequest(Request):
    def on_timeout(self, soft, timeout):
        super(MyRequest, self).on_timeout(soft, timeout)
        if not soft:
            logger.warning(
                'A hard timeout was enforced for task %s',
                self.task.name
            )

    def on_failure(self, exc_info, send_failed_event=True, return_ok=False):
        super().on_failure(
            exc_info,
            send_failed_event=send_failed_event,
            return_ok=return_ok
        )
        logger.warning(exc_info)
        logger.warning(
            'Failure detected for task %s',
            self.task.name
        )


class GetPersonInfo(Task):
    Request = MyRequest  # you can use a FQN 'my.package:MyRequest'

    def __init__(self):
        pass

    # def formatVariables(self):
    #     if (self.data is not None):
    #         self.repo_name = self.data['repository'].replace('Payarc/', '')
    #         self.git_url = f"https://{self.git_user}:{self.git_passwd}@github.com/Payarc/{self.repo_name}.git"
    #         self.branch_name = self.data['branch']
    def run(self, *args, **kwargs):
        pass
