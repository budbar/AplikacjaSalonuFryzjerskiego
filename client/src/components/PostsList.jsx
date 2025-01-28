import React, { useState, useEffect } from "react";
import EmptyPageStatement from "../components/EmptyPageStatement";
import PostItem from "./PostItem";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
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

const PostsList = ({ posts = [] }) => {
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('1');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          await axios.post("http://localhost:8080/posts-management/add-post", {
            title: title,
            description: description,
            category: category,
            user_id: user.id,
          });
          
          const text = "Dodano post. Tytuł: '" + title + "'. Kategoria: '" + RefactorCategory(category) + "'. Autor: '" + user.first_name + " " + user.last_name + "'."; 

          await axios.post("http://localhost:8080/notification/add-notification", {
            text: text,
            category: category,
            user_id: user.id,
            account_level: user.level,
          });

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

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-primary rounded-lg shadow-md text-secondary">

            {
                user && (
                    <>
                        <h1 className="text-2xl font-bold mb-4 underline-border pb-2">Dodaj nowy post</h1>
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
                    </>
                )
            }
            
            { 
                posts.length > 0 ? (
                    <div className="container mx-auto max-w-screen-xl mt-10">
                        <div className="bg-primary rounded-lg p-6">
                            <h1 className="text-3xl font-bold text-secondary underline-border mb-6">
                                Forum
                            </h1>
                            <div className="space-y-4">
                                {posts.map((post) => (
                                    <PostItem key={post.id} post={post} />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <EmptyPageStatement statement={"Brak dodanych postów."} />
                ) 
            }
        </div>
    );

    // return posts.length > 0 ? (
    //     <div className="container mx-auto max-w-screen-xl mt-10">
    //         <div className="bg-primary rounded-lg p-6">
    //             <h1 className="text-3xl font-bold text-secondary underline-border mb-6">
    //                 Forum
    //             </h1>
    //             <div className="space-y-4">
    //                 {posts.map((post) => (
    //                     <PostItem key={post.id} post={post} />
    //                 ))}
    //             </div>
    //         </div>
    //     </div>
    // ) : (
    //     <EmptyPageStatement statement={"Brak dodanych postów."} />
    // );
};

export default PostsList;
