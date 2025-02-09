import { useAuth } from '../contexts/authProvider';
import { useNavigation } from '../contexts/navProvider';
import "./loginRegister.css";

export default function Login() {
    const { login, user, logout} = useAuth();
    const {navigate} = useNavigation();
    

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

    const submitLogout = async (event) => {
        event.preventDefault(); // Prevent page refresh
        try {
            await logout();
            navigate('/login'); // Redirect to home page after successful login
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    if (user){
        return (
            <main className='background'>
                <article className='foreground'>
                    <h2>Logout</h2>
                    
                    <form onSubmit={submitLogout}>
                        <button type="submit">Logout</button>
                    </form>
                </article>
            </main>
        );
    }else{
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
}