// Aquí debe colocar la URL de sus servicios, recurde solo colocar la base, es decir, hasta api
const urlBase = 'https://localhost:44394/api' 
export class restClient {
    static httpGet = (url) => {

const urlcompleta=`${urlBase}${url}`;
        return fetch(urlcompleta)
            .then(response => response.json())
            .then(response => {
                
                return response;
            });
    }

    static httpPost = (url, req) => {

        return fetch(`${urlBase}${url}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(req),
        }).catch(error => {

        }).then(res => {
            if (res.status >= 400) {
                return res.text();
            }

            return res.json();
        }).then(res => {
            return res;
        });
    }

    static httpDelete = (url, id) => {

        return fetch(`${urlBase}${url}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => {
            return res.text();
        }).then(res => {
            return res;
        });
    }

    static httpPut = (url, req) => {
        return fetch(`${urlBase}${url}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(req),
        }).catch(error => {

        }).then(res => {

            return res.text();
        }).then(res => {
            return res;
        });
    }
}

