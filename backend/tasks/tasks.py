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
from models import Repositories, db, DeploymentErrors
from celery.contrib.abortable import AbortableTask

docker_host = os.environ.get("DOCKER_HOST")
# docker_client = docker.DockerClient(
#    base_url=docker_host, tls=False)


# def getBackendNetwork():
#     client_network = docker_client.networks.get('cpayarc')
#     for container in client_network.attrs.get('Containers'):
#         cont_info = client_network.attrs.get('Containers').get(container)
#         if (cont_info.get('Name') == 'git-deploy-backend'):
#             ip_addr = cont_info.get('IPv4Address').replace('/24', '')
#     return ip_addr

# Get backend network should get the ip address of the newly created container
# write a new function getContainerIp


# def getContainerIpv4Address(container_name):
#     container = docker_client.containers.get(container_name)
#     ip_addr = container.attrs['NetworkSettings']['Networks']['bridge']['IPAddress']
#     return ip_addr

def getContainerIpv4Address(container_name):
    return docker.container.inspect(
        container_name).network_settings.ip_address


def writeError(e, deployment_id):
    err_trace = traceback.format_exc()
    depl_err = DeploymentErrors(
        error=str(e), trace=err_trace, depl_id=deployment_id)
    db.session.add(depl_err)
    db.session.commit()
    # write to database set error=str(e), set trace=traceback.print_exc()
    print(str(e))
    print(err_trace)


@shared_task(name='Add two numbers', bind=True, base=AbortableTask)
def add(x, y):
    repo = Repositories(name='test', url='http://test.local')
    db.session.add(repo)
    db.session.commit()
    return x + y


