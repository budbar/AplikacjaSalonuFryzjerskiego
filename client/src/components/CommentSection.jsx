import React, { useState } from "react";
import { User, Clock } from "lucide-react";

export const COMMENT_STATUSES = {
  PENDING: "do akceptacji",
  APPROVED: "zaakceptowany",
  DELETED: "usunięty",
};

// Przykładowe komentarze
const sample_comments = [
  {
    id: 1,
    author: "Anna Kowalska",
    content: "Świetny post, bardzo pomocny!",
    createdAt: "2025-01-25T10:30:00Z",
    status: COMMENT_STATUSES.APPROVED,
  },
  {
    id: 2,
    author: "Jan Nowak",
    content: "Czy mogę zapytać o szczegóły?",
    createdAt: "2025-01-26T12:45:00Z",
    status: COMMENT_STATUSES.PENDING,
  },
];

const CommentSection = ({ postId, onAddComment }) => {
  const [comments, setComments] = useState(sample_comments); // Użycie sample_comments
  const [newComment, setNewComment] = useState("");

  const handleStatusChange = (commentId, newStatus) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, status: newStatus } : comment
      )
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentData = {
        id: Date.now(),
        author: "Użytkownik", // Możesz zastąpić dynamicznym autorem
        content: newComment,
        createdAt: new Date().toISOString(),
        status: COMMENT_STATUSES.PENDING,
      };
      setComments((prev) => [newCommentData, ...prev]);
      onAddComment?.(newCommentData); // Wysyłamy nowy komentarz do rodzica (jeśli podano callback)
      setNewComment(""); // Czyścimy pole
    }
  };

  return (
    <div className="mt-4 space-y-4 text-secondary">
      <div className="bg-input p-4 rounded-lg shadow-sm">
        <textarea
          className="w-full p-2 bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows="3"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button
          className="mt-2 px-4 py-2 bg-button rounded-lg hover:bg-primary-dark transition"
          onClick={handleAddComment}
        >
          Dodaj komentarz
        </button>
      </div>

      {/* Lista komentarzy */}
      {comments.map((comment) => (
        <div key={comment.id} className="bg-input rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">{comment.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm text-secondary/60">
                {formatDate(comment.createdAt)}
              </span>
            </div>
          </div>

          <p className="my-2">{comment.content}</p>

          <div className="flex items-center justify-between mt-2">
            <select
              className="px-3 py-1 bg-input rounded-lg text-sm"
              value={comment.status}
              onChange={(e) => handleStatusChange(comment.id, e.target.value)}
            >
              <option value={COMMENT_STATUSES.PENDING}>Do akceptacji</option>
              <option value={COMMENT_STATUSES.APPROVED}>Zaakceptowany</option>
              <option value={COMMENT_STATUSES.DELETED}>Usunięty</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
