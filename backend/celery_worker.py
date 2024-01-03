import os 
from flask import current_app
from app import celery, create_app
from config import Config
import pdb
app = create_app()
app.config.from_object(Config)
app.app_context().push()
