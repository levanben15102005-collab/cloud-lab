import { useState, useEffect } from 'react';

// Link kết nối API Backend
const API_URL = 'http://localhost:5000/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null); // Quản lý ID sinh viên đang sửa

  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Lỗi kết nối API:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Xử lý Thêm mới hoặc Cập nhật Sinh viên
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Cập nhật sinh viên (PUT API)
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, name, email })
        });

        if (response.ok) {
          alert('Cập nhật thông tin sinh viên thành công!');
          resetForm();
          fetchStudents();
        } else {
          alert('Có lỗi xảy ra khi cập nhật!');
        }
      } else {
        // Thêm sinh viên mới (POST API)
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, name, email })
        });

        if (response.ok) {
          alert('Thêm sinh viên thành công!');
          resetForm();
          fetchStudents();
        } else {
          alert('Có lỗi xảy ra khi thêm sinh viên!');
        }
      }
    } catch (error) {
      console.error('Lỗi khi gửi form:', error);
    }
  };

  // Xử lý Xóa sinh viên (DELETE API)
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Xóa sinh viên thành công!');
          fetchStudents();
        } else {
          alert('Có lỗi xảy ra khi xóa sinh viên!');
        }
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
      }
    }
  };

  // Nạp dữ liệu sinh viên lên Form để sửa
  const handleEdit = (sv) => {
    setEditingId(sv._id);
    setStudentId(sv.studentId);
    setName(sv.name);
    setEmail(sv.email);
  };

  // Reset Form
  const resetForm = () => {
    setEditingId(null);
    setStudentId('');
    setName('');
    setEmail('');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justify: 'flex-start',
      padding: '40px 20px', 
      fontFamily: 'Segoe UI, Roboto, sans-serif',
      boxSizing: 'border-box'
    }}>
      {/* Tiêu đề ứng dụng đã được chỉnh sửa theo Câu 80 */}
      <h1 style={{ marginBottom: '25px', textAlign: 'center', letterSpacing: '1px', color: '#00a8ff' }}>
        QUẢN LÝ SINH VIÊN - Version 2.0
      </h1>

      {/* Form Căn Giữa Màn Hình */}
      <form onSubmit={handleSubmit} style={{ 
        width: '100%', 
        maxWidth: '420px', 
        border: '1px solid #333', 
        borderRadius: '12px', 
        padding: '25px', 
        marginBottom: '35px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        boxSizing: 'border-box'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', textAlign: 'center', color: editingId ? '#e1b12c' : '#ffffff' }}>
          {editingId ? 'Cập Nhật Thông Tin Sinh Viên' : 'Thêm Sinh Viên Mới (v2.0)'}
        </h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>MSSV:</label>
          <input 
            type="text" 
            value={studentId} 
            onChange={(e) => setStudentId(e.target.value)} 
            required 
            placeholder="Nhập MSSV (ví dụ: SV001)"
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              marginTop: '6px', 
              borderRadius: '6px', 
              border: '1px solid #444', 
              boxSizing: 'border-box' 
            }} 
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>Họ và Tên:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            placeholder="Nhập họ và tên"
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              marginTop: '6px', 
              borderRadius: '6px', 
              border: '1px solid #444', 
              boxSizing: 'border-box' 
            }} 
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="Nhập địa chỉ email"
            style={{ 
              width: '100%', 
              padding: '10px 12px', 
              marginTop: '6px', 
              borderRadius: '6px', 
              border: '1px solid #444', 
              boxSizing: 'border-box' 
            }} 
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ 
            flex: 1, 
            padding: '12px', 
            backgroundColor: editingId ? '#e1b12c' : '#0066cc', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px', 
            fontSize: '15px',
            fontWeight: 'bold', 
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}>
            {editingId ? 'Cập Nhật' : 'Thêm Sinh Viên'}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm} style={{ 
              padding: '12px 18px', 
              backgroundColor: '#555', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '6px', 
              fontSize: '15px',
              fontWeight: 'bold', 
              cursor: 'pointer'
            }}>
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* Khung Danh Sách Căn Giữa */}
      <div style={{ width: '100%', maxWidth: '580px', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '15px' }}>Danh Sách Sinh Viên</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {Array.isArray(students) && students.length > 0 ? (
            students.map((sv) => (
              <div key={sv._id} style={{ 
                padding: '14px 18px', 
                border: '1px solid #333', 
                borderRadius: '8px', 
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: 'left'
              }}>
                <div style={{ flex: 1, marginRight: '15px' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#00a8ff', marginRight: '8px' }}>{sv.studentId}</span>
                    <span style={{ fontWeight: '500' }}>- {sv.name}</span>
                  </div>
                  <div style={{ fontSize: '13px', opacity: 0.8, fontStyle: 'italic', marginTop: '4px' }}>{sv.email}</div>
                </div>

                {/* Cụm nút Thao tác Sửa & Xóa */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEdit(sv)} style={{ 
                    padding: '6px 12px', 
                    backgroundColor: '#e1b12c', 
                    color: '#1e1e1e', 
                    border: 'none', 
                    borderRadius: '4px', 
                    fontSize: '13px',
                    fontWeight: 'bold', 
                    cursor: 'pointer' 
                  }}>
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(sv._id)} style={{ 
                    padding: '6px 12px', 
                    backgroundColor: '#e74c3c', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '4px', 
                    fontSize: '13px',
                    fontWeight: 'bold', 
                    cursor: 'pointer' 
                  }}>
                    Xóa
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ opacity: 0.6 }}>Chưa có sinh viên nào trong danh sách.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;