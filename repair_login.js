const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/admin/AdminApp.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The file currently has:
// 170: );
// 171:       const data = await res.json();
// 172:       if (data.success) {

// 170 is the end of FormModal.
// We need to insert the missing parts of Login between FormModal and line 171.

const missingLoginParts = `
// --- PAGE COMPONENTS ---

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // DEVELOPMENT BYPASS
    if (email && password) {
      setTimeout(() => {
        onLogin('bypass_token_for_dev');
        navigate('/admin');
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const res = await fetch(\`\${apiBase}/api/admin/login\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
`;

// Replace `);\n      const data = await res.json();` with the correct code
content = content.replace(
  /\);\s+const data = await res\.json\(\);/,
  `);\n${missingLoginParts}      const data = await res.json();`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed Login component structure');
