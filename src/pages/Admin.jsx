import { useState, useCallback, useMemo, useEffect } from 'react';
import { createSecondaryUser } from '../firebase/AuthService';
import { subscribeToUsers, updateUser, updateUserStatus } from '../firebase/UserService';
import UserForm from '../components/admin/UserForm';
import UserTable from '../components/admin/UserTable';
import Footer from '../components/home/Footer';
import Filter from '../components/admin/Filter';
import Header from '../components/admin/Header';
import Swal from 'sweetalert2';
import { Users, UserCheck, UserX } from "lucide-react";


const SummaryCard = ({ title, value, color, icon: Icon }) => (
  <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 flex items-center space-x-5 shadow-lg">
    <div className={`w-12 h-12 rounded-2xl ${color}/10 flex items-center justify-center`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
        {title}
      </span>
      <span className="text-2xl font-black text-white">{value}</span>
    </div>
  </div>
);


const Admin = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    role: 'user',
    status: 'active'
  });
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [quickSearch, setQuickSearch] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
    emailDomain: '',
    phonePrefix: ''
  });
  const [loading, setLoading] = useState(false);

  // FETCH USERS FROM FIRESTORE
  useEffect(() => {
    const unsub = subscribeToUsers(
      (list) => {
        setUsers(list);
      },
      (error) => {
        console.error("Error fetching users:", error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi tải dữ liệu',
          text: 'Không thể tải danh sách người dùng. ' + (error.code === 'permission-denied' ? 'Bạn không có quyền truy cập.' : error.message),
          footer: 'Kiểm tra lại Rules trong Firestore hoặc tài khoản đăng nhập.'
        });
      }
    );
    return () => unsub();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const search = quickSearch.toLowerCase();
      
      // EXCLUDE Admins from the table
      if (user.role === 'admin') return false;

      // Handle potential undefined fields
      const uName = (user.username || user.displayName || '').toLowerCase();
      const uEmail = (user.email || '').toLowerCase();
      
      if (
        !uName.includes(search) &&
        !uEmail.includes(search)
      ) return false;

      if (activeFilters.status !== 'all' && user.status !== activeFilters.status) return false;
      if (activeFilters.emailDomain && !uEmail.includes(activeFilters.emailDomain.toLowerCase())) return false;
      
      return true;
    });
  }, [users, quickSearch, activeFilters]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status !== 'locked').length,
    locked: users.filter(u => u.status === 'locked').length
  }), [users]);

  const resetForm = useCallback(() => {
    setFormData({ 
        username: '', 
        password: '', 
        email: '',
        fullName: '',
        role: 'user',
        status: 'active'
    });
    setSelectedUserId(null);
  }, []);

  useEffect(() => {
      if (!selectedUserId) {
          setFormData(prev => ({ ...prev, password: prev.password || '' }));
      }
  }, [selectedUserId]);

  const handleAction = async (type) => {
    try {
        switch (type) {
        case 'add':
            if (!formData.username || !formData.email || !formData.password) return Swal.fire('Error', 'Thiếu dữ liệu (Cần Username, Email, Password)', 'error');
            
            setLoading(true);
            try {
                await createSecondaryUser(formData.email, formData.password, formData.username);
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Đã tạo tài khoản người dùng mới!',
                    timer: 2000,
                    showConfirmButton: false
                });
                resetForm();
            } catch (error) {
                console.error("Create User Error:", error);
                const errorMap = {
                    'auth/email-already-in-use': 'Email này đã được sử dụng bởi một tài khoản khác.',
                    'auth/weak-password': 'Mật khẩu quá yếu. Vui lòng nhập ít nhất 6 ký tự.',
                    'auth/invalid-email': 'Địa chỉ email không hợp lệ.',
                    'auth/operation-not-allowed': 'Tính năng đăng ký tài khoản hiện đang bị khóa.',
                    'auth/network-request-failed': 'Lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền.'
                };
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi tạo tài khoản',
                    text: errorMap[error.code] || `Hệ thống gặp sự cố: ${error.message}`
                });
            } finally {
                setLoading(false);
            }
            break;

        case 'edit':
            if (!selectedUserId) return;
            setLoading(true);
            try {
                await updateUser(selectedUserId, {
                    username: formData.username,
                    displayName: formData.username,
                    email: formData.email,
                    password: formData.password, 
                    role: formData.role || 'user'
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Đã cập nhật',
                    text: 'Thông tin người dùng đã được lưu lại.',
                    timer: 1500,
                    showConfirmButton: false
                });
                resetForm();
            } catch (error) {
                console.error("Update User Error:", error);
                Swal.fire('Lỗi', 'Không thể cập nhật: ' + error.message, 'error');
            } finally {
                setLoading(false);
            }
            break;

        case 'filter':
            setIsFilterModalOpen(true);
            break;

        case 'reset':
            resetForm();
            setQuickSearch('');
            setActiveFilters({ status: 'all', emailDomain: '', phonePrefix: '' });
            break;

        case 'lock':
            if (!selectedUserId) return;
            setLoading(true);
            try {
                const currentStatus = users.find(u => u.id === selectedUserId)?.status;
                const newStatus = currentStatus === 'locked' ? 'active' : 'locked';
                
                await updateUserStatus(selectedUserId, newStatus);
                Swal.fire({
                    icon: 'success',
                    title: 'Xong!',
                    text: `Đã ${newStatus === 'locked' ? 'khóa' : 'mở khóa'} tài khoản người dùng.`,
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error("Lock/Unlock Error:", error);
                Swal.fire('Lỗi', 'Không thể thay đổi trạng thái tài khoản.', 'error');
            } finally {
                setLoading(false);
            }
            break;

        default:
            break;
        }
    } catch (error) {
        console.error("Action error:", error);
        Swal.fire('Lỗi', 'Thao tác thất bại: ' + error.message, 'error');
        setLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    if (selectedUserId === user.id) return resetForm();
    setSelectedUserId(user.id);
    setFormData({ 
        ...user, 
        password: user.password || user.pass || '', 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b]">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-8 pt-24 pb-24">
        <header className="mb-10 flex items-center justify-between gap-8">
            {/* LEFT */}
            <h1 className="text-5xl font-black text-white whitespace-nowrap">
                QUẢN LÝ NGƯỜI DÙNG
            </h1>

            {/* RIGHT */}
            <div className="grid grid-cols-3 gap-4">
                <SummaryCard
                title="Tổng"
                value={stats.total}
                color="text-indigo-500"
                icon={Users}
                />

                <SummaryCard
                title="Hoạt động"
                value={stats.active}
                color="text-emerald-500"
                icon={UserCheck}
                />

                <SummaryCard
                title="Bị khóa"
                value={stats.locked}
                color="text-rose-500"
                icon={UserX}
                />

            </div>
        </header>


        <UserForm formData={formData} setFormData={setFormData} onAction={handleAction} isEditing={!!selectedUserId} loading={loading} />
        <UserTable users={filteredUsers} onSelectUser={handleSelectUser} selectedUserId={selectedUserId} quickSearch={quickSearch} onQuickSearchChange={setQuickSearch} />
      </main>

      <Filter isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApply={setActiveFilters} currentFilters={activeFilters} />
      <Footer />
    </div>
  );
};

export default Admin;
