import React, { useState } from 'react';
import './Resource.css';

const resources = [
  // ===== Frameworks =====
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
    title: 'Keras',
    description: 'A high-level neural networks API for building deep learning models quickly and easily.',
    link: 'https://keras.io/',
    type: 'Framework',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Keras_logo.svg',
  },
  {
    title: 'Scikit-learn',
    description: 'A Python library for classical ML algorithms — simple, efficient, and powerful.',
    link: 'https://scikit-learn.org/',
    type: 'Library',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg',
  },
  {
    title: 'JAX',
    description: 'Accelerated NumPy for high-performance ML research — automatic differentiation and XLA compilation.',
    link: 'https://jax.readthedocs.io/',
    type: 'Library',
    icon: 'https://avatars.githubusercontent.com/u/49019119?s=200&v=4',
  },

  // ===== Platforms & Tools =====
  {
    title: 'Kaggle',
    description: 'Join competitions, explore datasets, and learn from the largest data science community.',
    link: 'https://www.kaggle.com/',
    type: 'Platform',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Kaggle_logo.png',
  },
  {
    title: 'Google Colab',
    description: 'A free Jupyter notebook environment that runs entirely in the cloud with GPU support.',
    link: 'https://colab.research.google.com/',
    type: 'Platform',
    icon: 'https://colab.research.google.com/img/colab_favicon_256px.png',
  },
  {
    title: 'Weights & Biases',
    description: 'A platform for experiment tracking, model management, and MLOps workflows.',
    link: 'https://wandb.ai/',
    type: 'Tool',
    icon: 'https://wandb.ai/logo.png',
  },
  {
    title: 'Gradient (Paperspace)',
    description: 'Train, build, and deploy deep learning models in the cloud effortlessly.',
    link: 'https://www.paperspace.com/gradient',
    type: 'Platform',
    icon: 'https://avatars.githubusercontent.com/u/14187364?s=200&v=4',
  },
  {
    title: 'NVIDIA NGC',
    description: 'Access pre-trained AI models, SDKs, and optimized containers for ML and DL.',
    link: 'https://catalog.ngc.nvidia.com/',
    type: 'Platform',
    icon: 'https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg',
  },
  {
    title: 'Deepnote',
    description: 'Collaborative Jupyter notebook platform for data science and ML projects.',
    link: 'https://deepnote.com/',
    type: 'Tool',
    icon: 'https://avatars.githubusercontent.com/u/50703224?s=200&v=4',
  },
  {
    title: 'OpenAI',
    description: 'Creators of ChatGPT, DALL·E, and other groundbreaking AI research tools.',
    link: 'https://openai.com/',
    type: 'Platform',
    icon: 'https://latestlogo.com/wp-content/uploads/2024/01/openai-icon.png',
  },
  {
    title: 'Anthropic',
    description: 'An AI research company behind Claude — focused on responsible and steerable AI systems.',
    link: 'https://www.anthropic.com/',
    type: 'Platform',
    icon: 'https://avatars.githubusercontent.com/u/110733888?s=200&v=4',
  },

  // ===== Learning & Tutorials =====
  {
    title: 'DeepLearning.ai',
    description: 'Founded by Andrew Ng — advancing AI education and practical skill-building courses.',
    link: 'https://www.deeplearning.ai/',
    type: 'Tutorial',
    icon: 'https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/http://coursera-university-assets.s3.amazonaws.com/b4/5cb90bb92f420b99bf323a0356f451/Icon.png',
  },
  {
    title: 'Fast.ai',
    description: 'Accessible deep learning courses and libraries designed for everyone.',
    link: 'https://www.fast.ai/',
    type: 'Tutorial',
    icon: 'https://avatars.githubusercontent.com/u/20547620?s=200&v=4',
  },
  {
    title: 'DataCamp',
    description: 'Learn data science, Python, and machine learning interactively with hands-on coding.',
    link: 'https://www.datacamp.com/',
    type: 'Platform',
    icon: 'https://asset.brandfetch.io/idou89mSUh/id1KupYxXq.jpeg?updated=1680282023371',
  },
  {
    title: 'Towards Data Science',
    description: 'Medium publication covering data science, AI, and ML tutorials from industry experts.',
    link: 'https://towardsdatascience.com/',
    type: 'Blog',
    icon: 'https://miro.medium.com/v2/resize:fit:176/1*Ch44N9Y8gqJEVwIDGEbIBg.png',
  },
  {
    title: 'Google AI Blog',
    description: 'Official blog by Google AI with research, tutorials, and the latest advancements in AI/ML.',
    link: 'https://ai.googleblog.com/',
    type: 'Blog',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  },
  {
    title: 'Medium AI',
    description: 'Insightful articles and tutorials on AI, ML, and data science from the community.',
    link: 'https://medium.com/tag/artificial-intelligence',
    type: 'Blog',
    icon: 'https://miro.medium.com/fit/c/176/176/1*sHhtYhaCe2Uc3IU0IgKwIQ.png',
  },

  // ===== Model Hubs & Research =====
  {
    title: 'Hugging Face',
    description: 'A hub for state-of-the-art NLP models, datasets, and tools.',
    link: 'https://huggingface.co/',
    type: 'Library',
    icon: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
  },
  {
    title: 'Papers with Code',
    description: 'Discover the latest ML papers with available code implementations.',
    link: 'https://paperswithcode.com/',
    type: 'Research',
    icon: 'https://production-media.paperswithcode.com/social-images/logo-og.png',
  },
  {
    title: 'DeepAI',
    description: 'Explore AI research, tools, and APIs for creative and analytical applications.',
    link: 'https://deepai.org/',
    type: 'Platform',
    icon: 'https://deepai.org/static/images/favicon-96x96.png',
  },
  {
    title: 'DeepML',
    description: 'Practice Machine Learning and Data Science problems.',
    link: 'https://www.deep-ml.com/',
    type: 'Platform',
    icon: 'https://www.deep-ml.com/_next/image?url=%2Fdeepml-logo.jpeg&w=64&q=75',
  },
];

const typeColors = {
  Framework: '#00eaff',
  Platform: '#007fff',
  Library: '#00c4a7',
  Tool: '#ff00ff',
  Blog: '#ff7b00',
  Tutorial: '#ff00a8',
  Research: '#ffc400',
};

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="resources-container">
      <h1 className="resources-heading">AI/ML Resources</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search resources..."
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
          <p className="no-results">No resources found.</p>
        )}
      </div>
    </div>
  );
};

export default Resources;
