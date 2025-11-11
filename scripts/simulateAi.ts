import { writeFileSync } from 'fs';

const sampleAssignment = {
  title: 'Sample Reading Comprehension',
  standardCode: 'ELA.5.R.1',
  items: [
    {
      type: 'mcq',
      stem: 'What is the main idea of the passage?',
      options: ['Friendship', 'Courage', 'Honesty', 'Perseverance'],
      answerIndex: 3
    },
    {
      type: 'short',
      stem: 'Explain how the character changed from the beginning to the end of the story.'
    }
  ],
  gradeLevel: '5',
  createdAt: new Date().toISOString()
};

writeFileSync('simulated-assignment.json', JSON.stringify(sampleAssignment, null, 2));
console.log('Generated simulated-assignment.json');
