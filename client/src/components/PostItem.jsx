import React, { useState, useEffect } from "react";
import { MessageSquare, Clock, ChevronUp, ChevronDown } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CommentSection from "./CommentSection";
import axios from "axios";

function RefactorCategory(category) {
  switch (category) {
    case "1":
      return "Usługi";
    case "2":
      return "Promocje";
    case "3":
      return "Porady i wskazówki";
    case "4":
      return "Zadowoleni klienci";
    case "5":
      return "Wydarzenia w salonie";
    case "6":
      return "Zespół fryzjerów";
    case "7":
      return "Nowości w salonie";
    default:
      return "Nieznana kategoria";
  }
}

const PostItem = ({ post }) => {
  const [expandedComments, setExpandedComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  const editor = useEditor({
    content: post.description,
    editable: false,
    extensions: [StarterKit],
  });

  const toggleComments = () => {
    setExpandedComments((prev) => !prev);
  };

  useEffect(() => {
    const fetchCommentsCount = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/posts-management/get-comments-count/${post.id}`);
        setCommentsCount(response.data[0].count);
      } catch (error) {
        console.error("Błąd pobierania liczby komentarzy: ", error);
      }
    };

    fetchCommentsCount();
  }, []);

  return (
    <div
      key={post.id}
      className="bg-element p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer text-secondary"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.create_date.slice(0, 10)}
            </span>
            <span>Autor: {post.first_name} {post.last_name}</span>
            <span className="bg-primary/20 py-1 rounded">
              Kategoria: {RefactorCategory(post.category)}
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            {commentsCount}
          </span>
        </div>
      </div>
      <div className="line-clamp-2">
        {editor && <EditorContent editor={editor} />}
      </div>
      <button
        className="w-full mt-2 flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-secondary py-2 rounded font-bold"
        onClick={toggleComments}
      >
        {expandedComments ? (
          <>
            <ChevronUp className="w-5 h-5" />
            Zwiń komentarze
          </>
        ) : (
          <>
            <ChevronDown className="w-5 h-5" />
            Pokaż komentarze
          </>
        )}
      </button>

      {expandedComments && (
        <CommentSection postId={post.id} adminPanel="false"/>
      )}
    </div>
  );
};

export default PostItem;
