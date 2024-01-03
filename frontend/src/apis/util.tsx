export function postOperation(path: string , data: object){
    return fetch(`${path}`, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
    })
}
export function getOperation(url: string){
    return fetch(url).then( (res) => res.json());
}
export function deleteOperation(url: string , id: BigInt){
    return fetch(`${url}/${id}`, {
        method: 'DELETE',
    })
}
export function updateOperation(url: string,id: BigInt, data: object){
    return fetch(`${url}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data),
    }).then( (resp) => resp.json())
}
