import { useState, useEffect } from 'react';

// Dùng link localhost hoặc link Codespaces Public của Port 5000
const API_URL = '/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, name, email })
      });

      if (response.ok) {
        alert('Thêm sinh viên thành công!');
        setStudentId('');
        setName('');
        setEmail('');
        fetchStudents();
      } else {
        alert('Có lỗi xảy ra khi thêm sinh viên!');
      }
    } catch (error) {
      console.error('Lỗi khi gửi form:', error);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <h2>QUẢN LÝ SINH VIÊN</h2>

      <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '400px', marginBottom: '30px' }}>
        <h3>Thêm Sinh Viên Mới</h3>
        <div style={{ marginBottom: '10px' }}>
          <label>MSSV: </label><br/>
          <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Họ và Tên: </label><br/>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Email: </label><br/>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Thêm Sinh Viên</button>
      </form>

      <h3>Danh Sách Sinh Viên</h3>
      <ul>
        {students.map((sv) => (
          <li key={sv._id} style={{ marginBottom: '8px' }}>
            <b>{sv.studentId}</b> - {sv.name} - <i>{sv.email}</i>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;