import React, { useState } from 'react';
import './Resource.css';

const resources = [
  {
    title: 'TensorFlow',
    description: 'An open-source platform for machine learning to build and deploy ML-powered applications.',
    link: 'https://www.tensorflow.org/',
    type: 'Framework',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg',
  },
  {
    title: 'PyTorch',
    description: 'A deep learning framework providing flexibility and speed for AI research and production.',
    link: 'https://pytorch.org/',
    type: 'Framework',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/1/10/PyTorch_logo_icon.svg',
  },
    {
    title: 'DeepML',
    description: 'Practice Machine Learning and Data Science problems',
    link: 'https://www.deep-ml.com/',
    type: 'Platform',
    icon: 'https://www.deep-ml.com/_next/image?url=%2Fdeepml-logo.jpeg&w=64&q=75',
  },
  {
    title: 'Kaggle',
    description: 'The largest community of data scientists and ML practitioners. Join competitions, explore datasets, and learn.',
    link: 'https://www.kaggle.com/',
    type: 'Platform',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Kaggle_logo.png',
  },
  {
    title: 'Hugging Face',
    description: 'A hub for state-of-the-art natural language processing models, datasets, and tools.',
    link: 'https://huggingface.co/',
    type: 'Library',
    icon: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
  },
  {
    title: 'Google AI Blog',
    description: 'Official blog by Google AI with research, tutorials, and the latest advancements in AI/ML.',
    link: 'https://ai.googleblog.com/',
    type: 'Blog',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  },
  {
    title: 'Fast.ai',
    description: 'A research group that makes deep learning more accessible with courses and libraries.',
    link: 'https://www.fast.ai/',
    type: 'Tutorial',
    icon: 'https://avatars.githubusercontent.com/u/20547620?s=200&v=4',
  },
  {
    title: 'OpenAI',
    description: 'AI research lab creating advanced AI models and tools like ChatGPT and DALL·E.',
    link: 'https://openai.com/',
    type: 'Platform',
    icon: 'https://latestlogo.com/wp-content/uploads/2024/01/openai-icon.png',
  },
  {
    title: 'Scikit-learn',
    description: 'A Python library for classical machine learning algorithms, easy to use and robust.',
    link: 'https://scikit-learn.org/',
    type: 'Library',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg',
  },
  {
    title: 'Medium AI',
    description: 'A collection of articles and tutorials on AI, ML, and deep learning.',
    link: 'https://medium.com/tag/artificial-intelligence',
    type: 'Blog',
    icon: 'https://miro.medium.com/fit/c/176/176/1*sHhtYhaCe2Uc3IU0IgKwIQ.png',
  },
  {
    title: 'DataCamp',
    description: 'An online platform to learn data science, Python, R, and machine learning interactively.',
    link: 'https://www.datacamp.com/',
    type: 'Platform',
    icon: 'https://asset.brandfetch.io/idou89mSUh/id1KupYxXq.jpeg?updated=1680282023371',
  },
  {
    title: 'Keras',
    description: 'High-level neural networks API, written in Python and capable of running on TensorFlow, CNTK, or Theano.',
    link: 'https://keras.io/',
    type: 'Framework',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Keras_logo.svg',
  },
  {
    title: 'DeepLearning.ai',
    description: 'Provides AI education, courses, and specialization programs created by Andrew Ng.',
    link: 'https://www.deeplearning.ai/',
    type: 'Tutorial',
    icon: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/b4/5cb90bb92f420b99bf323a0356f451/Icon.png?auto=format%2Ccompress&dpr=3&w=180&h=180',
  },
];

const typeColors = {
  Framework: '#FF6F61',
  Platform: '#6C63FF',
  Library: '#00C49A',
  Blog: '#FFA500',
  Tutorial: '#FF69B4',
};

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="resources-container">
      <h1 className="resources-heading">🚀 AI/ML Resources</h1>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="resources-grid">
        {filteredResources.map((resource, index) => (
          <div className="resource-card" key={index}>
            <img src={resource.icon} alt={resource.title} className="resource-icon" />
            <h3>{resource.title}</h3>
            <span
              className="resource-type"
              style={{ backgroundColor: typeColors[resource.type] || '#ccc' }}
            >
              {resource.type}
            </span>
            <p>{resource.description}</p>
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              Explore
            </a>
          </div>
        ))}
        {filteredResources.length === 0 && (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No resources found 😢</p>
        )}
      </div>
    </div>
  );
};

export default Resources;
