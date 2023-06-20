from flask import Flask, jsonify, request
from models import db, Event, BudgetItem, ProjectItem, Guest, Vendor, ArchivedEvent
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
migrate = Migrate(app, db)

# Configure your Flask app and database connection here
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///event_planner.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Create database tables
with app.app_context():
    db.create_all()

# Routes

# Home route
@app.route('/')
def home():
    return jsonify(message='Welcome to the Event Planner App')

# Event routes
@app.route('/api/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    event_list = [event.to_dict() for event in events]
    return jsonify(events=event_list)

# app.py
@app.route('/api/events', methods=['POST'])
def create_event():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    data = request.get_json()
    
    if 'name' not in data:
        return jsonify({"msg": "Missing event name in request"}), 400

    event = Event(name=data['name'], type=data.get('type'))  # set the type if it's included in the data
    db.session.add(event)
    db.session.commit()

    return event.to_dict(), 201

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = Event.query.get(event_id)
    if event:
        return jsonify(event=event.to_dict())
    else:
        return jsonify(message='Event not found'), 404


@app.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    event = Event.query.get(event_id)
    if event is None:
        return jsonify(message='Event not found'), 404

    new_name = request.json.get('name')
    if new_name is None:
        return jsonify(message='Name is required'), 400

    event.name = new_name
    db.session.commit()

    return jsonify(event=event.to_dict())

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    event = Event.query.get(event_id)
    if event:
        # Move event to archived events table
        archived_event = ArchivedEvent(name=event.name, date_archived=datetime.now())
        db.session.add(archived_event)

        # Delete associated vendors
        for vendor in event.vendors:
            db.session.delete(vendor)

        # Delete event
        db.session.delete(event)
        db.session.commit()
        return jsonify(message='Event archived')
    else:
        return jsonify(message='Event not found'), 404

@app.route('/api/events/<int:event_id>/vendors', methods=['POST'])
def add_vendor(event_id):
    data = request.get_json()
    event = Event.query.get(event_id)
    if event:
        vendor = Vendor(
            name=data['name'],
            product_service=data['product_service'],
            category=data['category'],
            contact_person=data['contact_person'],
            phone=data['phone'],
            email=data['email'],
            address=data['address']
        )
        event.vendors.append(vendor)  # Associate the vendor with the event
        db.session.add(vendor)
        db.session.commit()
        return jsonify(vendor=vendor.to_dict()), 201
    else:
        return jsonify(message='Event not found'), 404
    
@app.route('/api/vendors/<int:vendor_id>', methods=['DELETE'])
def delete_vendor(vendor_id):
    vendor = Vendor.query.get(vendor_id)
    if vendor:
        db.session.delete(vendor)
        db.session.commit()
        return jsonify(message='Vendor deleted'), 200
    else:
        return jsonify(message='Vendor not found'), 404

@app.route('/api/events/<int:event_id>/vendors', methods=['GET'])
def get_event_vendors(event_id):
    event = Event.query.get(event_id)
    if event:
        vendors = event.vendors
        vendor_list = [vendor.to_dict() for vendor in vendors]
        return jsonify(vendors=vendor_list)
    else:
        return jsonify(message='Event not found'), 404

@app.route('/api/events/<int:event_id>/budget', methods=['PUT'])
def update_target_budget(event_id):
    # Retrieve the target budget from the request body
    target_budget = request.json.get('target_budget')

    # Update the target budget for the event with the given ID
    # (code to update the target budget in the database)

    # Return a response indicating success
    return jsonify(message='Target budget updated successfully')

# app.py
@app.route('/api/events/<int:event_id>/date', methods=['PUT'])
def update_event_date(event_id):
    event = Event.query.get(event_id)
    if event is None:
        return jsonify(message='Event not found'), 404

    new_date = request.json.get('date')
    if new_date is None:
        return jsonify(message='Date is required'), 400

    event.date = new_date
    db.session.commit()

    return jsonify(event=event.to_dict())

@app.route('/api/events/<int:event_id>/date', methods=['GET'])
def get_event_date(event_id):
    event = Event.query.get(event_id)
    if event is None:
        return jsonify(message='Event not found'), 404

    return jsonify(date=event.date)


@app.route('/api/events/<int:event_id>/budget', methods=['GET'])
def get_budget(event_id):
    # Retrieve the budget for the event with the given ID from the database
    event = Event.query.get(event_id)
    if event:
        budget = event.budget_amount
        return jsonify(budget=budget)
    else:
        return jsonify(message='Event not found'), 404

@app.route('/api/events/<int:event_id>/budget', methods=['POST'])
def handle_save_target_budget(event_id):
    target_budget = request.json.get('target_budget')

    event = Event.query.get(event_id)
    if event:
        event.target_budget = target_budget  # Set the target_budget attribute
        db.session.commit()
        return jsonify(message='Target budget updated successfully')
    else:
        return jsonify(message='Event not found'), 404


def calculate_actual_budget(event):
    costs = BudgetItem.query.filter_by(event_id=event.id).all()
    total_cost = sum(cost.amount for cost in costs)
    return total_cost

def calculate_actual_budget(event):
    costs = event.budget_items
    total_cost = sum(cost.amount for cost in costs)
    return total_cost

@app.route('/api/events/<int:event_id>/budget/actual', methods=['GET'])
def get_actual_budget(event_id):
    # Retrieve the actual budget for the event with the given ID from the database
    event = Event.query.get(event_id)
    if event:
        actual_budget = calculate_actual_budget(event)  # Calculate the actual budget based on the event's costs
        return jsonify(budget=actual_budget)
    else:
        return jsonify(message='Event not found'), 404

@app.route('/api/events/<int:event_id>/budget/target', methods=['GET'])
def get_target_budget(event_id):
    # Retrieve the target budget for the event with the given ID from the database
    event = Event.query.get(event_id)
    if event:
        target_budget = event.target_budget
        return jsonify(target_budget=target_budget)
    else:
        return jsonify(message='Event not found'), 404

@app.route('/api/events/<int:event_id>/guests', methods=['GET'])
def get_guests(event_id):
    event = Event.query.get(event_id)
    if event:
        guests = event.guests
        guest_list = [guest.to_dict() for guest in guests]
        return jsonify(guests=guest_list)
    else:
        return jsonify(message='Event not found'), 404

@app.route('/api/events/<int:event_id>/guests', methods=['POST'])
def add_guest(event_id):
    data = request.get_json()
    
    # Check if the required fields are present in the request data
    if 'guestTitle' not in data or 'firstName' not in data or 'lastName' not in data or 'address' not in data or 'city' not in data or 'state' not in data or 'zip' not in data:
        return jsonify({"msg": "Missing required guest information"}), 400
    
    # Set default value for rsvp if it's an empty string
    rsvp = data.get('rsvp', False)
    if rsvp == '':
        rsvp = False
    
    # Create a new guest object with the provided data
    guest = Guest(
        guest_title=data['guestTitle'],
        first_name=data['firstName'],
        last_name=data['lastName'],
        address=data['address'],
        city=data['city'],
        state=data['state'],
        zip=data['zip'],
        rsvp=rsvp
    )
    
    # Add the guest to the event's guest list
    event = Event.query.get(event_id)
    if event:
        event.guests.append(guest)
        db.session.add(guest)
        db.session.commit()
        return jsonify(guest=guest.to_dict()), 201
    else:
        return jsonify(message='Event not found'), 404

@app.route('/api/events/archived', methods=['GET'])
def get_archived_events():
    archived_events = ArchivedEvent.query.all()
    archived_event_list = [event.to_dict() for event in archived_events]
    return jsonify(events=archived_event_list)


if __name__ == '__main__':
    app.run(port=5555, debug=True)