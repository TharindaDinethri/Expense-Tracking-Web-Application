const BASE =
    import.meta.env.VITE_API_URL ||
    'http://localhost:8080/api';

export async function api(
    path,
    {
        method = 'GET',
        body,
        auth = true
    } = {}
) {
    const headers = {
        'Content-Type': 'application/json'
    };

    const token = localStorage.getItem('token');

    if (auth && token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(
        BASE + path,
        {
            method,
            headers,
            body: body
                ? JSON.stringify(body)
                : undefined
        }
    );

    let data = null;

    try {
        data = await res.json();
    } catch {}

    if (!res.ok) {
        throw new Error(
            data?.message || 'Request failed'
        );
    }

    return data;
}