import React, { useState } from 'react';
import './Blog.css';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const posts = [
    {
      title: 'How Generative Pretrained Transformers Power Generative AI Magic',
      date: 'Jun 7, 2025',
      author: 'Shreyansh Pandit',
      description:
        'A beginner-friendly yet powerful breakdown of how GPT models like ChatGPT, Claude, and Gemini actually work — from tokenization to attention mechanisms and beyond.',
      image:
        'https://cdn.hashnode.com/res/hashnode/image/upload/v1749302847324/bf21655d-2bcc-4ede-9795-cb3839b2f619.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp',
      link: 'https://shreyansh-pandit.hashnode.dev/how-generative-pretrained-transformers-power-generative-ai-magic',
    },
    {
      title: 'Everything You Need to Know About DNS — Record Types, Working, and Uses',
      date: 'Jan 25, 2025',
      author: 'Shreyansh Pandit',
      description:
        'An easy and complete explanation of DNS — how it translates domain names into IP addresses, the major record types (A, MX, CNAME), and how it powers the internet.',
      image:
        'https://cdn.hashnode.com/res/hashnode/image/upload/v1737205344702/33c51c47-c3b3-44dc-962a-164a36195ee3.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp',
      link: 'https://shreyansh-pandit.hashnode.dev/know-everything-about-dns-with-dns-record-types',
    },
    {
      title: 'How Zoom Really Works Under the Hood: A Simple Breakdown of Its Hidden Tech',
      date: 'Jan 16, 2025',
      author: 'Shreyansh Pandit',
      description:
        'A deep dive into the technology that makes Zoom work — from codecs and encryption to adaptive video streaming and real-time communication protocols.',
      image:
        'https://cdn.hashnode.com/res/hashnode/image/upload/v1736896192469/9e0173bf-1399-4b7d-99e5-eba7abb43303.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp',
      link: 'https://shreyansh-pandit.hashnode.dev/how-zoom-really-works-under-the-hood-a-simple-breakdown-of-its-hidden-tech',
    },
  ];

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="blog-container">
      <h1 className="blog-header">Blogs by Members</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="blog-grid">
        {filteredPosts.map((post, index) => (
          <div className="blog-card" key={index}>
            <div className="blog-image-wrapper">
              <img src={post.image} alt={post.title} />
              <div className="blog-meta">
                <span>{post.date}</span> • <span>{post.author}</span>
              </div>
            </div>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="read-more-btn"
            >
              Read Full Blog →
            </a>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <p className="no-results">No matching articles found.</p>
        )}
      </div>
    </div>
  );
};

export default Blog;
