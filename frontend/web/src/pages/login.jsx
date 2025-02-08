import { useAuth } from '../contexts/authProvider';
import { useNavigate } from 'react-router-dom';
import "./loginRegister.css";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const submitLogin = async (event) => {
        event.preventDefault(); // Prevent page refresh

        const email = event.target.email.value; // Access email from the event target
        const password = event.target.password.value; // Access password from the event target

        try {
            await login({"username":email, password});
            navigate('/'); // Redirect to home page after successful login
        } catch (error) {
            console.error('Failed to login:', error);
        }
    };

    return (
        <main className='background'>
            <article className='foreground'>
                <h2>Login</h2>
                
                <form onSubmit={submitLogin}>
                    <input type="email" name="email" placeholder="Email" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <button type="submit">Login</button>
                </form>

                <div>
                    <h3>
                        {`Don't have an account? Sign up `}
                        <a href="/register">
                            here
                        </a>!
                    </h3>
                </div>
            </article>
        </main>
    );
}