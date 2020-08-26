const fError = (error) => {
    console.log("FETCH ERROR: ", error)
}

export function fetchApp(uri, data, fCallback, method = 'POST', token) {
    const headers = {'Content-Type': 'application/json;charset=utf-8'}
    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }

    fetch(uri, {
        method,
        headers,
        body: JSON.stringify({ ...data })
    })
        .then(res => res.json(), fError)
        .then(
            fCallback,
            fError
        )
}
