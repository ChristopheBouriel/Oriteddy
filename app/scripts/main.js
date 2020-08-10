//récupération des infos des teddies auprès de l'API
function getAllTeddiesInfos() {  
    return fetch('http://localhost:3000/api/teddies').then(response => response.json()).then(json => {showList(json);});  
}

//montrer le nombre total d'articles du panier dans le bouton du menu
function showTotalArticles() {
    const totalArticles = document.getElementById('total_articles');
    let checkBasket = localStorage.getItem('totalArticles');
    if(isNaN(checkBasket) === true) {
      checkBasket = 0;
    };
    checkBasket = parseInt(checkBasket);
    if(checkBasket != 0) {
      totalArticles.innerHTML = localStorage.getItem('totalArticles');
    }
    else {
      const totalArticles = document.getElementById('total_articles');
      totalArticles.innerHTML = '';
    }
}

//convertion des prix de cent en euro
function convertCents(priceCent) {
    const priceEuro = priceCent/100;
    return priceEuro;
}

//Affichage de la liste complète des teddies
function showList(list) {
    let teddyList, testId, newTeddy;
    for (let teddy of list) {
        newTeddy = document.createElement('div');
        newTeddy.classList.add('teddy_item_list', 'text-center', 'card', 'product', 'my-5');
        newTeddy.id = teddy.name;           
        teddyList = document.getElementById('teddies_list');
        teddyList.appendChild(newTeddy);
        newTeddy.innerHTML = '<p class="font-weight-bold teddy_name mt-3">' + teddy.name + '</p>'
              + '<img src=' + teddy.imageUrl + '>'
               + '<p class="mt-3 font-weight-bold teddy_price">' + convertCents(teddy.price) + ' €' + '</p>'
                + '<a href="oribear-item.html?' + teddy._id + '" class="stretched-link mb-2">Cliquer pour voir plus</a>';       
        testId = localStorage.getItem(teddy._id);
        if (testId === null) {
            localStorage.setItem(teddy._id, '');
        }
    }
}

showTotalArticles();
getAllTeddiesInfos();