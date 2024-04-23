from flask import Flask, jsonify, request
from flask_cors import CORS
from celery import Celery
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import pdb
from celery import Celery
from celery_utils import celery_init_app
from tasks.tasks import add
from models import db

from .routes import my_blueprint
from .cli_commands import cli_commands
from tasks.GetPersonInfo import GetPersonInfo

celery = Celery(__name__, broker=Config.CELERY_BROKER_URL,
                backend=Config.CELERY_RESULT_BACKEND)
migrate = Migrate()


def create_app(config_class=Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)
    db.init_app(app)
    migrate.init_app(app, db)
    # Initialize Flask extensions here
    # celery_init_app(app)
    celery.conf.update(app.config)

    @app.shell_context_processor
    def ctx():
        return {"app": app, "db": db}
    # Register blueprints here
    celery.register_task(GetPersonInfo())
    celery.conf.update(app.config)
    app.register_blueprint(my_blueprint)
    app.register_blueprint(cli_commands)

    return app
