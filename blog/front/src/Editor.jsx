import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BlogEditor = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/${id}`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          setTitle(res.data.title);
          setContent(res.data.content);
          setTags(res.data.tags?.join(", "));
        })
        .catch((err) => {
          alert("Error fetching blog: " + err.message);
        });
    }
  }, [id, token]);

  const handleSaveDraft = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/save-draft",
        { id, title, content, tags },
        { headers: { Authorization: token } }
      );
      alert("Draft saved!");
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.error || "Error saving draft");
    }
  };

  const handlePublish = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/publish",
        { id, title, content, tags },
        { headers: { Authorization: token } }
      );
      alert("Published!");
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.error || "Error publishing");
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSaveDraft(); // silent auto-save
    }, 5000);
  
    return () => clearTimeout(timer);
  }, [title, content, tags]);
  

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">{id ? "Edit Blog" : "New Blog"}</h2>
      
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        rows={10}
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full mb-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full mb-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex space-x-4">
        <button
          onClick={handleSaveDraft}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
        >
          Save Draft
        </button>
        <button
          onClick={handlePublish}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default BlogEditor;
