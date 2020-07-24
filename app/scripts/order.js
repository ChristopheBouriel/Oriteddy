let contact = {
    'prénom': 'Rick', 'nom':'Shaw', 'adresse':'12, rue de Labas', 'ville': 'Hue', 'adresse électronique':'rs@gmail.com'

};


let orderList = ['5be9c8541c9d440000665243','5beaa8bf1c9d440000a57d94'];

let obj = {'contact': contact, 'products': orderList};
console.log(obj);


var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 201) {
            var response = JSON.parse(this.responseText);
            console.log(response);
        }
    }; 
    xhttp.open('POST', 'http://localhost:3000/api/order');
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(obj));



    function sendOrder() {
        return fetch('http://localhost:3000/api/order', {
            method: 'POST',
            
            headers: {
                'Content-type': 'application/json', 'Origin':'http://localhost:9000'
            },
            body: JSON.stringify(obj),
        })
        .then(response => response.json())
        .then(json => showConfirmation(json));
    }
    
    sendOrder();

    function showConfirmation(confirmedOrder) {
        console.log(confirmedOrder);
    }