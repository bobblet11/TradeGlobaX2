import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import "./loginRegister.css"

export default function Register() {
    const { login, register } = useAuth();

    const navigate = useNavigate();

    const handleRegister = async (email, password) => {
        try {
            await register(email, password);
            navigate('/');
        } catch (error) {
            console.error('Failed to register:', error);
        }
    };

    const submitRegister = (event, email, password) => {
        event.preventDefault();
        handleRegister(email,password)
    }

    return (
        <main className='background'>
            <article className='foreground'>
                <h2>Login</h2>
                
                <form onSubmit={e => submitRegister(e, target.event.email.value, target.event.password.value)}>
                    <input type="email" name="email" placeholder="Email" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <button type="submit">Login</button>
                </form>

                <div>
                    <h3>Already have an account? <a> Login </a> </h3>
                </div>

            </article>
        </main>
    );
}