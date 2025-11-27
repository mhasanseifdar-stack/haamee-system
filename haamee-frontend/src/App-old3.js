import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle,
  ChevronLeft,
  DollarSign,
  Edit,
  FileText,
  Home,
  LogOut,
  Plus,
  Save,
  Search,
  Trash2,
  Users,
  X,
  Filter
} from 'lucide-react';

// API Configuration
const API_URL = 'http://localhost:3001/api';

const HaameeFinal = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [persons, setPersons] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [events, setEvents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [payments, setPayments] = useState([]);

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // API Helper
  const api = {
    get: async (endpoint) => {
      const response = await fetch(`${API_URL}${endpoint}`);
      if (!response.ok) throw new Error('Network error');
      return response.json();
    },
    post: async (endpoint, data) => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Network error');
      return response.json();
    },
    put: async (endpoint, data) => {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Network error');
      return response.json();
    },
    delete: async (endpoint) => {
      const response = await fetch(`${API_URL}${endpoint}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Network error');
      return response.json();
    }
  };

  useEffect(() => {
    if (currentUser) loadAllData();
  }, [currentUser]);

  const loadAllData = async () => {
    try {
      const [p, o, e, a, pay] = await Promise.all([
        api.get('/persons'),
        api.get('/organizations'),
        api.get('/events'),
        api.get('/applications'),
        api.get('/payments')
      ]);
      setPersons(p);
      setOrganizations(o);
      setEvents(e);
      setApplications(a);
      setPayments(pay);
    } catch (error) {
      console.error('Load error:', error);
      notify('خطا در بارگذاری داده‌ها', 'error');
    }
  };

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const Notif = () => {
    if (!notification) return null;
    const ok = notification.type === 'success';
    return (
      <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 ${ok ? 'bg-green-500' : 'bg-red-500'} text-white`}>
        {ok ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
        <span className="font-semibold">{notification.message}</span>
      </div>
    );
  };

  // ==================== LOGIN ====================
  const Login = () => {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');

    const doLogin = () => {
      if (user === 'admin' && pass === '123456') {
        setCurrentUser({ username: 'مدیر سیستم' });
        setCurrentScreen('dashboard');
        notify('خوش آمدید!');
      } else {
        notify('نام کاربری یا رمز اشتباه است', 'error');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center p-4">
        <Notif />
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Calendar className="text-white" size={48} />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">سامانه Haamee</h1>
            <p className="text-gray-600">مدیریت رویدادها و درخواست‌ها</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-right text-gray-700 mb-2 font-semibold">نام کاربری</label>
              <input type="text" value={user} onChange={(e) => setUser(e.target.value)} className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:outline-none text-right" placeholder="admin" />
            </div>
            <div>
              <label className="block text-right text-gray-700 mb-2 font-semibold">رمز عبور</label>
              <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && doLogin()} className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:outline-none text-right" placeholder="123456" />
            </div>
            <button onClick={doLogin} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-bold shadow-lg">
              ورود به سامانه
            </button>
            <div className="text-center text-sm text-gray-500 mt-4 bg-gray-50 p-3 rounded-lg">
              <p className="font-semibold mb-1">اطلاعات ورود:</p>
              <p>admin / 123456</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== DASHBOARD ====================
  const Dashboard = () => {
    const stats = {
      persons: persons.length,
      orgs: organizations.length,
      events: events.length,
      apps: applications.length,
      pending: applications.filter((a) => a.status === 'در انتظار').length,
      payments: payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
    };

    const tiles = [
      { icon: Users, title: 'اشخاص', color: 'from-blue-500 to-blue-600', screen: 'persons', count: stats.persons },
      { icon: Building2, title: 'سازمان‌ها', color: 'from-purple-500 to-purple-600', screen: 'organizations', count: stats.orgs },
      { icon: Calendar, title: 'رویدادها', color: 'from-green-500 to-green-600', screen: 'events', count: stats.events },
      { icon: FileText, title: 'درخواست‌ها', color: 'from-orange-500 to-orange-600', screen: 'applications', count: stats.apps },
      { icon: DollarSign, title: 'پرداخت‌ها', color: 'from-red-500 to-red-600', screen: 'payments', count: payments.length },
      { icon: BarChart3, title: 'گزارش‌ها', color: 'from-indigo-500 to-indigo-600', screen: 'reports', count: '📊' }
    ];

    return (
      <div className="min-h-screen bg-gray-50">
        <Notif />
        <div className="bg-white shadow-md border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                  <Home className="text-white" size={24} />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">داشبورد مدیریت</h1>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">خوش آمدید: <span className="font-bold text-blue-600">{currentUser?.username}</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-blue-500">
              <p className="text-gray-600 text-sm mb-1 text-right">اشخاص</p>
              <p className="text-4xl font-bold text-blue-500 text-right">{stats.persons}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-purple-500">
              <p className="text-gray-600 text-sm mb-1 text-right">سازمان‌ها</p>
              <p className="text-4xl font-bold text-purple-500 text-right">{stats.orgs}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-green-500">
              <p className="text-gray-600 text-sm mb-1 text-right">رویدادها</p>
              <p className="text-4xl font-bold text-green-500 text-right">{stats.events}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-r-4 border-orange-500">
              <p className="text-gray-600 text-sm mb-1 text-right">درخواست‌ها</p>
              <p className="text-4xl font-bold text-orange-500 text-right">{stats.apps}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tiles.map((tile, index) => {
              const Icon = tile.icon;
              return (
                <button key={index} onClick={() => setCurrentScreen(tile.screen)} className={`bg-gradient-to-br ${tile.color} text-white rounded-2xl shadow-xl p-6 hover:opacity-90 transition-all`}>
                  <Icon className="mx-auto mb-3" size={48} />
                  <h3 className="text-xl font-bold mb-2">{tile.title}</h3>
                  <p className="text-3xl">{tile.count}</p>
                </button>
              );
            })}
          </div>

          <div className="text-center">
            <button onClick={() => { setCurrentUser(null); setCurrentScreen('login'); notify('خارج شدید'); }} className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl inline-flex items-center gap-2">
              <LogOut size={20} /> خروج
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==================== PERSONS LIST ====================
  const PersonsList = () => {
    const filtered = persons.filter((p) => {
      if (!searchText) return true;
      return (p.firstName || '').includes(searchText) || (p.lastName || '').includes(searchText) || (p.nationalCode || '').includes(searchText);
    });

    const remove = async (id) => {
      if (!window.confirm('حذف شود؟')) return;
      try {
        await api.delete(`/persons/${id}`);
        await loadAllData();
        notify('حذف شد');
      } catch { notify('خطا', 'error'); }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <Notif />
        <div className="bg-white shadow-md border-b mb-6">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => setCurrentScreen('dashboard')} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <ChevronLeft size={20} /> بازگشت
            </button>
            <h1 className="text-2xl font-bold">اشخاص ({persons.length})</h1>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="flex gap-3">
              <button onClick={() => { setSelectedPerson(null); setCurrentScreen('person-form'); }} className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                <Plus size={20} /> شخص جدید
              </button>
              <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="جستجو..." className="flex-1 px-4 py-3 border-2 rounded-lg text-right" />
              <button onClick={() => setSearchText('')} className="bg-gray-500 text-white px-4 py-3 rounded-lg"><X size={20} /></button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr className="text-right">
                  <th className="px-4 py-4">کد ملی</th>
                  <th className="px-4 py-4">نام</th>
                  <th className="px-4 py-4">جنسیت</th>
                  <th className="px-4 py-4">موبایل</th>
                  <th className="px-4 py-4">شهر</th>
                  <th className="px-4 py-4">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">{persons.length === 0 ? 'شخصی ثبت نشده' : 'نتیجه‌ای یافت نشد'}</td></tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-blue-50">
                      <td className="px-4 py-4 text-right">{p.nationalCode}</td>
                      <td className="px-4 py-4 text-right font-semibold">{p.firstName} {p.lastName}</td>
                      <td className="px-4 py-4 text-right">{p.gender === 'M' ? 'مرد' : p.gender === 'F' ? 'زن' : '-'}</td>
                      <td className="px-4 py-4 text-right">{p.mobile || '-'}</td>
                      <td className="px-4 py-4 text-right">{p.city || '-'}</td>
                      <td className="px-4 py-4">
                        <button onClick={() => { setSelectedPerson(p); setCurrentScreen('person-form'); }} className="text-blue-500 p-2"><Edit size={18} /></button>
                        <button onClick={() => remove(p.id)} className="text-red-500 p-2"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ==================== PERSON FORM (ADVANCED) ====================
  const PersonForm = () => {
    const [form, setForm] = useState(selectedPerson || {
      nationalCode: '', firstName: '', lastName: '', gender: '', birthDate: '', mobile: '', email: '', city: '', country: 'ایران', education: '', job: '', organizationId: '', changeFieldToHumanities: false, notes: ''
    });

    const [personContacts, setPersonContacts] = useState([]);
    const [personRoles, setPersonRoles] = useState([]);
    const [personDocuments, setPersonDocuments] = useState([]);

    const [contactForm, setContactForm] = useState({ contactType: '', contactValue: '' });
    const [showContactForm, setShowContactForm] = useState(false);

    const [roleForm, setRoleForm] = useState({ roleTitle: '', organization: '', startDate: '', endDate: '' });
    const [showRoleForm, setShowRoleForm] = useState(false);

    const [docType, setDocType] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
      if (selectedPerson) {
        setForm(selectedPerson);
        loadPersonDetails(selectedPerson.id);
      }
    }, [selectedPerson]);

    const loadPersonDetails = async (personId) => {
      try {
        const [contacts, roles, docs] = await Promise.all([
          api.get(`/persons/${personId}/contacts`),
          api.get(`/persons/${personId}/roles`),
          api.get(`/persons/${personId}/documents`)
        ]);
        setPersonContacts(contacts);
        setPersonRoles(roles);
        setPersonDocuments(docs);
      } catch (error) {
        console.error('Error loading person details:', error);
      }
    };

    const addContact = async () => {
      if (!contactForm.contactType || !contactForm.contactValue) {
        notify('نوع و مقدار الزامی است', 'error');
        return;
      }

      if (selectedPerson) {
        try {
          await api.post(`/persons/${selectedPerson.id}/contacts`, contactForm);
          await loadPersonDetails(selectedPerson.id);
          setContactForm({ contactType: '', contactValue: '' });
          setShowContactForm(false);
          notify('راه ارتباطی اضافه شد');
        } catch { notify('خطا', 'error'); }
      } else {
        setPersonContacts([...personContacts, { ...contactForm, id: Date.now() }]);
        setContactForm({ contactType: '', contactValue: '' });
        setShowContactForm(false);
      }
    };

    const removeContact = async (contactId) => {
      if (selectedPerson) {
        try {
          await api.delete(`/persons/${selectedPerson.id}/contacts/${contactId}`);
          await loadPersonDetails(selectedPerson.id);
          notify('حذف شد');
        } catch { notify('خطا', 'error'); }
      } else {
        setPersonContacts(personContacts.filter(c => c.id !== contactId));
      }
    };

    const addRole = async () => {
      if (!roleForm.roleTitle) {
        notify('عنوان نقش الزامی است', 'error');
        return;
      }

      if (selectedPerson) {
        try {
          await api.post(`/persons/${selectedPerson.id}/roles`, roleForm);
          await loadPersonDetails(selectedPerson.id);
          setRoleForm({ roleTitle: '', organization: '', startDate: '', endDate: '' });
          setShowRoleForm(false);
          notify('نقش اضافه شد');
        } catch { notify('خطا', 'error'); }
      } else {
        setPersonRoles([...personRoles, { ...roleForm, id: Date.now() }]);
        setRoleForm({ roleTitle: '', organization: '', startDate: '', endDate: '' });
        setShowRoleForm(false);
      }
    };

    const removeRole = async (roleId) => {
      if (selectedPerson) {
        try {
          await api.delete(`/persons/${selectedPerson.id}/roles/${roleId}`);
          await loadPersonDetails(selectedPerson.id);
          notify('حذف شد');
        } catch { notify('خطا', 'error'); }
      } else {
        setPersonRoles(personRoles.filter(r => r.id !== roleId));
      }
    };

    const uploadDocument = async () => {
      if (!docType || !selectedFile) {
        notify('نوع مدرک و فایل الزامی است', 'error');
        return;
      }

      if (!selectedPerson) {
        notify('ابتدا شخص را ذخیره کنید', 'error');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('documentType', docType);

      try {
        const response = await fetch(`${API_URL}/persons/${selectedPerson.id}/documents`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) throw new Error('Upload failed');
        
        await loadPersonDetails(selectedPerson.id);
        setDocType('');
        setSelectedFile(null);
        notify('مدرک آپلود شد');
      } catch { notify('خطای آپلود', 'error'); }
    };

    const removeDocument = async (docId) => {
      try {
        await api.delete(`/persons/${selectedPerson.id}/documents/${docId}`);
        await loadPersonDetails(selectedPerson.id);
        notify('حذف شد');
      } catch { notify('خطا', 'error'); }
    };

    const submit = async () => {
      if (!form.firstName || !form.lastName) {
        notify('نام و نام خانوادگی الزامی است', 'error');
        return;
      }

      try {
        if (selectedPerson) {
          await api.put(`/persons/${form.id}`, form);
          notify('به‌روز شد');
        } else {
          const result = await api.post('/persons', form);
          const newPersonId = result.id;
          
          for (const contact of personContacts) {
            await api.post(`/persons/${newPersonId}/contacts`, contact);
          }
          
          for (const role of personRoles) {
            await api.post(`/persons/${newPersonId}/roles`, role);
          }
          
          notify('ثبت شد');
        }
        
        await loadAllData();
        setCurrentScreen('persons');
      } catch (error) { 
        console.error('Submit error:', error);
        notify('خطا در ذخیره', 'error'); 
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <Notif />
        <div className="bg-white shadow-md border-b mb-6">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => setCurrentScreen('persons')} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <ChevronLeft size={20} /> بازگشت
            </button>
            <h1 className="text-2xl font-bold">{selectedPerson ? 'ویرایش شخص' : 'شخص جدید'}</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl pb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            
            <div className="mb-8">
              <h3 className="text-lg font-bold text-right mb-4 text-blue-600 border-b pb-2">اطلاعات پایه</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-right mb-2 font-semibold">کد ملی</label>
                  <input type="text" value={form.nationalCode} onChange={(e) => setForm({ ...form, nationalCode: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
                </div>
                <div>
                  <label className="block text-right mb-2 font-semibold">نام *</label>
                  <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
                </div>
                <div>
                  <label className="block text-right mb-2 font-semibold">نام خانوادگی *</label>
                  <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
                </div>
                <div>
                  <label className="block text-right mb-2 font-semibold">جنسیت</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right">
                    <option value="">انتخاب</option>
                    <option value="M">مرد</option>
                    <option value="F">زن</option>
                  </select>
                </div>
                <div>
                  <label className="block text-right mb-2 font-semibold">تاریخ تولد</label>
                  <input type="text" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} placeholder="1370/01/01" className="w-full px-4 py-3 border-2 rounded-lg text-right" />
                </div>
                <div>
                  <label className="block text-right mb-2 font-semibold">موبایل</label>
                  <input type="tel" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
                </div>
                <div>
                  <label className="block text-right mb-2 font-semibold">ایمیل</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
                </div>
                <div>
                  <label className="block text-right mb-2 font-semibold">شهر</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
                </div>
                <div>
                  <label className="block text-right mb-2 font-semibold">تحصیلات</label>
                  <select value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right">
                    <option value="">انتخاب</option>
                    <option value="دیپلم">دیپلم</option>
                    <option value="کارشناسی">کارشناسی</option>
                    <option value="کارشناسی ارشد">کارشناسی ارشد</option>
                    <option value="دکتری">دکتری</option>
                  </select>
                </div>
                <div>
                  <label className="block text-right mb-2 font-semibold">شغل</label>
                  <input type="text" value={form.job} onChange={(e) => setForm({ ...form, job: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
                </div>
                
                <div>
                  <label className="block text-right mb-2 font-semibold">سازمان</label>
                  <select value={form.organizationId} onChange={(e) => setForm({ ...form, organizationId: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right">
                    <option value="">انتخاب</option>
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="changeField"
                    checked={form.changeFieldToHumanities} 
                    onChange={(e) => setForm({ ...form, changeFieldToHumanities: e.target.checked })} 
                    className="w-5 h-5"
                  />
                  <label htmlFor="changeField" className="font-semibold cursor-pointer">تغییر رشته به علوم انسانی</label>
                </div>
              </div>
            </div>

            <div className="mb-8 border-t pt-6">
              <h3 className="text-lg font-bold text-right mb-4 text-green-600 border-b pb-2">راه‌های ارتباطی</h3>
              
              <div className="mb-4">
                <button type="button" onClick={() => setShowContactForm(!showContactForm)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition">
                  {showContactForm ? 'بستن فرم' : '+ اضافه کردن راه ارتباطی'}
                </button>
              </div>

              {showContactForm && (
                <div className="bg-green-50 p-4 rounded-lg mb-4 border-2 border-green-200">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={contactForm.contactType} onChange={(e) => setContactForm({ ...contactForm, contactType: e.target.value })} className="px-4 py-2 border-2 rounded-lg text-right">
                      <option value="">نوع راه ارتباطی</option>
                      <option value="تلگرام">تلگرام</option>
                      <option value="واتساپ">واتساپ</option>
                      <option value="لینکدین">لینکدین</option>
                      <option value="اینستاگرام">اینستاگرام</option>
                      <option value="توییتر">توییتر</option>
                      <option value="ایمیل">ایمیل</option>
                      <option value="سایر">سایر</option>
                    </select>
                    <input 
                      type="text" 
                      value={contactForm.contactValue} 
                      onChange={(e) => setContactForm({ ...contactForm, contactValue: e.target.value })} 
                      placeholder="@username یا لینک"
                      className="px-4 py-2 border-2 rounded-lg text-right"
                    />
                  </div>
                  <button type="button" onClick={addContact} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
                    افزودن
                  </button>
                </div>
              )}

              <div className="space-y-2">
                {personContacts.map(contact => (
                  <div key={contact.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                    <button type="button" onClick={() => removeContact(contact.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                    <div className="text-right">
                      <span className="font-semibold text-green-700">{contact.contactType}:</span> <span className="text-gray-700">{contact.contactValue}</span>
                    </div>
                  </div>
                ))}
                {personContacts.length === 0 && <p className="text-gray-500 text-right text-sm">راه ارتباطی ثبت نشده است</p>}
              </div>
            </div>

            <div className="mb-8 border-t pt-6">
              <h3 className="text-lg font-bold text-right mb-4 text-purple-600 border-b pb-2">نقش‌ها و سوابق</h3>
              
              <div className="mb-4">
                <button type="button" onClick={() => setShowRoleForm(!showRoleForm)} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition">
                  {showRoleForm ? 'بستن فرم' : '+ اضافه کردن نقش'}
                </button>
              </div>

              {showRoleForm && (
                <div className="bg-purple-50 p-4 rounded-lg mb-4 border-2 border-purple-200">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input 
                      type="text" 
                      value={roleForm.roleTitle} 
                      onChange={(e) => setRoleForm({ ...roleForm, roleTitle: e.target.value })} 
                      placeholder="عنوان نقش (استاد، مدیر، محقق، ...)"
                      className="px-4 py-2 border-2 rounded-lg text-right"
                    />
                    <input 
                      type="text" 
                      value={roleForm.organization} 
                      onChange={(e) => setRoleForm({ ...roleForm, organization: e.target.value })} 
                      placeholder="سازمان"
                      className="px-4 py-2 border-2 rounded-lg text-right"
                    />
                    <input 
                      type="text" 
                      value={roleForm.startDate} 
                      onChange={(e) => setRoleForm({ ...roleForm, startDate: e.target.value })} 
                      placeholder="تاریخ شروع (1400/01/01)"
                      className="px-4 py-2 border-2 rounded-lg text-right"
                    />
                    <input 
                      type="text" 
                      value={roleForm.endDate} 
                      onChange={(e) => setRoleForm({ ...roleForm, endDate: e.target.value })} 
                      placeholder="تاریخ پایان (1403/12/29) یا خالی بگذارید"
                      className="px-4 py-2 border-2 rounded-lg text-right"
                    />
                  </div>
                  <button type="button" onClick={addRole} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">
                    افزودن
                  </button>
                </div>
              )}

              <div className="space-y-2">
                {personRoles.map(role => (
                  <div key={role.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                    <button type="button" onClick={() => removeRole(role.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                    <div className="text-right">
                      <p className="font-semibold text-purple-700">{role.roleTitle} - {role.organization}</p>
                      <p className="text-sm text-gray-600">{role.startDate} {role.endDate && `تا ${role.endDate}`}</p>
                    </div>
                  </div>
                ))}
                {personRoles.length === 0 && <p className="text-gray-500 text-right text-sm">نقشی ثبت نشده است</p>}
              </div>
            </div>

            {selectedPerson && (
              <div className="mb-8 border-t pt-6">
                <h3 className="text-lg font-bold text-right mb-4 text-red-600 border-b pb-2">مدارک و فایل‌ها</h3>
                
                <div className="bg-red-50 p-4 rounded-lg mb-4 border-2 border-red-200">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={docType} onChange={(e) => setDocType(e.target.value)} className="px-4 py-2 border-2 rounded-lg text-right">
                      <option value="">نوع مدرک</option>
                      <option value="کارت ملی">کارت ملی</option>
                      <option value="پاسپورت">پاسپورت</option>
                      <option value="شناسنامه">شناسنامه</option>
                      <option value="مدرک تحصیلی">مدرک تحصیلی</option>
                      <option value="CV">CV</option>
                      <option value="عکس">عکس</option>
                      <option value="سایر">سایر</option>
                    </select>
                    <input 
                      type="file" 
                      onChange={(e) => setSelectedFile(e.target.files[0])} 
                      className="px-4 py-2 border-2 rounded-lg"
                    />
                  </div>
                  <button type="button" onClick={uploadDocument} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
                    آپلود فایل
                  </button>
                </div>

                <div className="space-y-2">
                  {personDocuments.map(doc => (
                    <div key={doc.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                      <button type="button" onClick={() => removeDocument(doc.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                      <div className="text-right">
                        <span className="font-semibold text-red-700">{doc.documentType}:</span> <span className="text-gray-700">{doc.fileName}</span>
                      </div>
                    </div>
                  ))}
                  {personDocuments.length === 0 && <p className="text-gray-500 text-right text-sm">مدرکی آپلود نشده است</p>}
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <label className="block text-right mb-2 font-semibold">یادداشت</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" rows={3} placeholder="یادداشت‌های اضافی..." />
            </div>

            <div className="flex gap-3 mt-6 justify-end border-t pt-6">
              <button type="button" onClick={() => setCurrentScreen('persons')} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition">
                انصراف
              </button>
              <button type="button" onClick={submit} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition">
                <Save size={20} /> ذخیره
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== ORGANIZATIONS LIST ====================
  const OrganizationsList = () => {
    const filtered = organizations.filter((o) => {
      if (!searchText) return true;
      return (o.name || '').includes(searchText) || (o.city || '').includes(searchText);
    });

    const remove = async (id) => {
      if (!window.confirm('حذف شود؟')) return;
      try {
        await api.delete(`/organizations/${id}`);
        await loadAllData();
        notify('حذف شد');
      } catch { notify('خطا', 'error'); }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <Notif />
        <div className="bg-white shadow-md border-b mb-6">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => setCurrentScreen('dashboard')} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <ChevronLeft size={20} /> بازگشت
            </button>
            <h1 className="text-2xl font-bold">سازمان‌ها ({organizations.length})</h1>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="flex gap-3">
              <button onClick={() => { setSelectedOrg(null); setCurrentScreen('org-form'); }} className="bg-purple-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                <Plus size={20} /> سازمان جدید
              </button>
              <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="جستجو..." className="flex-1 px-4 py-3 border-2 rounded-lg text-right" />
              <button onClick={() => setSearchText('')} className="bg-gray-500 text-white px-4 py-3 rounded-lg"><X size={20} /></button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr className="text-right">
                  <th className="px-4 py-4">نام سازمان</th>
                  <th className="px-4 py-4">نوع</th>
                  <th className="px-4 py-4">شهر</th>
                  <th className="px-4 py-4">کشور</th>
                  <th className="px-4 py-4">تماس</th>
                  <th className="px-4 py-4">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">{organizations.length === 0 ? 'سازمانی ثبت نشده' : 'نتیجه‌ای یافت نشد'}</td></tr>
                ) : (
                  filtered.map((o) => (
                    <tr key={o.id} className="border-t hover:bg-purple-50">
                      <td className="px-4 py-4 text-right font-semibold">{o.name}</td>
                      <td className="px-4 py-4 text-right">{o.type || '-'}</td>
                      <td className="px-4 py-4 text-right">{o.city || '-'}</td>
                      <td className="px-4 py-4 text-right">{o.country || '-'}</td>
                      <td className="px-4 py-4 text-right">{o.phone || '-'}</td>
                      <td className="px-4 py-4">
                        <button onClick={() => { setSelectedOrg(o); setCurrentScreen('org-form'); }} className="text-purple-500 p-2"><Edit size={18} /></button>
                        <button onClick={() => remove(o.id)} className="text-red-500 p-2"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ==================== ORGANIZATION FORM ====================
  const OrganizationForm = () => {
    const [form, setForm] = useState(selectedOrg || {
      name: '', type: '', nationalId: '', country: 'ایران', city: '', address: '', phone: '', website: '', notes: ''
    });

    const submit = async () => {
      if (!form.name) {
        notify('نام سازمان الزامی است', 'error');
        return;
      }
      try {
        if (selectedOrg) {
          await api.put(`/organizations/${form.id}`, form);
        } else {
          await api.post('/organizations', form);
        }
        await loadAllData();
        notify('ذخیره شد');
        setCurrentScreen('organizations');
      } catch { notify('خطا', 'error'); }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <Notif />
        <div className="bg-white shadow-md border-b mb-6">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => setCurrentScreen('organizations')} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <ChevronLeft size={20} /> بازگشت
            </button>
            <h1 className="text-2xl font-bold">{selectedOrg ? 'ویرایش سازمان' : 'سازمان جدید'}</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl pb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-right mb-2 font-semibold">نام سازمان *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
              </div>
              <div>
                <label className="block text-right mb-2 font-semibold">نوع</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right">
                  <option value="">انتخاب</option>
                  <option value="دانشگاه">دانشگاه</option>
                  <option value="مؤسسه">مؤسسه</option>
                  <option value="NGO">NGO</option>
                  <option value="شرکت">شرکت</option>
                  <option value="دولتی">دولتی</option>
                </select>
              </div>
              <div>
                <label className="block text-right mb-2 font-semibold">شناسه ملی</label>
                <input type="text" value={form.nationalId} onChange={(e) => setForm({ ...form, nationalId: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
              </div>
              <div>
                <label className="block text-right mb-2 font-semibold">کشور</label>
                <input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
              </div>
              <div>
                <label className="block text-right mb-2 font-semibold">شهر</label>
                <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
              </div>
              <div className="col-span-2">
                <label className="block text-right mb-2 font-semibold">آدرس</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
              </div>
              <div>
                <label className="block text-right mb-2 font-semibold">تلفن</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
              </div>
              <div>
                <label className="block text-right mb-2 font-semibold">وب‌سایت</label>
                <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
              </div>
              <div className="col-span-2">
                <label className="block text-right mb-2 font-semibold">یادداشت</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" rows={3} />
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setCurrentScreen('organizations')} className="bg-gray-500 text-white px-6 py-3 rounded-lg">انصراف</button>
              <button onClick={submit} className="bg-purple-500 text-white px-6 py-3 rounded-lg flex items-center gap-2"><Save size={20} /> ذخیره</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== EVENTS LIST ====================
  const EventsList = () => {
    const filtered = events.filter((e) => {
      if (!searchText) return true;
      return (e.title || '').includes(searchText) || (e.location || '').includes(searchText);
    });

    const remove = async (id) => {
      if (!window.confirm('حذف شود؟')) return;
      try {
        await api.delete(`/events/${id}`);
        await loadAllData();
        notify('حذف شد');
      } catch { notify('خطا', 'error'); }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <Notif />
        <div className="bg-white shadow-md border-b mb-6">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => setCurrentScreen('dashboard')} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <ChevronLeft size={20} /> بازگشت
            </button>
            <h1 className="text-2xl font-bold">رویدادها ({events.length})</h1>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="flex gap-3">
              <button onClick={() => { setSelectedEvent(null); setCurrentScreen('event-form'); }} className="bg-green-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                <Plus size={20} /> رویداد جدید
              </button>
              <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="جستجو..." className="flex-1 px-4 py-3 border-2 rounded-lg text-right" />
              <button onClick={() => setSearchText('')} className="bg-gray-500 text-white px-4 py-3 rounded-lg"><X size={20} /></button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr className="text-right">
                  <th className="px-4 py-4">عنوان</th>
                  <th className="px-4 py-4">نوع</th>
                  <th className="px-4 py-4">برگزارکننده</th>
                  <th className="px-4 py-4">تاریخ شروع</th>
                  <th className="px-4 py-4">محل</th>
                  <th className="px-4 py-4">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">{events.length === 0 ? 'رویدادی ثبت نشده' : 'نتیجه‌ای یافت نشد'}</td></tr>
                ) : (
                  filtered.map((e) => (
                    <tr key={e.id} className="border-t hover:bg-green-50">
                      <td className="px-4 py-4 text-right font-semibold">{e.title}</td>
                      <td className="px-4 py-4 text-right">{e.type || '-'}</td>
                      <td className="px-4 py-4 text-right">{e.organizer || '-'}</td>
                      <td className="px-4 py-4 text-right">{e.startDate || '-'}</td>
                      <td className="px-4 py-4 text-right">{e.location || '-'}</td>
                      <td className="px-4 py-4">
                        <button onClick={() => { setSelectedEvent(e); setCurrentScreen('event-form'); }} className="text-green-500 p-2"><Edit size={18} /></button>
                        <button onClick={() => remove(e.id)} className="text-red-500 p-2"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ==================== EVENT FORM (ADVANCED) ====================
  const EventForm = () => {
    const [form, setForm] = useState(selectedEvent || {
      title: '', type: '', organizer: '', startDate: '', endDate: '', location: '', capacity: '', description: ''
    });

    const [eventOrgCollabs, setEventOrgCollabs] = useState([]);
    const [eventPersonCollabs, setEventPersonCollabs] = useState([]);
    const [eventParticipants, setEventParticipants] = useState([]);

    const [showOrgCollabForm, setShowOrgCollabForm] = useState(false);
    const [orgCollabId, setOrgCollabId] = useState('');

    const [showPersonCollabForm, setShowPersonCollabForm] = useState(false);
    const [personCollabForm, setPersonCollabForm] = useState({ personId: '', role: '' });

    const [showParticipantForm, setShowParticipantForm] = useState(false);
    const [participantForm, setParticipantForm] = useState({ firstName: '', lastName: '', mobile: '', position: '' });

    useEffect(() => {
      if (selectedEvent) {
        setForm(selectedEvent);
        loadEventDetails(selectedEvent.id);
      }
    }, [selectedEvent]);

    const loadEventDetails = async (eventId) => {
      try {
        const [orgCollabs, personCollabs, participants] = await Promise.all([
          api.get(`/events/${eventId}/org-collaborators`),
          api.get(`/events/${eventId}/person-collaborators`),
          api.get(`/events/${eventId}/participants`)
        ]);
        setEventOrgCollabs(orgCollabs);
        setEventPersonCollabs(personCollabs);
        setEventParticipants(participants);
      } catch (error) {
        console.error('Error loading event details:', error);
      }
    };

    const addOrgCollab = async () => {
      if (!orgCollabId) {
        notify('لطفاً سازمان را انتخاب کنید', 'error');
        return;
      }

      const org = organizations.find(o => o.id === parseInt(orgCollabId));
      if (!org) return;

      if (selectedEvent) {
        try {
          await api.post(`/events/${selectedEvent.id}/org-collaborators`, {
            organizationId: org.id,
            organizationName: org.name
          });
          await loadEventDetails(selectedEvent.id);
          setOrgCollabId('');
          setShowOrgCollabForm(false);
          notify('همکار سازمانی اضافه شد');
        } catch { notify('خطا', 'error'); }
      } else {
        setEventOrgCollabs([...eventOrgCollabs, { id: Date.now(), organizationId: org.id, organizationName: org.name }]);
        setOrgCollabId('');
        setShowOrgCollabForm(false);
      }
    };

    const removeOrgCollab = async (collabId) => {
      if (selectedEvent) {
        try {
          await api.delete(`/events/${selectedEvent.id}/org-collaborators/${collabId}`);
          await loadEventDetails(selectedEvent.id);
          notify('حذف شد');
        } catch { notify('خطا', 'error'); }
      } else {
        setEventOrgCollabs(eventOrgCollabs.filter(c => c.id !== collabId));
      }
    };

    const addPersonCollab = async () => {
      if (!personCollabForm.personId || !personCollabForm.role) {
        notify('شخص و نقش الزامی است', 'error');
        return;
      }

      const person = persons.find(p => p.id === parseInt(personCollabForm.personId));
      if (!person) return;

      if (selectedEvent) {
        try {
          await api.post(`/events/${selectedEvent.id}/person-collaborators`, {
            personId: person.id,
            personName: `${person.firstName} ${person.lastName}`,
            role: personCollabForm.role
          });
          await loadEventDetails(selectedEvent.id);
          setPersonCollabForm({ personId: '', role: '' });
          setShowPersonCollabForm(false);
          notify('همکار حقیقی اضافه شد');
        } catch { notify('خطا', 'error'); }
      } else {
        setEventPersonCollabs([...eventPersonCollabs, {
          id: Date.now(),
          personId: person.id,
          personName: `${person.firstName} ${person.lastName}`,
          role: personCollabForm.role
        }]);
        setPersonCollabForm({ personId: '', role: '' });
        setShowPersonCollabForm(false);
      }
    };

    const removePersonCollab = async (collabId) => {
      if (selectedEvent) {
        try {
          await api.delete(`/events/${selectedEvent.id}/person-collaborators/${collabId}`);
          await loadEventDetails(selectedEvent.id);
          notify('حذف شد');
        } catch { notify('خطا', 'error'); }
      } else {
        setEventPersonCollabs(eventPersonCollabs.filter(c => c.id !== collabId));
      }
    };

    const addParticipant = async () => {
      if (!participantForm.firstName || !participantForm.lastName) {
        notify('نام و نام خانوادگی الزامی است', 'error');
        return;
      }

      if (selectedEvent) {
        try {
          await api.post(`/events/${selectedEvent.id}/participants`, participantForm);
          await loadEventDetails(selectedEvent.id);
          setParticipantForm({ firstName: '', lastName: '', mobile: '', position: '' });
          setShowParticipantForm(false);
          notify('شرکت‌کننده اضافه شد');
        } catch { notify('خطا', 'error'); }
      } else {
        setEventParticipants([...eventParticipants, { ...participantForm, id: Date.now() }]);
        setParticipantForm({ firstName: '', lastName: '', mobile: '', position: '' });
        setShowParticipantForm(false);
      }
    };

    const removeParticipant = async (participantId) => {
      if (selectedEvent) {
        try {
          await api.delete(`/events/${selectedEvent.id}/participants/${participantId}`);
          await loadEventDetails(selectedEvent.id);
          notify('حذف شد');
        } catch { notify('خطا', 'error'); }
      } else {
        setEventParticipants(eventParticipants.filter(p => p.id !== participantId));
      }
    };

    const submit = async () => {
      if (!form.title) {
        notify('عنوان الزامی است', 'error');
        return;
      }

      try {
        if (selectedEvent) {
          await api.put(`/events/${form.id}`, form);
          notify('به‌روز شد');
        } else {
          const result = await api.post('/events', form);
          const newEventId = result.id;
          
          for (const collab of eventOrgCollabs) {
            await api.post(`/events/${newEventId}/org-collaborators`, collab);
          }
          
          for (const collab of eventPersonCollabs) {
            await api.post(`/events/${newEventId}/person-collaborators`, collab);
          }
          
          for (const participant of eventParticipants) {
            await api.post(`/events/${newEventId}/participants`, participant);
          }
          
          notify('ثبت شد');
        }
        
        await loadAllData();
        setCurrentScreen('events');
      } catch (error) { 
        console.error('Submit error:', error);
        notify('خطا در ذخیره', 'error'); 
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <Notif />
        <div className="bg-white shadow-md border-b mb-6">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => setCurrentScreen('events')} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <ChevronLeft size={20} /> بازگشت
            </button>
            <h1 className="text-2xl font-bold">{selectedEvent ? 'ویرایش رویداد' : 'رویداد جدید'}</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl pb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            
            <div className="mb-8">
              <h3 className="text-lg font-bold text-right mb-4 text-green-600 border-b pb-2">اطلاعات پایه</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-right mb-2 font-semibold">عنوان *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
                </div>
                <div>
                  <label className="block text-right mb-2 font-semibold">نوع</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right">
                    <option value="">انتخاب</option>
                    <option value="کارگاه">کارگاه</option>
                    <option value="همایش">همایش</option>
                    <option value="کنفرانس">کنفرانس</option>
                    <option value="سمینار">سمینار</option>
                    <option value="جلسه هیات مدیره">جلسه هیات مدیره</option>
                    <option value="جلسه داخلی">جلسه داخلی</option>
                  </select>
                </div>
                <div>
                  <label className="block text-right mb-2 font-semibold">برگزارکننده</label>
                  <input type="text" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
                </div>
                <div>
                  <label className="block text-right mb-2 font-semibold">تاریخ شروع</label>
                  <input type="text" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} placeholder="1403/09/15" className="w-full px-4 py-3 border-2 rounded-lg text-right" />
                </div>
                <div>
                  <label className="block text-right mb-2 font-semibold">تاریخ پایان</label>
                  <input type="text" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} placeholder="1403/09/20" className="w-full px-4 py-3 border-2 rounded-lg text-right" />
                </div>
                <div>
                  <label className="block text-right mb-2 font-semibold">محل</label>
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
                </div>
                <div>
                  <label className="block text-right mb-2 font-semibold">ظرفیت</label>
                  <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
                </div>
                <div className="col-span-2">
                  <label className="block text-right mb-2 font-semibold">توضیحات</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" rows={3} />
                </div>
              </div>
            </div>

            <div className="mb-8 border-t pt-6">
              <h3 className="text-lg font-bold text-right mb-4 text-blue-600 border-b pb-2">همکاران سازمانی</h3>
              
              <div className="mb-4">
                <button type="button" onClick={() => setShowOrgCollabForm(!showOrgCollabForm)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
                  {showOrgCollabForm ? 'بستن فرم' : '+ اضافه کردن سازمان همکار'}
                </button>
              </div>

              {showOrgCollabForm && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4 border-2 border-blue-200">
                  <select value={orgCollabId} onChange={(e) => setOrgCollabId(e.target.value)} className="w-full px-4 py-2 border-2 rounded-lg text-right mb-3">
                    <option value="">انتخاب سازمان</option>
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                  <button type="button" onClick={addOrgCollab} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                    افزودن
                  </button>
                </div>
              )}

              <div className="space-y-2">
                {eventOrgCollabs.map(collab => (
                  <div key={collab.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                    <button type="button" onClick={() => removeOrgCollab(collab.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                    <div className="text-right">
                      <span className="font-semibold text-blue-700">{collab.organizationName}</span>
                    </div>
                  </div>
                ))}
                {eventOrgCollabs.length === 0 && <p className="text-gray-500 text-right text-sm">سازمان همکاری ثبت نشده است</p>}
              </div>
            </div>

            <div className="mb-8 border-t pt-6">
              <h3 className="text-lg font-bold text-right mb-4 text-purple-600 border-b pb-2">همکاران حقیقی</h3>
              
              <div className="mb-4">
                <button type="button" onClick={() => setShowPersonCollabForm(!showPersonCollabForm)} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition">
                  {showPersonCollabForm ? 'بستن فرم' : '+ اضافه کردن همکار حقیقی'}
                </button>
              </div>

              {showPersonCollabForm && (
                <div className="bg-purple-50 p-4 rounded-lg mb-4 border-2 border-purple-200">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select value={personCollabForm.personId} onChange={(e) => setPersonCollabForm({ ...personCollabForm, personId: e.target.value })} className="px-4 py-2 border-2 rounded-lg text-right">
                      <option value="">انتخاب شخص</option>
                      {persons.map(p => (
                        <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                      ))}
                    </select>
                    <select value={personCollabForm.role} onChange={(e) => setPersonCollabForm({ ...personCollabForm, role: e.target.value })} className="px-4 py-2 border-2 rounded-lg text-right">
                      <option value="">نقش</option>
                      <option value="همکار اجرایی">همکار اجرایی</option>
                      <option value="هماهنگ‌کننده">هماهنگ‌کننده</option>
                      <option value="سرمایه‌گذار">سرمایه‌گذار</option>
                    </select>
                  </div>
                  <button type="button" onClick={addPersonCollab} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">
                    افزودن
                  </button>
                </div>
              )}

              <div className="space-y-2">
                {eventPersonCollabs.map(collab => (
                  <div key={collab.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                    <button type="button" onClick={() => removePersonCollab(collab.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                    <div className="text-right">
                      <p className="font-semibold text-purple-700">{collab.personName}</p>
                      <p className="text-sm text-gray-600">{collab.role}</p>
                    </div>
                  </div>
                ))}
                {eventPersonCollabs.length === 0 && <p className="text-gray-500 text-right text-sm">همکار حقیقی ثبت نشده است</p>}
              </div>
            </div>

            <div className="mb-8 border-t pt-6">
              <h3 className="text-lg font-bold text-right mb-4 text-orange-600 border-b pb-2">شرکت‌کنندگان</h3>
              
              <div className="mb-4">
                <button type="button" onClick={() => setShowParticipantForm(!showParticipantForm)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition">
                  {showParticipantForm ? 'بستن فرم' : '+ اضافه کردن شرکت‌کننده'}
                </button>
              </div>

              {showParticipantForm && (
                <div className="bg-orange-50 p-4 rounded-lg mb-4 border-2 border-orange-200">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input 
                      type="text" 
                      value={participantForm.firstName} 
                      onChange={(e) => setParticipantForm({ ...participantForm, firstName: e.target.value })} 
                      placeholder="نام"
                      className="px-4 py-2 border-2 rounded-lg text-right"
                    />
                    <input 
                      type="text" 
                      value={participantForm.lastName} 
                      onChange={(e) => setParticipantForm({ ...participantForm, lastName: e.target.value })} 
                      placeholder="نام خانوادگی"
                      className="px-4 py-2 border-2 rounded-lg text-right"
                    />
                    <input 
                      type="text" 
                      value={participantForm.mobile} 
                      onChange={(e) => setParticipantForm({ ...participantForm, mobile: e.target.value })} 
                      placeholder="شماره موبایل"
                      className="px-4 py-2 border-2 rounded-lg text-right"
                    />
                    <input 
                      type="text" 
                      value={participantForm.position} 
                      onChange={(e) => setParticipantForm({ ...participantForm, position: e.target.value })} 
                      placeholder="سمت"
                      className="px-4 py-2 border-2 rounded-lg text-right"
                    />
                  </div>
                  <button type="button" onClick={addParticipant} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition">
                    افزودن
                  </button>
                </div>
              )}

              <div className="space-y-2">
                {eventParticipants.map(participant => (
                  <div key={participant.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                    <button type="button" onClick={() => removeParticipant(participant.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                    <div className="text-right">
                      <p className="font-semibold text-orange-700">{participant.firstName} {participant.lastName}</p>
                      <p className="text-sm text-gray-600">{participant.mobile} {participant.position && `- ${participant.position}`}</p>
                    </div>
                  </div>
                ))}
                {eventParticipants.length === 0 && <p className="text-gray-500 text-right text-sm">شرکت‌کننده‌ای ثبت نشده است</p>}
              </div>
            </div>

            <div className="flex gap-3 mt-6 justify-end border-t pt-6">
              <button type="button" onClick={() => setCurrentScreen('events')} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition">
                انصراف
              </button>
              <button type="button" onClick={submit} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition">
                <Save size={20} /> ذخیره
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== APPLICATIONS LIST ====================
  const ApplicationsList = () => {
    const filtered = applications.filter((a) => {
      if (filterStatus !== 'all' && a.status !== filterStatus) return false;
      if (!searchText) return true;
      return (a.applicantName || '').includes(searchText) || (a.requestType || '').includes(searchText);
    });

    const remove = async (id) => {
      if (!window.confirm('حذف شود؟')) return;
      try {
        await api.delete(`/applications/${id}`);
        await loadAllData();
        notify('حذف شد');
      } catch { notify('خطا', 'error'); }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <Notif />
        <div className="bg-white shadow-md border-b mb-6">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => setCurrentScreen('dashboard')} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <ChevronLeft size={20} /> بازگشت
            </button>
            <h1 className="text-2xl font-bold">درخواست‌ها ({applications.length})</h1>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="flex gap-3 mb-3">
              <button onClick={() => { setSelectedApp(null); setCurrentScreen('app-form'); }} className="bg-orange-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                <Plus size={20} /> درخواست جدید
              </button>
              <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="جستجو..." className="flex-1 px-4 py-3 border-2 rounded-lg text-right" />
            </div>
            <div className="flex gap-3">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border-2 rounded-lg text-right">
                <option value="all">همه وضعیت‌ها</option>
                <option value="در انتظار">در انتظار</option>
                <option value="پذیرفته">پذیرفته</option>
                <option value="رد شده">رد شده</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr className="text-right">
                  <th className="px-4 py-4">متقاضی</th>
                  <th className="px-4 py-4">نوع</th>
                  <th className="px-4 py-4">رشته</th>
                  <th className="px-4 py-4">تاریخ</th>
                  <th className="px-4 py-4">وضعیت</th>
                  <th className="px-4 py-4">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">{applications.length === 0 ? 'درخواستی ثبت نشده' : 'نتیجه‌ای یافت نشد'}</td></tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a.id} className="border-t hover:bg-orange-50">
                      <td className="px-4 py-4 text-right font-semibold">{a.applicantName}</td>
                      <td className="px-4 py-4 text-right">{a.requestType}</td>
                      <td className="px-4 py-4 text-right">{a.field}</td>
                      <td className="px-4 py-4 text-right">{a.submitDate}</td>
                      <td className="px-4 py-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-xs ${a.status === 'پذیرفته' ? 'bg-green-100 text-green-700' : a.status === 'رد شده' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button onClick={() => { setSelectedApp(a); setCurrentScreen('app-form'); }} className="text-orange-500 p-2"><Edit size={18} /></button>
                        <button onClick={() => remove(a.id)} className="text-red-500 p-2"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ==================== APPLICATION FORM ====================
  const ApplicationForm = () => {
    const [form, setForm] = useState(selectedApp || {
      applicantId: '', applicantName: '', requestType: '', field: '', submitDate: '', status: 'در انتظار', score: '', notes: ''
    });

    const submit = async () => {
      if (!form.applicantName || !form.requestType) {
        notify('متقاضی و نوع درخواست الزامی است', 'error');
        return;
      }
      try {
        if (selectedApp) {
          await api.put(`/applications/${form.id}`, form);
        } else {
          await api.post('/applications', form);
        }
        await loadAllData();
        notify('ذخیره شد');
        setCurrentScreen('applications');
      } catch { notify('خطا', 'error'); }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <Notif />
        <div className="bg-white shadow-md border-b mb-6">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => setCurrentScreen('applications')} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <ChevronLeft size={20} /> بازگشت
            </button>
            <h1 className="text-2xl font-bold">{selectedApp ? 'ویرایش درخواست' : 'درخواست جدید'}</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl pb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-right mb-2 font-semibold">متقاضی *</label>
                <select value={form.applicantId} onChange={(e) => {
                  const person = persons.find(p => p.id === parseInt(e.target.value));
                  setForm({ ...form, applicantId: e.target.value, applicantName: person ? `${person.firstName} ${person.lastName}` : '' });
                }} className="w-full px-4 py-3 border-2 rounded-lg text-right">
                  <option value="">انتخاب</option>
                  {persons.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-right mb-2 font-semibold">نوع درخواست *</label>
                <select value={form.requestType} onChange={(e) => setForm({ ...form, requestType: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right">
                  <option value="">انتخاب</option>
                  <option value="فرصت مطالعاتی">فرصت مطالعاتی</option>
                  <option value="بورسیه">بورسیه</option>
                  <option value="جایزه">جایزه</option>
                  <option value="حمایت">حمایت</option>
                </select>
              </div>
              <div>
                <label className="block text-right mb-2 font-semibold">رشته</label>
                <input type="text" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
              </div>
              <div>
                <label className="block text-right mb-2 font-semibold">تاریخ</label>
                <input type="text" value={form.submitDate} onChange={(e) => setForm({ ...form, submitDate: e.target.value })} placeholder="1403/09/15" className="w-full px-4 py-3 border-2 rounded-lg text-right" />
              </div>
              <div>
                <label className="block text-right mb-2 font-semibold">وضعیت</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right">
                  <option value="در انتظار">در انتظار</option>
                  <option value="پذیرفته">پذیرفته</option>
                  <option value="رد شده">رد شده</option>
                </select>
              </div>
              <div>
                <label className="block text-right mb-2 font-semibold">امتیاز</label>
                <input type="number" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
              </div>
              <div className="col-span-2">
                <label className="block text-right mb-2 font-semibold">یادداشت</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" rows={3} />
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setCurrentScreen('applications')} className="bg-gray-500 text-white px-6 py-3 rounded-lg">انصراف</button>
              <button onClick={submit} className="bg-orange-500 text-white px-6 py-3 rounded-lg flex items-center gap-2"><Save size={20} /> ذخیره</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== PAYMENTS LIST ====================
  const PaymentsList = () => {
    const filtered = payments.filter((p) => {
      if (!searchText) return true;
      return (p.title || '').includes(searchText) || (p.paymentType || '').includes(searchText);
    });

    const remove = async (id) => {
      if (!window.confirm('حذف شود؟')) return;
      try {
        await api.delete(`/payments/${id}`);
        await loadAllData();
        notify('حذف شد');
      } catch { notify('خطا', 'error'); }
    };

    const totalAmount = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

    return (
      <div className="min-h-screen bg-gray-50">
        <Notif />
        <div className="bg-white shadow-md border-b mb-6">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => setCurrentScreen('dashboard')} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <ChevronLeft size={20} /> بازگشت
            </button>
            <h1 className="text-2xl font-bold">پرداخت‌ها ({payments.length})</h1>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="flex gap-3 justify-between items-center">
              <button onClick={() => { setSelectedPayment(null); setCurrentScreen('payment-form'); }} className="bg-red-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                <Plus size={20} /> پرداخت جدید
              </button>
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg">
                <p className="text-sm">مجموع</p>
                <p className="text-2xl font-bold">{totalAmount.toLocaleString('fa-IR')} تومان</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr className="text-right">
                  <th className="px-4 py-4">عنوان</th>
                  <th className="px-4 py-4">نوع</th>
                  <th className="px-4 py-4">مبلغ</th>
                  <th className="px-4 py-4">تاریخ</th>
                  <th className="px-4 py-4">وضعیت</th>
                  <th className="px-4 py-4">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">{payments.length === 0 ? 'پرداختی ثبت نشده' : 'نتیجه‌ای یافت نشد'}</td></tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-red-50">
                      <td className="px-4 py-4 text-right font-semibold">{p.title}</td>
                      <td className="px-4 py-4 text-right">{p.paymentType}</td>
                      <td className="px-4 py-4 text-right font-bold text-red-600">{(parseFloat(p.amount) || 0).toLocaleString('fa-IR')}</td>
                      <td className="px-4 py-4 text-right">{p.paymentDate}</td>
                      <td className="px-4 py-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-xs ${p.status === 'پرداخت شده' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button onClick={() => { setSelectedPayment(p); setCurrentScreen('payment-form'); }} className="text-red-500 p-2"><Edit size={18} /></button>
                        <button onClick={() => remove(p.id)} className="text-red-500 p-2"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ==================== PAYMENT FORM ====================
  const PaymentForm = () => {
    const [form, setForm] = useState(selectedPayment || {
      title: '', paymentCategory: '', paymentType: '', paymentDate: '', amount: '', method: '', status: 'برنامه‌ریزی شده', notes: ''
    });

    const submit = async () => {
      if (!form.title || !form.amount) {
        notify('عنوان و مبلغ الزامی است', 'error');
        return;
      }
      try {
        if (selectedPayment) {
          await api.put(`/payments/${form.id}`, form);
        } else {
          await api.post('/payments', form);
        }
        await loadAllData();
        notify('ذخیره شد');
        setCurrentScreen('payments');
      } catch { notify('خطا', 'error'); }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <Notif />
        <div className="bg-white shadow-md border-b mb-6">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => setCurrentScreen('payments')} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <ChevronLeft size={20} /> بازگشت
            </button>
            <h1 className="text-2xl font-bold">{selectedPayment ? 'ویرایش پرداخت' : 'پرداخت جدید'}</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl pb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-right mb-2 font-semibold">عنوان *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
              </div>
              <div>
                <label className="block text-right mb-2 font-semibold">نوع پرداخت</label>
                <select value={form.paymentType} onChange={(e) => setForm({ ...form, paymentType: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right">
                  <option value="">انتخاب</option>
                  <option value="حق‌التدریس">حق‌التدریس</option>
                  <option value="کمک هزینه">کمک هزینه</option>
                  <option value="جایزه">جایزه</option>
                  <option value="هزینه سفر">هزینه سفر</option>
                </select>
              </div>
              <div>
                <label className="block text-right mb-2 font-semibold">تاریخ</label>
                <input type="text" value={form.paymentDate} onChange={(e) => setForm({ ...form, paymentDate: e.target.value })} placeholder="1403/09/15" className="w-full px-4 py-3 border-2 rounded-lg text-right" />
              </div>
              <div>
                <label className="block text-right mb-2 font-semibold">مبلغ (تومان) *</label>
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" />
              </div>
              <div>
                <label className="block text-right mb-2 font-semibold">روش پرداخت</label>
                <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right">
                  <option value="">انتخاب</option>
                  <option value="نقد">نقد</option>
                  <option value="کارت به کارت">کارت به کارت</option>
                  <option value="حواله">حواله</option>
                  <option value="چک">چک</option>
                </select>
              </div>
              <div>
                <label className="block text-right mb-2 font-semibold">وضعیت</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right">
                  <option value="برنامه‌ریزی شده">برنامه‌ریزی شده</option>
                  <option value="پرداخت شده">پرداخت شده</option>
                  <option value="لغو شده">لغو شده</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-right mb-2 font-semibold">یادداشت</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-4 py-3 border-2 rounded-lg text-right" rows={3} />
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setCurrentScreen('payments')} className="bg-gray-500 text-white px-6 py-3 rounded-lg">انصراف</button>
              <button onClick={submit} className="bg-red-500 text-white px-6 py-3 rounded-lg flex items-center gap-2"><Save size={20} /> ذخیره</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== REPORTS ====================
  const Reports = () => {
    const stats = {
      persons: persons.length,
      orgs: organizations.length,
      events: events.length,
      apps: applications.length,
      payments: payments.length,
      totalAmount: payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0),
      pending: applications.filter(a => a.status === 'در انتظار').length,
      accepted: applications.filter(a => a.status === 'پذیرفته').length
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <Notif />
        <div className="bg-white shadow-md border-b mb-6">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <button onClick={() => setCurrentScreen('dashboard')} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <ChevronLeft size={20} /> بازگشت
            </button>
            <h1 className="text-2xl font-bold">گزارش‌ها و آمار</h1>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <Users size={40} className="mb-3" />
              <p className="text-sm mb-1">کل اشخاص</p>
              <p className="text-4xl font-bold">{stats.persons}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <Building2 size={40} className="mb-3" />
              <p className="text-sm mb-1">سازمان‌ها</p>
              <p className="text-4xl font-bold">{stats.orgs}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <Calendar size={40} className="mb-3" />
              <p className="text-sm mb-1">رویدادها</p>
              <p className="text-4xl font-bold">{stats.events}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
              <FileText size={40} className="mb-3" />
              <p className="text-sm mb-1">کل درخواست‌ها</p>
              <p className="text-4xl font-bold">{stats.apps}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
              <AlertCircle size={40} className="mb-3" />
              <p className="text-sm mb-1">در انتظار بررسی</p>
              <p className="text-4xl font-bold">{stats.pending}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <DollarSign size={40} className="mb-3" />
              <p className="text-sm mb-1">مجموع پرداخت‌ها</p>
              <p className="text-2xl font-bold">{stats.totalAmount.toLocaleString('fa-IR')} تومان</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-right">خلاصه سیستم</h3>
            <div className="space-y-2 text-right">
              <p className="text-gray-700">✅ سیستم کامل با 6 بخش اصلی</p>
              <p className="text-gray-700">✅ {stats.persons + stats.orgs + stats.events + stats.apps + stats.payments} رکورد کل</p>
              <p className="text-gray-700">✅ {stats.accepted} درخواست پذیرفته شده</p>
              <p className="text-gray-700">✅ ذخیره‌سازی دائمی داده‌ها</p>
              <p className="text-gray-700">✅ آماده تحویل به کارفرما</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const screens = {
    login: <Login />,
    dashboard: <Dashboard />,
    persons: <PersonsList />,
    'person-form': <PersonForm />,
    organizations: <OrganizationsList />,
    'org-form': <OrganizationForm />,
    events: <EventsList />,
    'event-form': <EventForm />,
    applications: <ApplicationsList />,
    'app-form': <ApplicationForm />,
    payments: <PaymentsList />,
    'payment-form': <PaymentForm />,
    reports: <Reports />
  };

  return screens[currentScreen] || <Login />;
};

export default HaameeFinal;
