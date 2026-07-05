import bcrypt from 'bcryptjs';

export const devStore = {
  admins: [
    {
      id: 'default-admin',
      name: 'Admin',
      email: 'admin@local',
      passwordHash: bcrypt.hashSync('admin123', 10),
      role: 'superadmin'
    }
  ],
  projects: [],
  reports: [],
  announcements: [],
  media: [],
  subscribers: [],
  settings: { 
    address: '123 NGO Street, Social Welfare Area, New Delhi, India', 
    phone: '+91 98765 43210', 
    email: 'contact@samikaran.org',
    impactStats: {
      studentsReached: '1650+',
      institutions: '14+',
      workshops: '20+'
    }
  },
};

export const addAdmin = (admin) => {
  devStore.admins.push(admin);
  return admin;
};

export const removeAdmin = (id) => {
  devStore.admins = devStore.admins.filter((a) => (a._id || a.id) !== id);
};

export const updateAdminPassword = (id, passwordHash) => {
  const a = devStore.admins.find((x) => (x._id || x.id) === id);
  if (a) a.passwordHash = passwordHash;
};

export const addProject = (p) => {
  const id = Date.now().toString();
  const project = { ...p, _id: id, id };
  devStore.projects.push(project);
  return project;
};

export const updateProjectLocal = (id, data) => {
  const idx = devStore.projects.findIndex((p) => (p._id || p.id) === id);
  if (idx >= 0) devStore.projects[idx] = { ...devStore.projects[idx], ...data };
  return devStore.projects[idx];
};

export const removeProject = (id) => {
  devStore.projects = devStore.projects.filter((p) => (p._id || p.id) !== id);
};

export const addMedia = (m) => {
  const id = Date.now().toString();
  const media = { ...m, _id: id, id, createdAt: new Date() };
  devStore.media.push(media);
  return media;
};

export const updateMediaLocal = (id, data) => {
  const idx = devStore.media.findIndex((m) => (m._id || m.id) === id);
  if (idx >= 0) devStore.media[idx] = { ...devStore.media[idx], ...data };
  return devStore.media[idx];
};

export const removeMedia = (id) => {
  devStore.media = devStore.media.filter((m) => (m._id || m.id) !== id);
};

export const addSubscriber = (email) => {
  if (devStore.subscribers.find(s => s.email === email)) return null;
  const sub = { _id: Date.now().toString(), email, status: 'Active', createdAt: new Date() };
  devStore.subscribers.push(sub);
  return sub;
};

export const removeSubscriber = (id) => {
  devStore.subscribers = devStore.subscribers.filter(s => (s._id || s.id) !== id);
};

export const addReport = (r) => {
  const id = Date.now().toString();
  const report = { ...r, _id: id, id, createdAt: new Date() };
  devStore.reports.push(report);
  return report;
};

export const updateReportLocal = (id, data) => {
  const idx = devStore.reports.findIndex((r) => (r._id || r.id) === id);
  if (idx >= 0) devStore.reports[idx] = { ...devStore.reports[idx], ...data, updatedAt: new Date() };
  return devStore.reports[idx];
};

export const removeReport = (id) => {
  devStore.reports = devStore.reports.filter((r) => (r._id || r.id) !== id);
};

export const addAnnouncement = (a) => {
  const id = Date.now().toString();
  const ann = { ...a, _id: id, id, createdAt: new Date() };
  devStore.announcements.push(ann);
  return ann;
};

export const updateAnnouncementLocal = (id, data) => {
  const idx = devStore.announcements.findIndex((a) => (a._id || a.id) === id);
  if (idx >= 0) devStore.announcements[idx] = { ...devStore.announcements[idx], ...data, updatedAt: new Date() };
  return devStore.announcements[idx];
};

export const removeAnnouncement = (id) => {
  devStore.announcements = devStore.announcements.filter((a) => (a._id || a.id) !== id);
};

