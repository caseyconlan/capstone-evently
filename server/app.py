from flask import Flask, jsonify, request
from models import db, Event, BudgetItem, ProjectItem, Guest, Vendor
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
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
    # Implement logic to fetch a specific event by its ID from the database
    event = Event.query.get(event_id)
    if event:
        return jsonify(event=event.to_dict())
    else:
        return jsonify(message='Event not found')

@app.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.get_json()
    # Implement logic to update a specific event by its ID with the provided data
    # Example: event = Event.query.get(event_id)
    # if event:
    #     event.type = data['type']
    #     event.date = data['date']
    #     event.budget_amount = data['budget_amount']
    #     db.session.commit()
    return jsonify(message='Event updated successfully')

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    # Implement logic to delete a specific event by its ID from the database
    # Example: event = Event.query.get(event_id)
    # if event:
    #     db.session.delete(event)
    #     db.session.commit()
    return jsonify(message='Event deleted successfully')

@app.route('/api/events/<int:event_id>/vendors', methods=['POST'])
def add_vendor(event_id):
    data = request.get_json()
    vendor = Vendor(
        name=data['name'],
        product_service=data['product_service'],
        category=data['category'],
        contact_person=data['contact_person'],
        phone=data['phone'],
        email=data['email'],
        address=data['address']
    )
    event = Event.query.get(event_id)
    if event:
        event.vendors.append(vendor)
        db.session.add(vendor)
        db.session.commit()
        return jsonify(vendor=vendor.to_dict()), 201
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

if __name__ == '__main__':
    app.run(port=5555, debug=True)
