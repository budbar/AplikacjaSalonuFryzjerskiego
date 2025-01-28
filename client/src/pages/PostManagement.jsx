import React, { useState, useEffect } from "react";
import axios from "axios";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import { MessageSquare, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { PostStatusEnum } from "../../../server/enums/PostStatusEnum";
import CommentSection from "../components/CommentSection";
import EmptyPageStatement from "../components/EmptyPageStatement";

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

function RefactorStatus(status) {
  switch (status) {
      case "1":
          return "Zaakceptowany";
      case "2":
          return "Do weryfikacji";
      case "3":
          return "Usunięty";
  }
}

const PostEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
      ListItem,
      BulletList,
      OrderedList,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full bg-input rounded-lg p-2">
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          className="px-3 py-1 bg-input rounded hover:bg-gray-400"
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <b>B</b>
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-input rounded hover:bg-gray-400"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <i>I</i>
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-input rounded hover:bg-gray-400"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <u>U</u>
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

const PostManagement = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('1');
  const [commentsCount, setCommentsCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
      ListItem,
      BulletList,
      OrderedList,
    ],
    content: "<p>Wpisz treść posta...</p>",
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let posts = [];

        if (!user || user.level === undefined) return;

        if(user.level == 1) {
          const response = await axios.get("http://localhost:8080/posts-management/get-posts");
          posts = response.data;
        } else if (user.level == 2) {
          const response = await axios.get(`http://localhost:8080/posts-management/get-posts-by-category/${user.assigned_category}`);
          posts = response.data;
        }
        
        setPosts(posts.map(post => ({
          ...post,
          status: post.status || PostStatusEnum.ForVeryfication,
        })));
      } catch (error) {
        console.error("Błąd pobierania postów: ", error);
      }
    };

    fetchPosts();
  }, [user]);

  useEffect(() => {
    const fetchCommentsCount = async () => {
      try {
        const counts = await Promise.all(
          posts.map(async (post) => {
            const response = await axios.get(`http://localhost:8080/posts-management/get-comments-count/${post.id}`);
            return { id: post.id, count: response.data[0].count };
          })
        );
        
        const countsObject = counts.reduce((acc, curr) => {
          acc[curr.id] = curr.count;
          return acc;
        }, {});
        
        setCommentsCount(countsObject);
      } catch (error) {
        console.error("Błąd pobierania liczby komentarzy: ", error);
      }
    };
  
    if (posts.length > 0) {
      fetchCommentsCount();
    }
  }, [posts]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/posts-management/add-post", {
        title: title,
        description: description,
        category: category,
        user_id: user.id,
      });

      const response = await axios.get("http://localhost:8080/posts-management/get-posts");
      setPosts(response.data);
      
      setTitle('');
      setDescription('');
      setCategory('1');

      if (editor) {
        editor.commands.setContent("<p>Wpisz treść posta...</p>");
      }
    } catch (error) {
      console.error("Błąd dodawania posta: ", error);
    }
  };

  const handleUpdate = async (id, updatedTitle, updatedDescription, updatedCategory, updatedStatus, userId) => {
    try {
      const response = await axios.put(`http://localhost:8080/posts-management/update-post/${id}`, {
            title: updatedTitle,
            description: updatedDescription,
            category: updatedCategory,
            status: updatedStatus
      });

      const text = "Zmieniono status twojego posta. Tytuł: '" + updatedTitle + "'. Kategoria: '" + RefactorCategory(updatedCategory) + "'. Aktualny status: '" + RefactorStatus(updatedStatus) + "'."; 

      await axios.post("http://localhost:8080/notification/add-notification", {
        text: text,
        category: category,
        user_id: userId,
        account_level: user.level,
      });

      setPosts(posts.map((post) => (post.id === id ? response.data : post)));
      window.location.reload(); //Tymczasowe rozwiązanie trzeba będzie naprawić ten bug w konsoli przy edycji zdjęcia
    } catch (error) {
      console.error("Błąd aktualizacji posta: ", error);
    }
  };

  const [expandedComments, setExpandedComments] = useState({});

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  if(!user) {
    return (
      <EmptyPageStatement statement={"Ładowanie..."} />
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-primary rounded-lg shadow-md text-secondary">
      <h1 className="text-2xl font-bold mb-4 underline-border pb-2">Zarządzanie postami forum</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-bold">Tytuł:</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-input rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold">Treść:</label>
          <div className="w-full bg-input rounded-lg p-2">
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                className="px-3 py-1 bg-input rounded hover:bg-gray-400"
                onClick={() => editor?.chain().focus().toggleBold().run()}
              >
                <b>B</b>
              </button>
              <button
                type="button"
                className="px-3 py-1 bg-input rounded hover:bg-gray-400"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              >
                <i>I</i>
              </button>
              <button
                type="button"
                className="px-3 py-1 bg-input rounded hover:bg-gray-400"
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
              >
                <u>U</u>
              </button>
            </div>
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-bold">Kategoria:</label>
          <select
            className="w-full px-3 py-2 bg-input rounded-lg"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="1">Usługi</option>
            <option value="2">Promocje</option>
            <option value="3">Porady i wskazówki</option>
            <option value="4">Zadowoleni klienci</option>
            <option value="5">Wydarzenia w salonie</option>
            <option value="6">Zespół fryzjerów</option>
            <option value="7">Nowości w salonie</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-button hover:opacity-90 text-secondary py-2 rounded font-bold">
          Dodaj post
        </button>
      </form>

      <h2 className="text-xl font-bold mt-10 mb-4 border-b border-gray-200 pb-2">Lista postów</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-element p-4 rounded-lg shadow">
            <input
              type="text"
              className="w-full px-3 py-2 bg-input rounded-lg mb-2"
              value={post.title}
              onChange={(e) => setPosts(posts.map((p) => (p.id === post.id ? { ...p, title: e.target.value } : p)))}
            />

            <PostEditor
              content={post.description}
              onChange={(newContent) => {
                setPosts(posts.map((p) => (p.id === post.id ? { ...p, description: newContent } : p)));
              }}
            />

            <div className="grid grid-cols-2 gap-2 my-2">
              <select
                className="px-3 py-2 bg-input rounded-lg"
                value={post.category}
                onChange={(e) => setPosts(posts.map((p) => (p.id === post.id ? { ...p, category: e.target.value } : p)))}
              >
                <option value="1">Usługi</option>
                <option value="2">Promocje</option>
                <option value="3">Porady i wskazówki</option>
                <option value="4">Zadowoleni klienci</option>
                <option value="5">Wydarzenia w salonie</option>
                <option value="6">Zespół fryzjerów</option>
                <option value="7">Nowości w salonie</option>
              </select>

              <select
                className="px-3 py-2 bg-input rounded-lg"
                value={post.status}
                onChange={(e) => setPosts(posts.map((p) => (p.id === post.id ? { ...p, status: e.target.value } : p)))}
              >
                <option value={PostStatusEnum.ForVeryfication}>Do weryfikacji</option>
                <option value={PostStatusEnum.Accepted}>Zaakceptowany</option>
                <option value={PostStatusEnum.Deleted}>Usunięty</option>
              </select>
            </div>

            <div className="flex items-center gap-4 text-sm text-secondary/80 mb-2">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.create_date.slice(0, 10)}
              </span>
              <span className="flex items-center gap-1">
                Autor: {post.first_name} {post.last_name}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {commentsCount[post.id] || 0} komentarzy
              </span>
            </div>

            <div className="flex gap-2">
              <button
                className="flex-1 bg-button hover:opacity-90 text-secondary py-2 rounded font-bold"
                onClick={() => handleUpdate(post.id, post.title, post.description, post.category, post.status, post.user_id)}
              >
                Zaktualizuj
              </button>
            </div>

            <button
              className="w-full mt-2 flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-secondary py-2 rounded font-bold"
              onClick={() => toggleComments(post.id)}
            >
              {expandedComments[post.id] ? (
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

            {expandedComments[post.id] && (
              <CommentSection postId={post.id} adminPanel="true"/>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default PostManagement;