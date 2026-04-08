import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'BORROWER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            if (isLogin) {
                const user = await login(formData.email, formData.password);
                redirectUser(user.role);
            } else {
                await register(formData);
                alert('Registration successful! Please login.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const redirectUser = (role) => {
        // Redirect to /borrower, /lender, /admin, or /analyst
        navigate(`/${role.toLowerCase()}`);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="login-page">
            <div className="login-bg">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>
            
            <div className="login-container">
                <div className="login-glass-card animate-fadeIn">
                    <div className="login-header">
                        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                        <p>{isLogin ? 'Enter your credentials to access your dashboard' : 'Join our lending platform today'}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {!isLogin && (
                            <div className="form-group">
                                <label>Full Name</label>
                                <input name="name" type="text" placeholder="John Doe" required value={formData.name} onChange={handleChange} />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Email Address</label>
                            <input name="email" type="email" placeholder="john@example.com" required value={formData.email} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input name="password" type="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} />
                        </div>

                        {!isLogin && (
                            <div className="form-group">
                                <label>Role</label>
                                <select name="role" value={formData.role} onChange={handleChange}>
                                    <option value="BORROWER">Borrower</option>
                                    <option value="LENDER">Lender</option>
                                    <option value="ANALYST">Analyst</option>
                                </select>
                            </div>
                        )}

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? 'Processing...' : (isLogin ? 'Sign In / Submit' : 'Sign Up / Submit')}
                        </button>
                        
                        <button type="button" className="toggle-button" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
