from flask import Flask, jsonify, request
from models import db, Event, BudgetItem, ProjectItem, Guest, Vendor, ArchivedEvent, Directory, BookkeepingEntry
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, jsonify, request, make_response
from flask_migrate import Migrate
from datetime import datetime
from flask_cors import CORS
import traceback
from datetime import datetime

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

# User model
class User(db.Model):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True}

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

# Login route
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        return jsonify(message='Login successful'), 200
    else:
        return jsonify(message='Invalid username or password'), 401

# New user route
@app.route('/owners', methods=['POST'])
def create_new_user():
    first_name = request.json.get('first_name')
    last_name = request.json.get('last_name')
    email = request.json.get('email')
    username = request.json.get('username')
    password = request.json.get('password')

    user = User.query.filter_by(username=username).first()

    if user:
        return jsonify(message='Username already exists'), 400

    new_user = User(first_name=first_name, last_name=last_name, email=email, username=username)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify(message='New user created'), 201

# Update password route
@app.route('/update-password', methods=['PATCH'])
def update_password():
    username = request.json.get('username')
    new_password = request.json.get('new_password')

    user = User.query.filter_by(username=username).first()

    if user:
        user.set_password(new_password)
        db.session.commit()
        return jsonify(message='Password updated'), 200
    else:
        return jsonify(message='Username not found'), 404

@app.route('/delete-account', methods=['DELETE'])
def delete_account():
    username = request.json.get('username')
    password = request.json.get('password')

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        db.session.delete(user)
        db.session.commit()
        return jsonify(message='Account deleted successfully'), 200
    else:
        return jsonify(message='Invalid username or password'), 401

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
        archived_event = ArchivedEvent(
            name=event.name,
            type=event.type,
            date=event.date,
            budget_amount=event.budget_amount,
            target_budget=event.target_budget,
            date_archived=datetime.now()
        )
        db.session.add(archived_event)

        # Disassociate guests from the event
        guests = event.guests
        for guest in guests:
            guest.event_id = None

        # Clear vendors, budget items, and project items relationships
        event.vendors.clear()
        event.budget_items.clear()
        event.project_items.clear()

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
    event = Event.query.get(event_id)
    if event:
        event.target_budget = target_budget
        db.session.commit()
        # Return a response indicating success
        return jsonify(message='Target budget updated successfully'), 200
    else:
        return jsonify(message='Event not found'), 404

@app.route('/api/events/<int:event_id>/date', methods=['PUT'])
def update_event_date(event_id):
    event = Event.query.get(event_id)
    if event is None:
        return jsonify(message='Event not found'), 404

    new_date_str = request.json.get('date')
    if new_date_str is None:
        return jsonify(message='Date is required'), 400

    # Convert the date string to a datetime object
    new_date = datetime.strptime(new_date_str, '%Y-%m-%d').date()

    event.date = new_date
    db.session.commit()

    return jsonify(event=event.to_dict())

@app.route('/api/events/<int:event_id>/date', methods=['GET'])
def get_event_date(event_id):
    event = Event.query.get(event_id)
    if event:
        date = event.date.date() if event.date else None
        return jsonify(date=date), 200
    else:
        return jsonify(message='Event not found'), 404

@app.route('/api/events/<int:event_id>/date', methods=['PUT'])
def update_event_date_endpoint(event_id):
    event = Event.query.get(event_id)
    if event is None:
        return jsonify(message='Event not found'), 404

    new_date = request.json.get('date')
    if new_date is None:
        return jsonify(message='Date is required'), 400

    new_datetime = datetime.strptime(new_date, '%Y-%m-%d')

    event.date = new_datetime
    db.session.commit()

    return jsonify(event=event.to_dict())

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

@app.route('/api/events/<int:event_id>/guests/<int:guest_id>', methods=['PUT'])
def update_guest(event_id, guest_id):
    data = request.get_json()
    
    # Check if the RSVP is present in the request data
    if 'rsvp' not in data:
        return jsonify({"msg": "Missing RSVP status"}), 400
    
    # Retrieve the guest from the event's guest list
    event = Event.query.get(event_id)
    if event:
        guest = Guest.query.get(guest_id)
        if guest in event.guests:
            # Update the RSVP status and commit the changes
            guest.rsvp = int(data['rsvp']) if data['rsvp'] is not None else None
            db.session.commit()
            return jsonify(guest=guest.to_dict()), 200
        else:
            return jsonify(message='Guest not found'), 404
    else:
        return jsonify(message='Event not found'), 404

@app.route('/api/events/archived', methods=['GET'])
def get_archived_events():
    try:
        # Query the archived events and sort them by the date they were archived
        archived_events = ArchivedEvent.query.order_by(ArchivedEvent.date_archived.desc()).all()
        # Convert each archived event to a dictionary
        archived_event_list = [event.to_dict() for event in archived_events]
        # Return the list of dictionaries as a JSON response with the key 'events'
        return jsonify(events=archived_event_list), 200
    except Exception as e:
        # If an error occurs, log the error and return a 500 error code with a descriptive message
        print(f"Error retrieving archived events: {e}")
        return jsonify(message="There was an error retrieving the archived events"), 500

@app.route('/api/events/archived/<int:id>', methods=['GET'])
def get_single_archived_event(id):
    try:
        event = ArchivedEvent.query.get(id)
        if event is None:
            return jsonify(message="Event not found"), 404

        return jsonify(event=event.to_dict()), 200
    except Exception as e:
        print(f"Error retrieving archived event: {e}")
        return jsonify(message="There was an error retrieving the archived event"), 500

@app.route('/api/events/archived/<int:event_id>/vendors', methods=['GET'])
def get_archived_event_vendors(event_id):
    try:
        archived_event = ArchivedEvent.query.get(event_id)
        if archived_event is None:
            return jsonify(message="Archived event not found"), 404

        vendors = archived_event.vendors
        vendor_list = [vendor.to_dict() for vendor in vendors]
        return jsonify(vendors=vendor_list), 200
    except Exception as e:
        print(f"Error retrieving archived event vendors: {e}")
        return jsonify(message="There was an error retrieving the archived event vendors"), 500

@app.route('/api/events/archived/<int:event_id>/guests', methods=['GET'])
def get_archived_event_guests(event_id):
    try:
        archived_event = ArchivedEvent.query.get(event_id)
        if archived_event is None:
            return jsonify(message="Archived event not found"), 404

        guests = archived_event.guests
        guest_list = [guest.to_dict() for guest in guests]
        return jsonify(guests=guest_list), 200
    except Exception as e:
        print(f"Error retrieving archived event guests: {e}")
        return jsonify(message="There was an error retrieving the archived event guests"), 500

@app.route('/directory', methods=['POST'])
def create_entry():
    data = request.json
    new_entry = Directory(
        type=data['type'],
        name=data['name'],
        phone=data['phone'],
        email=data['email'],
        address=data['address'],
        notes=data['notes']
    )
    db.session.add(new_entry)
    db.session.commit()
    return jsonify(message='Entry created successfully')

@app.route('/directory', methods=['GET'])
def get_entries():
    entries = Directory.query.all()
    result = [
        {
            'type': entry.type,
            'name': entry.name,
            'phone': entry.phone,
            'email': entry.email,
            'address': entry.address,
            'notes': entry.notes
        }
        for entry in entries
    ]
    return jsonify(result)

@app.route('/bookkeeping', methods=['POST'])
def create_bookkeeping_entry():
    try:
        entry_data = request.json
        entry = BookkeepingEntry(
            type=entry_data['type'],
            category=entry_data['category'],
            amount=entry_data['amount'],
            month=entry_data['month'],
            date=datetime.strptime(entry_data['date'], "%Y-%m-%dT%H:%M:%S.%fZ") # parsing the date string to datetime object
        )
        db.session.add(entry)
        db.session.commit()
        return jsonify(entry.to_dict()), 201
    except Exception as e:
        print(traceback.format_exc())  # This will print the full traceback
        return jsonify(error=str(e)), 500

# Route to get all bookkeeping entries
@app.route('/bookkeeping', methods=['GET'])
def get_bookkeeping_entries():
    entries = BookkeepingEntry.query.all()
    return jsonify([entry.to_dict() for entry in entries])

if __name__ == '__main__':
    app.run(port=5555, debug=True)