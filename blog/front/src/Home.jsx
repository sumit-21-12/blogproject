import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`http://localhost:3000/`, {
      headers: { Authorization: token }
    }).then(res => {
      setBlogs(res.data);
    }).catch(() => setError('Failed to fetch blogs'));
  }, []);

  const published = Array.isArray(blogs) ? blogs.filter(blog => blog.status === 'published') : [];
  const drafts = Array.isArray(blogs) ? blogs.filter(blog => blog.status === 'draft') : [];

  const handleEdit = (id) => {
    navigate(`/editor/${id}`);
  };

  const handnex = () => {
    navigate('/editor');
  };

  const pub = async (id, title, content, tags) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/publish",
        { id, title, content, tags },
        { headers: { Authorization: token } }
      );
      alert("Published!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Error publishing blog");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Published Blogs</h1>
      {error && <p className="text-red-500">{error}</p>}

      {/* Horizontal scrollable row */}
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {published.map(blog => (
          <div
            key={blog._id}
            className="min-w-[300px] flex-shrink-0 border border-gray-300 rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-blue-700">{blog.title}</h3>
            <p className="text-gray-600 mt-2">{blog.content.slice(0, 100)}...</p>


            <div className="flex flex-wrap gap-2 mt-3">
  {Array.isArray(blog.tags) && blog.tags.map((tag, index) => (
    <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
      #{tag}
    </span>
  ))}
</div>

          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Drafts</h2>
<div className="flex overflow-x-auto space-x-4 pb-4">
  {drafts.map(blog => (
    <div
      key={blog._id}
      className="min-w-[300px] flex-shrink-0 border border-gray-300 rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition"
    >
      <h3 className="text-lg font-semibold text-blue-700">{blog.title}</h3>
      <p className="text-gray-600 mt-2">{blog.content.slice(0, 100)}...</p>

      <div className="flex flex-wrap gap-2 mt-3">
        {Array.isArray(blog.tags) && blog.tags.map((tag, index) => (
          <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex mt-4 space-x-3">
        <button
          onClick={() => handleEdit(blog._id)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Edit
        </button>
        <button
          onClick={() => pub(blog._id, blog.title, blog.content, blog.tags)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Publish
        </button>
      </div>
    </div>
  ))}
</div>
   

      <div className="mt-10 text-center">
        <button
          onClick={handnex}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Create New Blog
        </button>
      </div>
    </div>
  );
}

export default Home;
