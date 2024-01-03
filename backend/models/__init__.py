from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from sqlalchemy.orm.attributes import QueryableAttribute
from sqlalchemy.dialects.postgresql import JSON, JSONB
from sqlalchemy import orm
from datetime import datetime


db = SQLAlchemy()


class BaseModel(db.Model):
    __abstract__ = True

    def __repr__(self):
        return "<{}({})>".format(
            self.__class__.__name__,
            ', '.join(
                ["{}={}".format(k, repr(self.__dict__[k]))
                    for k in sorted(self.__dict__.keys())
                    if k[0] != '_']
            )
        )

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def to_dict(self, show=None, _hide=None, _path=None):
        """Return a dictionary representation of this model."""

        show = show or []
        _hide = _hide or []

        hidden = self._hidden_fields if hasattr(self, "_hidden_fields") else []
        default = self._default_fields if hasattr(
            self, "_default_fields") else []
        default.extend(['id', 'modified_at', 'created_at'])

        if not _path:
            _path = self.__tablename__.lower()

            def prepend_path(item):
                item = item.lower()
                if item.split(".", 1)[0] == _path:
                    return item
                if len(item) == 0:
                    return item
                if item[0] != ".":
                    item = ".%s" % item
                item = "%s%s" % (_path, item)
                return item

            _hide[:] = [prepend_path(x) for x in _hide]
            show[:] = [prepend_path(x) for x in show]

        columns = self.__table__.columns.keys()
        relationships = self.__mapper__.relationships.keys()
        properties = dir(self)

        ret_data = {}

        for key in columns:
            if key.startswith("_"):
                continue
            check = "%s.%s" % (_path, key)
            if check in _hide or key in hidden:
                continue
            if check in show or key in default:
                ret_data[key] = getattr(self, key)

        for key in relationships:
            if key.startswith("_"):
                continue
            check = "%s.%s" % (_path, key)
            if check in _hide or key in hidden:
                continue
            if check in show or key in default:
                _hide.append(check)
                is_list = self.__mapper__.relationships[key].uselist
                if is_list:
                    items = getattr(self, key)
                    if self.__mapper__.relationships[key].query_class is not None:
                        if hasattr(items, "all"):
                            items = items.all()
                    ret_data[key] = []
                    for item in items:
                        ret_data[key].append(
                            item.to_dict(
                                show=list(show),
                                _hide=list(_hide),
                                _path=("%s.%s" % (_path, key.lower())),
                            )
                        )
                else:
                    if (
                        self.__mapper__.relationships[key].query_class is not None
                        or self.__mapper__.relationships[key].instrument_class
                        is not None
                    ):
                        item = getattr(self, key)
                        if item is not None:
                            ret_data[key] = item.to_dict(
                                show=list(show),
                                _hide=list(_hide),
                                _path=("%s.%s" % (_path, key.lower())),
                            )
                        else:
                            ret_data[key] = None
                    else:
                        ret_data[key] = getattr(self, key)

        for key in list(set(properties) - set(columns) - set(relationships)):
            if key.startswith("_"):
                continue
            if not hasattr(self.__class__, key):
                continue
            attr = getattr(self.__class__, key)
            if not (isinstance(attr, property) or isinstance(attr, QueryableAttribute)):
                continue
            check = "%s.%s" % (_path, key)
            if check in _hide or key in hidden:
                continue
            if check in show or key in default:
                val = getattr(self, key)
                if hasattr(val, "to_dict"):
                    ret_data[key] = val.to_dict(
                        show=list(show),
                        _hide=list(_hide),
                        _path=('%s.%s' % (_path, key.lower())),
                    )
                else:
                    try:
                        ret_data[key] = json.loads(json.dumps(val))
                    except:
                        pass

        return ret_data


class ExecutiveCase(BaseModel):
    __tablename__ = 'executive_case'
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer, index=True)
    executive_act = db.relationship('', backref='executive_act',
                             lazy='dynamic', cascade="all, delete-orphan")
    enter_document = db.relationship('', backref='enter_document',
                                lazy='dynamic', cascade="all, delete-orphan")
    exit_document = db.relationship('', backref='exit_document',
                                lazy='dynamic', cascade="all, delete-orphan")
    def __repr__(self):
        return '<ExecutiveCase {}>'.format(self.number)

class ExecutiveAct(BaseModel):
    __tablename__ = 'executive_act'
    id = db.Column(db.Integer, primary_key=True)
    exec_act_person = db.Column(db.Integer, db.ForeignKey('executive_act_person.id') # Person
    monetary_claim_id = db.Column(db.Integer, db.ForeignKey('monetary_claims.id')) # MonetaryClaims
    exec_case_id = db.Column(db.Integer, db.ForeignKey('executive_case.id') # ExecutiveCase
    exec_act_person = db.relationship('',backref="executive_act_person", lazy="dynamic", cascade="all, delete-orphan");


class ExecutiveActPerson(BaseModel):
    __tablename__ = 'executive_act_person'
    def __init__(self):
        pass
    person_id = db.Column(db.Integer, db.ForeignKey('person.id'))
    exec_act_id = db.Column(db.Integer, db.ForeignKey('executive_act.id'));
    act_as = db.Column(db.Integer, default=0);

    created_at = db.Column(db.DateTime, default=datetime.now)

    _default_fields = [
    ]


class Person(BaseModel):
    def __init__(self):
        pass
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), index=True, default=None, nullable=True)
    middle_name = db.Column(db.String(50), index=True, default=None, nullable=True)
    last_name = db.Column(db.String(50), index=True, default=None, nullable=True)
    egn = db.Column(db.Integer(10), index=True, default=None, nullable=True)
    eik = db.Column(db.String(13), index=True, default=None, nullable=True)
    fpn = db.Column(db.Integer(10), index=True, default=None)
    executive_act_person = db.relationship('', backref='executive_act_person', lazy='dynamic', cascade="all, delete-orphan")
    _default_fields = [
        "error",
        "stacktrace",
    ]

class MonetaryClaims(BaseModel):
    __tablename__ = 'monetary_claims'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, unique=True)
    descr = db.Column(db.String(64), index=True )
    ammount = db.Column(db.String(15), index=True)
    executive_act_monetary_claims = db.relationship('', backref='executive_act_monetary_claims',
                lazy='dynamic', cascade="all, delete-orphan")
    created_at = db.Column(db.DateTime, default=datetime.now)

class ExecutiveActMonetaryClaims(BaseModel):
    __tablename__='executive_act_monetary_claims'
    id = db.Column(db.Integer, primary_key=True)
    exec_act_id = db.Column(db.Integer, db.ForeignKey('executive_act.id')
    monetary_claim_id = db.Column(db.Integer, db.ForeignKey('monetary_claims.id')
    commits = db.relationship('Commits', backref='commits', lazy='dynamic')
    created_at = db.Column(db.DateTime, default=datetime.now)


class EnterDocument(BaseModel):
    __tablename__ = 'enter_document'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64), index=True, nullable=True)
    exec_case_id = db.Column(db.Integer, db.ForeignKey('executive_case.id'))

class EnterDocumentType(BaseModel):
    __tablename__ = 'enter_document_type'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(64), index=True)
    template_id = db.Column(db.Integer, db.ForeignKey('enter_document_template.id')

class EnterDocumentTemplate(BaseModel):
    __tablename__ = 'enter_document_template'
    id = db.Column(db.Integer, primary_key=True)
    path = db.Column(db.String, index=True)
    enter_doc_template = db.relationship('', backref='enter_document', lazy='dynamic', cascade="all, delete-orphan")

class ExitDocument(BaseModel):
    __tablename__ = 'exit_document'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64), index=True, nullable=True)
    exec_case_id = db.Column(db.Integer, db.ForeignKey('executive_case.id'))

class ExitDocumentType(BaseModel):
    __tablename__ = 'exit_document_type'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(64), index=True)
    template_id = db.Column(db.Integer, db.ForeignKey('exit_document_template.id')

class ExitDocumentTemplate(BaseModel):
    __tablename__ = 'exit_document_template'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True)
    path = db.Column(db.String, index=True)
    exit_doc_template = db.relationship('', backref='exit_document', lazy='dynamic', cascade="all, delete-orphan")
