from models import db, Person, PersonProperty
from faker import Faker
from random import randrange


class InsertFakeData:
    def __init__(self):
        self.faker = Faker('en_US')

    def createPersons(self, number):
        for _ in range(number):
            PersonRecord = Person(first_name=self.faker.first_name(), middle_name=self.faker.first_name(), last_name=self.faker.last_name(),
                                  egn=self.faker.ssn().replace('-', ''), eik=self.faker.passport_number().replace('-', ''), fpn=self.faker.ssn().replace('-', ''))
            db.session.add(PersonRecord)
        try:
            db.session.commit()
            return True
        except Exception as e:
            print(e)
            return e

    def createPersonProperty(self, number):
        for _ in range(number):
            PersonPropertyRecord = PersonProperty(title=self.faker.word(),
                                                  type=randrange(0, 1),
                                                  # Get random person id
                                                  description=self.faker.paragraph(
                                                      10),
                                                  person_id=randrange(64, 67)
                                                  )
            db.session.add(PersonPropertyRecord)
        try:
            db.session.commit()
            return True
        except Exception as e:
            print(e)
            return e
