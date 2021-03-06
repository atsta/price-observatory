/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import cookie from 'react-cookies';

function sendPromise(url, body) {
    return new Promise(function(resolve, reject) {
        var answer = sendInfo(url, body);
        resolve(answer);
        reject("error"); // ignored
    });
}

function sendInfo(url, body) {
    if (cookie.load('loggedin')) {
        try {
            var token = cookie.load('token');
        }
        catch(error) {
            console.log(error);
        }

        return fetch(url, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-OBSERVATORY-AUTH': token
            },
            body: JSON.stringify(body)
        })
        .then((response) => {
            console.log(response);
            return response;
        })
        .catch((error) => {
            console.error(error);
            return("error");
        });
    }
    else {
        return fetch(url, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then((response) => {
            console.log(response);
            return response;
        })
        .catch((error) => {
            console.error(error);
            return("error");
        });
    }
}

export function patch (url, body) {
    var url_final = window.http + url;
    return sendPromise(url_final, body)
    .then ((answer) => {
        return answer;
    })
    .catch((error) => {
        console.log(error);
    });
}
