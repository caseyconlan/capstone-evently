import React from 'react';
import ToDoForm from './ToDoForm';

const todoList = [
  'Determine date and time',
  'Evaluate goals and expected outcomes',
  'Determine rules and regulations for event in accordance with the appropriate city and state rules and regulations',
  'Collect appropriate permits',
  'Anticipate attendance; does the space have room for activities and participants?',
  'Create Guestlist',
  'Secure site',
  'Check for potential conflicts with other events',
  'Confirm date with key participants',
  'Set rain date if applicable',
  'Anticipate alternate location, set-up, and transportation',
  'Put everything in writing: contracts, booth agreements, supplier agreements, etc',
  'Collect RSVPs',
];

const ProjectPlan = () => {
  return (
    <div>
      <h1>Project Plan</h1>
      <ToDoForm todoItems={todoList} />
    </div>
  );
};

export default ProjectPlan;
