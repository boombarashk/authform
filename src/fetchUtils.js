const fError = (error) => {
    console.log("FETCH ERROR: ", error)
}

export function fetchApp(url, data, fCallback, method = 'POST', token) {
    const headers = {'Content-Type': 'application/json;charset=utf-8'}
    if (token) {
        headers["Authorization"] = `Token ${token}`;
    }

    fetch(url, {
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

export function makeId(length, onlyNumber = true) {
    let result           = '';
    let characters       = `0123456789${onlyNumber ? '': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'}`;
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return onlyNumber ? +result : result;
}
