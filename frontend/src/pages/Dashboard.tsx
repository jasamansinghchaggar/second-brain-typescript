import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../components/ProtectedRoute";
import axiosInstance from "../../utils/axiosInstance";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardTitle, CardContent } from "../components/ui/card";
import { ModeToggle } from "../components/mode-toggle";
import {
  TrashIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  RiInstagramLine,
  RiLink,
  RiLinkedinBoxFill,
  RiNotionFill,
  RiYoutubeFill,
  RiFilterOffFill
} from "@remixicon/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "../components/ui/dropdown-menu";
import { User2Icon } from "lucide-react";
import { ComboboxDemo } from "@/components/combobox-demo";




const SidebarIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-accent cursor-pointer">
    {children}
  </div>
);

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [contents, setContents] = useState<any[]>([]);
  const [formData, setFormData] = useState({ link: "", type: "", title: "", tags: "" });
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState<string>("");
  const navigate = useNavigate();

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
      setShowForm(false);
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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col min-h-screen">
        <div className="flex items-center gap-2 border-b-2 border-b-accent py-4 px-6 ">
          <div className="rounded-full w-10 h-10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48px"
              width="48px"
              viewBox="0 -960 960 960"
              style={{ fill: 'var(--theme-brain-logo, currentColor)' }}
            >
              <path d="M390-120q-51 0-88-35.5T260-241q-60-8-100-53t-40-106q0-21 5.5-41.5T142-480q-11-18-16.5-38t-5.5-42q0-61 40-105.5t99-52.5q3-51 41-86.5t90-35.5q26 0 48.5 10t41.5 27q18-17 41-27t49-10q52 0 89.5 35t40.5 86q59 8 99.5 53T840-560q0 22-5.5 42T818-480q11 18 16.5 38.5T840-400q0 62-40.5 106.5T699-241q-5 50-41.5 85.5T570-120q-25 0-48.5-9.5T480-156q-19 17-42 26.5t-48 9.5Zm130-590v460q0 21 14.5 35.5T570-200q20 0 34.5-16t15.5-36q-21-8-38.5-21.5T550-306q-10-14-7.5-30t16.5-26q14-10 30-7.5t26 16.5q11 16 28 24.5t37 8.5q33 0 56.5-23.5T760-400q0-5-.5-10t-2.5-10q-17 10-36.5 15t-40.5 5q-17 0-28.5-11.5T640-440q0-17 11.5-28.5T680-480q33 0 56.5-23.5T760-560q0-33-23.5-56T680-640q-11 18-28.5 31.5T613-587q-16 6-31-1t-20-23q-5-16 1.5-31t22.5-20q15-5 24.5-18t9.5-30q0-21-14.5-35.5T570-760q-21 0-35.5 14.5T520-710Zm-80 460v-460q0-21-14.5-35.5T390-760q-21 0-35.5 14.5T340-710q0 16 9 29.5t24 18.5q16 5 23 20t2 31q-6 16-21 23t-31 1q-21-8-38.5-21.5T279-640q-32 1-55.5 24.5T200-560q0 33 23.5 56.5T280-480q17 0 28.5 11.5T320-440q0 17-11.5 28.5T280-400q-21 0-40.5-5T203-420q-2 5-2.5 10t-.5 10q0 33 23.5 56.5T280-320q20 0 37-8.5t28-24.5q10-14 26-16.5t30 7.5q14 10 16.5 26t-7.5 30q-14 19-32 33t-39 22q1 20 16 35.5t35 15.5q21 0 35.5-14.5T440-250Zm40-230Z" />
            </svg>
          </div>
          <span className="font-bold text-xl">Second Brain</span>
        </div>
        <nav className="flex flex-col gap-1 py-8 px-6">
          <div className="flex items-center hover:bg-accent rounded-md cursor-pointer" onClick={() => setFilterType("linkedin")}>
            <SidebarIcon><RiLinkedinBoxFill /></SidebarIcon>
            <p className="align-center">LinkedIn</p>
          </div>
          <div className="flex items-center hover:bg-accent rounded-md cursor-pointer" onClick={() => setFilterType("youtube")}>
            <SidebarIcon><RiYoutubeFill /></SidebarIcon>
            <p className="text-center">YouTube</p>
          </div>
          <div className="flex items-center hover:bg-accent rounded-md cursor-pointer" onClick={() => setFilterType("notion")}>
            <SidebarIcon><RiNotionFill /></SidebarIcon>
            <p className="text-center">Notion</p>
          </div>
          <div className="flex items-center hover:bg-accent rounded-md cursor-pointer" onClick={() => setFilterType("instagram")}>
            <SidebarIcon><RiInstagramLine /></SidebarIcon>
            <p className="text-center">Instagram</p>
          </div>
          <div className="flex items-center hover:bg-accent rounded-md cursor-pointer" onClick={() => setFilterType("other")}>
            <SidebarIcon><RiLink /></SidebarIcon>
            <p className="text-center">Other</p>
          </div>
          <div className="flex items-center hover:bg-accent rounded-md cursor-pointer" onClick={() => setFilterType("")}>
            <SidebarIcon><RiFilterOffFill /></SidebarIcon>
            <p className="text-center">All</p>
          </div>
        </nav>
        <div className="mt-auto flex flex-col gap-4 py-8 px-6">
          <ModeToggle />
          <Button variant="destructive" className="w-full" onClick={handleLogout}>Logout</Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">All Notes</h1>
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <User2Icon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={16}>
                <DropdownMenuLabel>Profile</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <span className="font-medium">Username:</span> {user?.username}
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <span className="font-medium">Email:</span> {user?.email}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="gap-2" onClick={() => setShowForm(true)}><PlusIcon className="w-5 h-5" />Add Content</Button>
          </div>
        </div>

        {
          showForm && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-card rounded-xl shadow-lg p-8 w-full max-w-md relative">
                <Button size="icon" variant="ghost" className="absolute top-3 right-3" onClick={() => setShowForm(false)}><XMarkIcon className="w-6 h-6" /></Button>
                <h2 className="text-xl font-semibold mb-4">Add New Content</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="link">Link</Label>
                    <Input id="link" name="link" placeholder="Link" value={formData.link} onChange={handleChange} required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="type">Type</Label>
                    <ComboboxDemo value={formData.type} onChange={(val: string) => setFormData(prev => ({ ...prev, type: val }))} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input id="tags" name="tags" placeholder="Tags (comma separated)" value={formData.tags} onChange={handleChange} />
                  </div>
                  <Button type="submit" className="mt-2">Add Content</Button>
                </form>
              </div>
            </div>
          )
        }

        {/* Notes grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(filterType ? contents.filter(item => item.type === filterType) : contents).map(item => (
            <Card key={item._id} className="relative border border-border shadow-lg rounded-2xl p-6" style={{ boxShadow: '0 2px 16px 0 rgba(0,0,0,0.12)' }}>
              <div className="flex  items-center gap-3">
                {item.type === 'linkedin' ? <RiLinkedinBoxFill /> :
                  item.type === 'youtube' ? <RiYoutubeFill /> :
                    item.type === 'notion' ? <RiNotionFill /> :
                      item.type === 'instagram' ? <RiInstagramLine /> :
                        item.type === 'other' ? <RiLink /> :
                          <RiLink />}
                <CardTitle className="text-2xl font-bold text-foreground">{item.title}</CardTitle>
              </div>
              <CardContent className="flex flex-col gap-3 p-0">
                <Link to={item.link} target="_blank" rel="noopener noreferrer" className="text-lg font-medium underline text-primary break-all mb-2">{item.link}</Link>
                <div className="flex flex-wrap gap-3 mb-2">
                  {item.tags && item.tags.map((tag: any, idx: number) => (
                    <span key={idx} className="px-2 py-1 rounded-sm font-medium border border-border">{tag.title}</span>
                  ))}
                </div>
              </CardContent>
              <div className="flex items-center justify-between text-base text-muted-foreground">
                <span>Added on {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</span>
                <div className="flex gap-4">
                  <Button variant="destructive" size="icon" title="Delete" onClick={() => handleDelete(item._id)}><TrashIcon className="w-6 h-6" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main >
    </div >
  )
}

export default Dashboard
