from sqlalchemy_serializer import SerializerMixin
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Event model
class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # changed fieldName and removed primary_key
    type = db.Column(db.String(100), nullable=True)  # changed fieldName and removed primary_key
    budget_amount = db.Column(db.Float, default=0.0)

    # Establish the many-to-many relationship with vendors
    vendors = db.relationship('Vendor', secondary='event_vendor', backref='events')

# BudgetItem model
class BudgetItem(db.Model):
    __tablename__ = 'budget_items'
    
    id = db.Column(db.Integer, primary_key=True)
    # Add budget item attributes

# ProjectItem model
class ProjectItem(db.Model):
    __tablename__ = 'project_items'
    
    id = db.Column(db.Integer, primary_key=True)
    # Add project item attributes

# Guest model
class Guest(db.Model):
    __tablename__ = 'guests'
    
    id = db.Column(db.Integer, primary_key=True)
    # Add guest attributes


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

# Association table for the many-to-many relationship between events and vendors
event_vendor = db.Table(
    'event_vendor',
    db.Column('event_id', db.Integer, db.ForeignKey('events.id'), primary_key=True),
    db.Column('vendor_id', db.Integer, db.ForeignKey('vendors.id'), primary_key=True)
)
