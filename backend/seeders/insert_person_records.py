from models import db, Person
from faker import Faker


class InsertFakeData:
    def __init__(self):
        self.faker = Faker('en_US')
    def create10Persons(self):
        for _ in range(10):
            PersonRecord = Person(first_name=self.faker.first_name(), middle_name=self.faker.first_name(), last_name=self.faker.last_name(),
                    egn = self.faker.ssn().replace('-',''), eik = self.faker.passport_number().replace('-',''), fpn=self.faker.ssn().replace('-',''))
            db.session.add(PersonRecord)
        try:
            db.session.commit()
            return True
        except Exception as e:
            print(e)
            return e


