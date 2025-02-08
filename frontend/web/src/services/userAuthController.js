
export async function loginUser(credentials) {
    try{
        const response = await fetch(`${import.meta.env.VITE_DATABASE_API_URL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })

        if (!response.ok){
            alert(response.status)
            return null
        }
        const res = await response.json();
        return res
    }catch(error){
        console.error(error);
        return null;
    }

}

export async function registerUser(credentials) {
    try{
        const response = await fetch(`${import.meta.env.VITE_DATABASE_API_URL}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        if (!response.ok){
            return null;
        }
        return true
    }catch(error){
        console.error(error);
        return null;
    }
}