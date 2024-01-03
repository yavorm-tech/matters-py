import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 'postgresql+psycopg2://postgres:1234qwer@172.20.0.6/gitdeploy')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CELERY_BROKER_URL = os.environ.get(
        'CELERY_BROKER_URL', 'redis://172.20.0.4:6379/0')
    CELERY_RESULT_BACKEND = os.environ.get(
        'CELERY_RESULT_BACKEND', 'redis://172.20.0.4:6379/1')
    FORCE_ROOT = os.environ.get('C_FORCE_ROOT', True)
    GITHUB_TOKEN = os.environ.get(
        'GIT_PASSWD', 'asdasfd')
