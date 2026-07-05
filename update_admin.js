const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, 'frontend/src/admin/AdminApp.jsx');
let content = fs.readFileSync(adminPath, 'utf8');

// 1. Rename MediaPresence to CarouselManager and update texts
let carouselManager = `const CarouselManager = ({ showToast }) => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title:'', type:'image', description:'', mainImage:'', gallery:[], link:'' });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const token = localStorage.getItem('admin_token') || '';

  const load = async () => {
    try {
      const res = await fetch(\`\${apiBase}/api/media\`);
      const data = await res.json();
      if (data.success) setItems(data.media);
    } catch (err) {
      showToast('Failed to load media archive', 'error');
    }
  };
  useEffect(()=>{ load(); },[]);

  const filteredItems = items.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, gallery: [] };
      const url = editingId ? \`\${apiBase}/api/media/\${editingId}\` : \`\${apiBase}/api/media\`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers:{ 'Content-Type':'application/json', Authorization: \`Bearer \${token}\` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) { 
        showToast(editingId ? 'Carousel Image updated' : 'Carousel Image added successfully');
        setForm({ title:'', type:'image', description:'', mainImage:'', gallery:[], link:'' }); 
        setEditingId(null);
        load(); 
        setIsFormOpen(false);
      } else {
        showToast(data.message || 'Operation failed', 'error');
      }
    } catch (err) {
      showToast('Connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (m) => {
    setEditingId(m._id || m.id);
    setForm({
      title: m.title,
      type: 'image',
      description: m.description || '',
      mainImage: m.mainImage || m.url, // Fallback to url if mainImage missing
      gallery: [],
      link: m.link || ''
    });
    setIsFormOpen(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title:'', type:'image', description:'', mainImage:'', gallery:[], link:'' });
    setIsFormOpen(false);
  };

  const remove = async () => {
    setLoading(true);
    try {
      const res = await fetch(\`\${apiBase}/api/media/\${confirmDelete.id}\`, { 
        method:'DELETE', 
        headers:{ Authorization: \`Bearer \${token}\` } 
      });
      const data = await res.json();
      if (data.success) {
        showToast('Image removed');
        setConfirmDelete({ open: false, id: null });
        load();
      }
    } catch (err) {
      showToast('Failed to remove entry', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <ConfirmModal 
        isOpen={confirmDelete.open} 
        title="Remove Image?" 
        message="This will remove the image from the 3D Carousel." 
        onConfirm={remove} 
        onCancel={() => setConfirmDelete({ open: false, id: null })} 
        loading={loading}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative group flex-1 w-full md:max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Carousel Images..." 
            className="pl-12 pr-6 py-3 rounded-xl bg-white border border-gray-200 shadow-sm outline-none transition-all w-full font-medium text-gray-900" 
          />
        </div>
        <ShinyButton 
          onClick={() => setIsFormOpen(!isFormOpen)} 
          variant={isFormOpen ? "danger" : "primary"}
          className="rounded-xl px-6 py-3"
        >
          {isFormOpen ? "Cancel" : "Add New Image"}
        </ShinyButton>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
              <h3 className="text-xl font-bold mb-6">{editingId ? "Edit Image" : "Add Image"}</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <PremiumInput label="Image Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g., Workshop 2024" required />
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Upload Image</label>
                  <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                              if (file.size > 2000000) return showToast('Image too large', 'error'); // 2MB limit
                              const reader = new FileReader();
                              reader.onloadend = () => setForm({...form, mainImage: reader.result, url: reader.result});
                              reader.readAsDataURL(file);
                          }
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-medium text-gray-800"
                  />
                  {form.mainImage && <img src={form.mainImage} alt="Preview" className="h-32 w-auto object-cover rounded-xl mt-2 border border-gray-200" />}
                </div>

                <div className="flex gap-4">
                  <ShinyButton className="flex-1" loading={loading}>
                    {editingId ? "Update Image" : "Save Image"}
                  </ShinyButton>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredItems.map((m)=>(
            <motion.div 
              key={m._id || m.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="h-48 bg-gray-50 relative overflow-hidden">
                <img 
                  src={m.mainImage || m.url} 
                  className="w-full h-full object-cover" 
                  alt={m.title} 
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{m.title}</h3>
                <div className="flex gap-2 mt-auto justify-end">
                  <button onClick={() => startEdit(m)} className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"><Edit3 size={16} /></button>
                  <button onClick={()=>setConfirmDelete({ open: true, id: m._id || m.id })} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};`;

let testimonialsAdmin = `const TestimonialsAdmin = ({ showToast }) => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name:'', role:'', text:'', avatar:'', is_active: true });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const token = localStorage.getItem('admin_token') || '';

  const load = async () => {
    try {
      const res = await fetch(\`\${apiBase}/api/testimonials\`);
      const data = await res.json();
      if (data.success) setItems(data.testimonials);
    } catch (err) {
      showToast('Failed to load testimonials', 'error');
    }
  };
  useEffect(()=>{ load(); },[]);

  const filteredItems = items.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.text.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId ? \`\${apiBase}/api/testimonials/\${editingId}\` : \`\${apiBase}/api/testimonials\`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers:{ 'Content-Type':'application/json', Authorization: \`Bearer \${token}\` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) { 
        showToast(editingId ? 'Testimonial updated' : 'Testimonial added');
        setForm({ name:'', role:'', text:'', avatar:'', is_active: true }); 
        setEditingId(null);
        load(); 
        setIsFormOpen(false);
      } else {
        showToast(data.message || 'Operation failed', 'error');
      }
    } catch (err) {
      showToast('Connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      role: t.role || '',
      text: t.text,
      avatar: t.avatar || '',
      is_active: t.is_active
    });
    setIsFormOpen(true);
  };

  const remove = async () => {
    setLoading(true);
    try {
      const res = await fetch(\`\${apiBase}/api/testimonials/\${confirmDelete.id}\`, { 
        method:'DELETE', 
        headers:{ Authorization: \`Bearer \${token}\` } 
      });
      const data = await res.json();
      if (data.success) {
        showToast('Testimonial removed');
        setConfirmDelete({ open: false, id: null });
        load();
      }
    } catch (err) {
      showToast('Failed to remove entry', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <ConfirmModal 
        isOpen={confirmDelete.open} 
        title="Remove Testimonial?" 
        message="Are you sure you want to delete this testimonial?" 
        onConfirm={remove} 
        onCancel={() => setConfirmDelete({ open: false, id: null })} 
        loading={loading}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative group flex-1 w-full md:max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Testimonials..." 
            className="pl-12 pr-6 py-3 rounded-xl bg-white border border-gray-200 shadow-sm outline-none transition-all w-full font-medium text-gray-900" 
          />
        </div>
        <ShinyButton 
          onClick={() => setIsFormOpen(!isFormOpen)} 
          variant={isFormOpen ? "danger" : "primary"}
          className="rounded-xl px-6 py-3"
        >
          {isFormOpen ? "Cancel" : "Add Testimonial"}
        </ShinyButton>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
              <h3 className="text-xl font-bold mb-6">{editingId ? "Edit Testimonial" : "Add Testimonial"}</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <PremiumInput label="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g., John Doe" required />
                  <PremiumInput label="Role" value={form.role} onChange={e=>setForm({...form,role:e.target.value})} placeholder="e.g., Student" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Testimonial Text</label>
                  <textarea 
                    value={form.text} 
                    onChange={e=>setForm({...form,text:e.target.value})} 
                    placeholder="Their feedback..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-medium text-gray-800 h-24 resize-none" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Avatar Image (Optional)</label>
                  <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                              if (file.size > 2000000) return showToast('Image too large', 'error'); // 2MB limit
                              const reader = new FileReader();
                              reader.onloadend = () => setForm({...form, avatar: reader.result});
                              reader.readAsDataURL(file);
                          }
                      }}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none text-sm font-medium text-gray-800"
                  />
                  {form.avatar && <img src={form.avatar} alt="Preview" className="h-16 w-16 object-cover rounded-full mt-2 border border-gray-200" />}
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isActive" checked={form.is_active} onChange={e=>setForm({...form, is_active: e.target.checked})} className="w-4 h-4 rounded border-gray-300" />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active (Visible on website)</label>
                </div>

                <div className="flex gap-4">
                  <ShinyButton className="flex-1" loading={loading}>
                    {editingId ? "Update Testimonial" : "Save Testimonial"}
                  </ShinyButton>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredItems.map((t)=>(
            <motion.div 
              key={t.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-xl">{t.name.charAt(0)}</div>
                )}
                <div>
                  <h4 className="font-bold text-gray-900">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-4 italic flex-1">"{t.text}"</p>
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <span className={\`text-xs font-bold px-2 py-1 rounded-full \${t.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}\`}>
                  {t.is_active ? 'Active' : 'Hidden'}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(t)} className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"><Edit3 size={16} /></button>
                  <button onClick={()=>setConfirmDelete({ open: true, id: t.id })} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};`;

let siteContentManager = `const SiteContentManager = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState('carousel');

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-200 pb-2">
        <button 
          onClick={() => setActiveTab('carousel')} 
          className={\`pb-2 px-4 text-sm font-bold transition-all \${activeTab === 'carousel' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-800'}\`}
        >
          Carousel Photos
        </button>
        <button 
          onClick={() => setActiveTab('testimonials')} 
          className={\`pb-2 px-4 text-sm font-bold transition-all \${activeTab === 'testimonials' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-800'}\`}
        >
          Testimonials
        </button>
      </div>
      
      {activeTab === 'carousel' ? (
        <CarouselManager showToast={showToast} />
      ) : (
        <TestimonialsAdmin showToast={showToast} />
      )}
    </div>
  );
};`;

// Strip out the old MediaPresence component entirely
const startIndex = content.indexOf('const MediaPresence =');
const endIndex = content.indexOf('const AdminApp =');
if (startIndex !== -1 && endIndex !== -1) {
  content = content.slice(0, startIndex) + carouselManager + '\n\n' + testimonialsAdmin + '\n\n' + siteContentManager + '\n\n' + content.slice(endIndex);
}

// Update menuItems in AdminLayout
content = content.replace(
  `{ path: '/admin/media', name: 'Media', icon: Newspaper }`,
  `{ path: '/admin/site-content', name: 'Site Content', icon: LayoutTemplate }`
);
// Import LayoutTemplate
if (!content.includes('LayoutTemplate')) {
    content = content.replace('LayoutDashboard,', 'LayoutDashboard, LayoutTemplate,');
}

// Update routes in AdminLayout
content = content.replace(
  `<Route path="/media" element={<MediaPresence showToast={showToast} />} />`,
  `<Route path="/site-content" element={<SiteContentManager showToast={showToast} />} />`
);

fs.writeFileSync(adminPath, content);
console.log('Successfully updated AdminApp.jsx');
