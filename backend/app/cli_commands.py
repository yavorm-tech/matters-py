import click
from seeders.insert_person_records import InsertFakeData
from flask import Blueprint, current_app, request, jsonify
cli_commands = Blueprint('cli_commands', __name__)

@cli_commands.cli.command("seed_persons")
@click.argument("number")
def seedPersons(number):
    print(number)
    faker = InsertFakeData()
    persons = faker.createPersons(int(number))
    return jsonify({"result": persons})
