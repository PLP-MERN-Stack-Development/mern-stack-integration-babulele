// PostCard.jsx - Card component for displaying post preview

import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="post-card">
      {post.featuredImage && (
        <div className="post-card-image">
          <img src={`/uploads/${post.featuredImage}`} alt={post.title} />
        </div>
      )}
      
      <div className="post-card-content">
        {post.category && (
          <span
            className="post-category"
            style={{ backgroundColor: post.category.color || '#667eea' }}
          >
            {post.category.name}
          </span>
        )}
        
        <Link to={`/posts/${post._id}`} className="post-card-title">
          <h2>{post.title}</h2>
        </Link>
        
        {post.excerpt && (
          <p className="post-card-excerpt">{post.excerpt}</p>
        )}
        
        <div className="post-card-footer">
          {post.author && (
            <span className="post-author">By {post.author.name}</span>
          )}
          <span className="post-date">{formatDate(post.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;

