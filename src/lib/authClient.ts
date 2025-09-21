// Register
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  return res.json();
}

// Login
export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await res.json(); // read once
  // eslint-disable-next-line no-console
  console.log(res);

  if (res.ok) {
    localStorage.setItem('user', JSON.stringify(result.user));
    localStorage.setItem('accessToken', result.accessToken);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-change')); // notify listeners
    }
  }

  return { error: result.error }; // handle error without re-reading
}
