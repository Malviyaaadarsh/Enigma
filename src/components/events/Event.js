import React from 'react';
import Countdown from '../Countdown/Countdown';
import './Event.css';

const events = [
  {
    title: '🤖 AI Model Sprint',
    date: '2024-12-05T00:00:00',
    description: 'Build and train machine learning models in a 5-hour sprint. Showcase your AI skills!',
    link: 'https://forms.gle/XGm33VqJthW12XSm8',
  },
  {
    title: '🧠 Neural Hackathon 2.0',
    date: '2025-01-10T00:00:00',
    description: 'Team up and develop innovative AI/ML projects in 24 hours.',
     link: 'https://forms.gle/XGm33VqJthW12XSm8',
  },
  {
    title: '📊 AI/ML Bootcamp',
    date: '2025-02-15T00:00:00',
    description: 'Learn advanced ML techniques, data preprocessing, and model optimization.',
     link: 'https://forms.gle/XGm33VqJthW12XSm8',
  },
  {
    title: '🤖 Deep Learning Challenge',
    date: '2025-03-20T00:00:00',
    description: 'Train deep neural networks on real-world datasets and compete for top accuracy.',
     link: 'https://forms.gle/XGm33VqJthW12XSm8',
  },
  {
    title: '🧠 NLP Workshop',
    date: '2025-04-10T00:00:00',
    description: 'Hands-on workshop to implement NLP models with Hugging Face and PyTorch.',
    link: 'https://your-link.com/nlp-workshop',
  },
  {
    title: '📊 Computer Vision Sprint',
    date: '2025-05-05T00:00:00',
    description: 'Build image recognition models and explore cutting-edge computer vision techniques.',
    link: 'https://your-link.com/computer-vision-sprint',
  },
];

const Events = () => {
  const handleRegister = (link) => {
    window.open(link, '_blank'); // Opens the registration link in a new tab
  };

  return (
    <div className="events-container">
      <h1 className="events-heading">Upcoming AI/ML Events</h1>
      <div className="events-grid">
        {events.map((event, index) => (
          <div className="event-card" key={index}>
            <div className="event-card-content">
              <h2>{event.title}</h2>
              <p className="event-date">🗓 {new Date(event.date).toDateString()}</p>
              <p>{event.description}</p>
              <Countdown eventDate={event.date} label="Time left to train models" />
              <button
                className="register-btn"
                onClick={() => handleRegister(event.link)}
              >
                Register Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
