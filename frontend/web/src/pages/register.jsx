import { useAuth } from '../contexts/authProvider';
import { useNavigate } from 'react-router-dom';
import "./loginRegister.css";

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate(); // Use navigate for redirection if needed

    const submitRegister = async (event) => {
        event.preventDefault(); // Prevent page refresh
        
        const email = event.target.email.value; // Access email from the event target
        const password = event.target.password.value; // Access password from the event target

        try {
            await register({"username":email, password});
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            console.error('Failed to register:', error);
        }
    };

    return (
        <main className='background'>
            <article className='foreground'>
                <h2>Register</h2>
                
                <form onSubmit={submitRegister}>
                    <input type="email" name="email" placeholder="Email" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <button type="submit">Register</button>
                </form>

                <div>
                    <h3>
                        {`Already have an account? `}
                        <a href="/login">
                            Login
                        </a>!
                    </h3>
                </div>
            </article>
        </main>
    );
}