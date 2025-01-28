import React, { useState, useEffect } from "react";
import { User, Clock } from "lucide-react";
import { CommentStatusEnum } from "../../../server/enums/CommentStatusEnum";
import axios from "axios";

const sample_comments = [
  {
    id: 1,
    author: "Anna Kowalska",
    content: "Świetny post, bardzo pomocny!",
    createdAt: "2025-01-25T10:30:00Z",
    status: CommentStatusEnum.Accepted,
  },
  {
    id: 2,
    author: "Jan Nowak",
    content: "Czy mogę zapytać o szczegóły?",
    createdAt: "2025-01-26T12:45:00Z",
    status: CommentStatusEnum.ForVeryfication,
  },
];

const CommentSection = ({ postId, adminPanel }) => {
  const [user, setUser] = useState();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        let comments = [];

        if(adminPanel == "true") {
          const response = await axios.get(`http://localhost:8080/comment/get-comments/${postId}`);
          comments = response.data;
        } else {
          const response = await axios.get(`http://localhost:8080/comment/get-accepted-comments/${postId}`);
          comments = response.data;
        }

        setComments(comments);
      } catch (error) {
        console.error('Błąd pobierania komentarzy:', error);
      }
    };

    fetchComments();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/session', { withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        console.error('Błąd pobierania danych użytkownika:', error);
      }
    };

    fetchUser();
  }, []);

  const handleStatusChange = (commentId, newStatus) => {
    try {
      const response = axios.put(`http://localhost:8080/comment/update-comment/${commentId}`, { 
        status: newStatus 
      });
      
      // setComments(comments.map((comment) => (comment.id === id ? response.data : comment)));
      window.location.reload();
    } catch (error) {
      console.error("Błąd aktualizacji komentarza: ", error);
    }
    // setComments((prevComments) =>
    //   prevComments.map((comment) =>
    //     comment.id === commentId ? { ...comment, status: newStatus } : comment
    //   )
    // );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (content.trim()) {
        await axios.post("http://localhost:8080/comment/add-comment", {
          content: content,
          post_id: postId,
          user_id: user.id,
          status: CommentStatusEnum.ForVeryfication,
        });

        setContent("");
        window.location.reload();
      }
    } catch (error) {
      console.error("Błąd dodawania komentarza: ", error);
    }
    // if (newComment.trim()) {
    //   const newCommentData = {
    //     id: Date.now(),
    //     author: "Użytkownik", // Możesz zastąpić dynamicznym autorem
    //     content: newComment,
    //     createdAt: new Date().toISOString(),
    //     status: COMMENT_STATUSES.PENDING,
    //   };
    //   setComments((prev) => [newCommentData, ...prev]);
    //   onAddComment?.(newCommentData); // Wysyłamy nowy komentarz do rodzica (jeśli podano callback)
    //   setNewComment(""); // Czyścimy pole
    // }
  };

  

  return (
    <div className="mt-4 space-y-4 text-secondary">
      {
        user && (
          <div className="bg-input p-4 rounded-lg shadow-sm">
            <textarea
              className="w-full p-2 bg-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows="3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button
              className="mt-2 px-4 py-2 bg-button rounded-lg hover:bg-primary-dark transition"
              onClick={handleSubmit}
            >
              Dodaj komentarz
            </button>
          </div>
        )
      }

      {comments.map((comment) => (
        <div key={comment.id} className="bg-input rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">{comment.first_name} {comment.last_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm text-secondary/60">
                {comment.create_date.slice(0, 10)}
              </span>
            </div>
          </div>

          <p className="my-2">{comment.content}</p>

          {
            adminPanel == "true" && (
              <div className="flex items-center justify-between mt-2">
                <select
                  className="px-3 py-1 bg-input rounded-lg text-sm"
                  value={comment.status}
                  onChange={(e) => handleStatusChange(comment.id, e.target.value)}
                >
                  <option value={CommentStatusEnum.ForVeryfication}>Do akceptacji</option>
                  <option value={CommentStatusEnum.Accepted}>Zaakceptowany</option>
                  <option value={CommentStatusEnum.Deleted}>Usunięty</option>
                </select>
              </div>
            )
          }

        </div>
      ))}
    </div>
  );
};

export default CommentSection;
