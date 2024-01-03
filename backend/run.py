from app import create_app
from models import db
app = create_app()


@app.cli.command()
def createdb():
    db.create_all()


@app.cli.command()
def dropdb():
    db.session.remove()
    db.drop_all()
