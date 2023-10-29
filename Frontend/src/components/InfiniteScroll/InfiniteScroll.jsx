import React, { useEffect, useState } from "react";

const InfiniteScrollPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadMorePosts = async () => {
      if (loading) return;

      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:5000/posts?page=${page}&limit=10`
        );
        const data = await response.json();

        setPosts((prevPosts) => [...prevPosts, ...data.posts]);
        setPage((prevPage) => prevPage + 1);
        setLoading(false);
      } catch (error) {
        console.error("Error loading posts:", error);
        setLoading(false);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          loadMorePosts();
        }
      },
      { rootMargin: "0px 0px 100px 0px" }
    );

    if (posts.length === 0) {
      loadMorePosts();
    } else {
      const lastPost = document.querySelector(".post:last-child");
      if (lastPost) {
        observer.observe(lastPost);
      }
    }

    return () => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
    };
  }, [posts, page, loading]);

  return (
    <div>
      {posts.map((post) => (
        <div className="post" key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default InfiniteScrollPosts;
