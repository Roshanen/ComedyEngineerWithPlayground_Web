import React, { useState, useEffect } from "react";
import InfiniteScrollPosts from "../../components/InfiniteScroll/infiniteScroll";

export default function Home() {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const fetchMorePosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/posts");
        const newPosts = await response.json();
        setPosts([...posts, ...newPosts]);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    
    fetchMorePosts();
  }, []);

  return (
    <div className="home-container">
      <h1>Posts</h1>
      <InfiniteScrollPosts posts={posts} loadMore={ fetchMorePosts() } />
    </div>
  );
}
