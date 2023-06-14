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

if __name__ == '__main__':
    app.run(port=4000, debug=True)
