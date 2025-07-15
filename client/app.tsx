import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

type JwtPayload = { sub: string } | null;

function parseJwt(token: string): JwtPayload {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

interface LoginPageProps {
  onLogin: (token: string) => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('로그인 실패');
      const data = await res.json();
      onLogin(data.accessToken);
      navigate('/calendar');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h2>로그인</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">로그인</button>
      </form>
      <Link to="/register">회원가입</Link>
    </div>
  );
}

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) throw new Error('회원가입 실패');
      setMessage('회원가입 완료');
      setTimeout(() => navigate('/'), 1000);
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="container">
      <h2>회원가입</h2>
      {message && <div>{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">등록</button>
      </form>
    </div>
  );
}

interface Schedule {
  id: string;
  title: string;
  startDateTime: string;
  endDateTime: string;
  description?: string;
}

interface CalendarPageProps {
  token: string | null;
  onLogout: () => void;
}

function CalendarPage({ token, onLogout }: CalendarPageProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    const payload = parseJwt(token);
    const userId = payload?.sub;
    fetch(`/schedules?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setSchedules)
      .catch(() => {});
  }, [token]);

  const handleLogout = async () => {
    await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
    onLogout();
    navigate('/');
  };

  return (
    <div>
      <header>
        <button onClick={handleLogout}>로그아웃</button>
      </header>
      <div className="container">
        <h2>내 스케쥴</h2>
        <ul>
          {schedules.map((sc) => (
            <li key={sc.id} onClick={() => navigate(`/schedule/${sc.id}`)}>
              {sc.title} ({sc.startDateTime})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface ScheduleDetailPageProps {
  token: string | null;
}

function ScheduleDetailPage({ token }: ScheduleDetailPageProps) {
  const { id } = useParams();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/schedules/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setSchedule)
      .catch(() => {});
  }, [id, token]);

  const handleDelete = async () => {
    await fetch(`/schedules/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate('/calendar');
  };

  if (!schedule)
    return <div className="container">로딩중</div>;

  return (
    <div className="container">
      <h2>{schedule.title}</h2>
      <p>시작: {schedule.startDateTime}</p>
      <p>종료: {schedule.endDateTime}</p>
      {schedule.description && <p>{schedule.description}</p>}
      <button onClick={handleDelete}>삭제</button>
      <button onClick={() => navigate('/calendar')}>뒤로</button>
    </div>
  );
}

function App() {
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = (t: string) => setToken(t);
  const handleLogout = () => setToken(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/calendar" element={<CalendarPage token={token} onLogout={handleLogout} />} />
        <Route path="/schedule/:id" element={<ScheduleDetailPage token={token} />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
