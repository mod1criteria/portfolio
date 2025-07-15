const { useState, useEffect } = React;
const { BrowserRouter, Routes, Route, Link, useNavigate, useParams } = ReactRouterDOM;

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('로그인 실패');
      const data = await res.json();
      onLogin(data.accessToken);
      navigate('/calendar');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    React.createElement('div', { className: 'container' },
      React.createElement('h2', null, '로그인'),
      error && React.createElement('div', { style: { color: 'red' } }, error),
      React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('input', {
          type: 'email',
          placeholder: 'email',
          value: email,
          onChange: e => setEmail(e.target.value)
        }),
        React.createElement('input', {
          type: 'password',
          placeholder: 'password',
          value: password,
          onChange: e => setPassword(e.target.value)
        }),
        React.createElement('button', { type: 'submit' }, '로그인')
      ),
      React.createElement(Link, { to: '/register' }, '회원가입')
    )
  );
}

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (!res.ok) throw new Error('회원가입 실패');
      setMessage('회원가입 완료');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    React.createElement('div', { className: 'container' },
      React.createElement('h2', null, '회원가입'),
      message && React.createElement('div', null, message),
      React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('input', {
          placeholder: 'name',
          value: name,
          onChange: e => setName(e.target.value)
        }),
        React.createElement('input', {
          type: 'email',
          placeholder: 'email',
          value: email,
          onChange: e => setEmail(e.target.value)
        }),
        React.createElement('input', {
          type: 'password',
          placeholder: 'password',
          value: password,
          onChange: e => setPassword(e.target.value)
        }),
        React.createElement('button', { type: 'submit' }, '등록')
      )
    )
  );
}

function CalendarPage({ token, onLogout }) {
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    const payload = parseJwt(token);
    const userId = payload?.sub;
    fetch(`/schedules?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setSchedules)
      .catch(() => {});
  }, [token]);

  const handleLogout = async () => {
    await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
    onLogout();
    navigate('/');
  };

  return (
    React.createElement('div', null,
      React.createElement('header', null,
        React.createElement('button', { onClick: handleLogout }, '로그아웃')
      ),
      React.createElement('div', { className: 'container' },
        React.createElement('h2', null, '내 스케쥴'),
        React.createElement('ul', null,
          schedules.map(sc =>
            React.createElement('li', { key: sc.id, onClick: () => navigate(`/schedule/${sc.id}`) }, `${sc.title} (${sc.startDateTime})`)
          )
        )
      )
    )
  );
}

function ScheduleDetailPage({ token }) {
  const { id } = useParams();
  const [schedule, setSchedule] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/schedules/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setSchedule)
      .catch(() => {});
  }, [id, token]);

  const handleDelete = async () => {
    await fetch(`/schedules/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate('/calendar');
  };

  if (!schedule) return React.createElement('div', { className: 'container' }, '로딩중');

  return (
    React.createElement('div', { className: 'container' },
      React.createElement('h2', null, schedule.title),
      React.createElement('p', null, `시작: ${schedule.startDateTime}`),
      React.createElement('p', null, `종료: ${schedule.endDateTime}`),
      schedule.description && React.createElement('p', null, schedule.description),
      React.createElement('button', { onClick: handleDelete }, '삭제'),
      React.createElement('button', { onClick: () => navigate('/calendar') }, '뒤로')
    )
  );
}

function App() {
  const [token, setToken] = useState(null);

  const handleLogin = (t) => setToken(t);
  const handleLogout = () => setToken(null);

  return (
    React.createElement(BrowserRouter, null,
      React.createElement(Routes, null,
        React.createElement(Route, { path: '/', element: React.createElement(LoginPage, { onLogin: handleLogin }) }),
        React.createElement(Route, { path: '/register', element: React.createElement(RegisterPage) }),
        React.createElement(Route, { path: '/calendar', element: React.createElement(CalendarPage, { token, onLogout: handleLogout }) }),
        React.createElement(Route, { path: '/schedule/:id', element: React.createElement(ScheduleDetailPage, { token }) })
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
