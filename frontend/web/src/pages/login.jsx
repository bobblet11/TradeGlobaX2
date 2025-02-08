import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import "./loginRegister.css"

export default function Login() {
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

    const submitLogin = (event, email, password) => {
        event.preventDefault();
        handleLogin(email,password)
    }

    return (
        <main className='background'>
            <article className='foreground'>
                <h2>Login</h2>
                
                <form onSubmit={e => submitLogin(e, target.event.email.value, target.event.password.value)}>
                    <input type="email" name="email" placeholder="Email" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <button type="submit">Login</button>
                </form>

                <div>
                    <h3>Don't have an account? Sign up <a> here </a>!</h3>
                </div>

            </article>
        </main>
    );
}