from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm, CSRFProtect
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

db = SQLAlchemy()

# User model
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    email = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(100), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
# Event model
class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(100), nullable=True)
    date = db.Column(db.DateTime, nullable=True)
    budget_amount = db.Column(db.Float, default=0.0)
    target_budget = db.Column(db.Float, default=0.0) 
    archived = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'date': self.date.strftime('%Y-%m-%d %H:%M:%S') if self.date else None,
            'budget_amount': self.budget_amount,
            'target_budget': self.target_budget,
            'archived': self.archived
        }

    # Establish the many-to-many relationship with vendors
    vendors = db.relationship('Vendor', secondary='event_vendor', backref='events')

    # Establish the one-to-many relationship with budget items
    budget_items = db.relationship('BudgetItem', backref='event', lazy=True)

    # Establish the one-to-many relationship with project items
    project_items = db.relationship('ProjectItem', backref='event', lazy=True)

    guests = db.relationship('Guest', backref='event', lazy=True)

    def get_guests(self):
        # Fetch the guests associated with the event
        return Guest.query.filter_by(event_id=self.id).all()

    def archive(self):
        # Archive the event and associated guests
        self.archived = True
        guests = self.get_guests()
        for guest in guests:
            guest.archived = True

# BudgetItem model
class BudgetItem(db.Model):
    __tablename__ = 'budget_items'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    cost = db.Column(db.Float, nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)

# ProjectItem model
class ProjectItem(db.Model):
    __tablename__ = 'project_items'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    status = db.Column(db.String(50), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)  # Add foreign key

class Guest(db.Model):
    __tablename__ = 'guests'

    id = db.Column(db.Integer, primary_key=True)
    guest_title = db.Column(db.String(50), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    zip = db.Column(db.String(20), nullable=False)
    rsvp = db.Column(db.Boolean, default=False)

    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('guests.id'))
    children = db.relationship('Guest', backref=db.backref('parent', remote_side=[id]))

    def to_dict(self):
        return {
            'id': self.id,
            'guest_title': self.guest_title,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'zip': self.zip,
            'rsvp': self.rsvp,
            'event_id': self.event_id
        }


class Vendor(db.Model):
    __tablename__ = 'vendors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    product_service = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    contact_person = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'product_service': self.product_service,
            'category': self.category,
            'contact_person': self.contact_person,
            'phone': self.phone,
            'email': self.email,
            'address': self.address
        }

class ArchivedEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    date_archived = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'date_archived': self.date_archived.strftime('%Y-%m-%d %H:%M:%S')
        }

class Directory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50))
    name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100))
    address = db.Column(db.String(200))
    notes = db.Column(db.Text)

# Association table for the many-to-many relationship between events and vendors
event_vendor = db.Table(
    'event_vendor',
    db.Column('event_id', db.Integer, db.ForeignKey('events.id'), primary_key=True),
    db.Column('vendor_id', db.Integer, db.ForeignKey('vendors.id'), primary_key=True)
)