import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/ProtectedRoute";
import axiosInstance from "../../utils/axiosInstance";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [contents, setContents] = useState<any[]>([]);
  const [formData, setFormData] = useState({ link: "", type: "", title: "", tags: "" });

  const fetchContent = async () => {
    try {
      const res = await axiosInstance.get('/content');
      setContents(res.data);
    } catch (err) {
      console.error('Failed to fetch content', err);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      await axiosInstance.post('/content', { ...formData, tags: tagsArray });
      setFormData({ link: "", type: "", title: "", tags: "" });
      fetchContent();
    } catch (err) {
      console.error('Create content failed', err);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.get("/auth/logout");
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/content/${id}`);
      fetchContent();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard!</h1>
      {user && (
        <div className="mb-6">
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      )}

      {/* Create new content */}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2 w-full max-w-md">
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="outline p-1" required />
        <input name="link" placeholder="Link" value={formData.link} onChange={handleChange} className="outline p-1" required />
        <select name="type" value={formData.type} onChange={handleChange} className="outline p-1" required>
          <option value="">Select type</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="article">Article</option>
          <option value="audio">Audio</option>
          <option value="doc">Doc</option>
          <option value="link">Link</option>
        </select>
        <input name="tags" placeholder="Tags (comma separated)" value={formData.tags} onChange={handleChange} className="outline p-1" />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2">Add Content</button>
      </form>

      {/* List of contents */}
      <ul className="space-y-4">
        {contents.map(item => (
          <li key={item._id} className="border p-4 rounded">
            <h2 className="font-semibold">{item.title}</h2>
            <p>Type: {item.type}</p>
            <p>Link: <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600">{item.link}</a></p>
            {item.tags && (
              <p>Tags: {item.tags.map((tag: any) => tag.title).join(', ')}</p>
            )}
            <button onClick={() => handleDelete(item._id)} className="text-red-500 mt-2">Delete</button>
          </li>
        ))}
      </ul>
      <button className="bg-red-500 text-red-50 p-2 cursor-pointer" onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard
