export async function loginUser(credentials) {
    return fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

export async function registerUser(credentials) {
    return fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}