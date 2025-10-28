// PostDetail.jsx - Single post detail page

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';

const PostDetail = ({ showNotification }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { deletePostOptimistic } = usePosts();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postService.getPost(id);
      setPost(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setDeleting(true);
      
      // Optimistic update - remove from UI immediately
      deletePostOptimistic(post._id);
      
      // Show success notification
      if (showNotification) {
        showNotification('Post deleted successfully!', 'success');
      }
      
      // Actually delete from server
      await postService.deletePost(post._id);
      
      // Navigate to home after short delay
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      // If delete fails, the post will be re-added by refetch
      setError(err.response?.data?.error || 'Failed to delete post');
      if (showNotification) {
        showNotification('Failed to delete post. Please try again.', 'error');
      }
      setDeleting(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setAddingComment(true);
      const response = await postService.addComment(id, { content: commentText });
      
      // Refresh post to show new comment
      await fetchPost();
      
      setCommentText('');
      if (showNotification) {
        showNotification('Comment added successfully!', 'success');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add comment');
      if (showNotification) {
        showNotification('Failed to add comment', 'error');
      }
    } finally {
      setAddingComment(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error && !post) {
    return <ErrorMessage message={error} />;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="post-detail">
      <article className="post-article">
        <div className="post-header">
          {post.category && (
            <Link
              to={`/?category=${post.category.slug}`}
              className="post-category-badge"
              style={{ backgroundColor: post.category.color || '#667eea' }}
            >
              {post.category.name}
            </Link>
          )}
          
          <h1 className="post-title">{post.title}</h1>
          
          <div className="post-meta">
            {post.author && (
              <span className="post-author">By {post.author.name}</span>
            )}
            <span className="post-date">{formatDate(post.createdAt)}</span>
            <span className="post-views">👁️ {post.viewCount || 0} views</span>
          </div>

          {isAuthenticated && (
            <div className="post-actions">
              <Link
                to={`/posts/${post._id}/edit`}
                className="btn btn-edit"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn btn-delete"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        {post.featuredImage && (
          <div className="post-image">
            <img src={`/uploads/${post.featuredImage}`} alt={post.title} />
          </div>
        )}

        <div className="post-content">
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Comments Section */}
      <div className="comments-section">
        <h2>Comments ({post.comments?.length || 0})</h2>

        {isAuthenticated ? (
          <form
            onSubmit={handleAddComment}
            className="comment-form"
          >
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows="3"
              required
            />
            <button
              type="submit"
              disabled={addingComment || !commentText.trim()}
              className="btn btn-submit"
            >
              {addingComment ? 'Adding...' : 'Add Comment'}
            </button>
          </form>
        ) : (
          <p className="comment-login-prompt">
            <Link to="/login">Login</Link> to leave a comment
          </p>
        )}

        <div className="comments-list">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <div key={index} className="comment-item">
                <div className="comment-header">
                  <strong>{comment.user?.name || 'Anonymous'}</strong>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="comment-content">{comment.content}</div>
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>

      {error && post && <ErrorMessage message={error} />}

      <div className="post-footer">
        <Link to="/" className="btn btn-back">
          ← Back to Posts
        </Link>
      </div>
    </div>
  );
};

export default PostDetail;

