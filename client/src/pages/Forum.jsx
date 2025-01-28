import React, { useState, useEffect } from "react";
import axios from "axios";
import ForumPostsList from "../components/PostsList";

function Forum() {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await axios.get("http://localhost:8080/posts-management/get-accepted-posts");
          setPosts(response.data);
        } catch (error) {
          console.error("Błąd pobierania postów: ", error);
        }
      };
  
      fetchPosts();
    }, []);
  
    if (selectedPost) {
      return (
        <ForumPostDetails
          post={selectedPost}
          onBack={() => setSelectedPost(null)}
          onAddComment={(comment) => {
          }}
        />
      );
    }
  
    return (
      <ForumPostsList
        posts={posts}
        onSelectPost={setSelectedPost}
        onNewPost={() => setIsCreatingPost(true)}
      />
    );
  };

export default Forum;
