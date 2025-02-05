import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

export default function AuthViewer() {
    const { login, register } = useAuth();

    const navigate = useNavigate();

    const handleLogin = async (email, password) => {
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            console.error('Failed to login:', error);
        }
    };

    const handleRegister = async (email, password) => {
        try {
            await register(email, password);
            navigate('/');
        } catch (error) {
            console.error('Failed to register:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                const email = e.target.email.value;
                const password = e.target.password.value;
                handleLogin(email, password);
            }}>
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>

            <h2>Register</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                const email = e.target.email.value;
                const password = e.target.password.value;
                handleRegister(email, password);
            }}>
                <input type="email" name="email" placeholder="Email" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}