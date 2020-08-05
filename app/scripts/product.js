//récupération des infos du teddy
function getTeddyInfos() {
    return fetch(urlApiTeddy).then(response => response.json()).then(json => {getOneTeddyInfos(json);
        addBasket(json);});   
  }

class OrderTeddy {
    constructor (name, color, number, price) {
        this.name = name;
        this.color = color;
        this.number = number;
        this.price = price;
    }
}

let addItems = {};
let item = 0;

//affichage initial du produit
function getOneTeddyInfos (infosTeddy) {    
    const teddyView = document.createElement('div');
    teddyView.classList.add('teddy_item_view', 'text-center', 'mt-md-2');
    const teddyInfos = document.getElementById('teddy_view');
    teddyInfos.appendChild(teddyView);
    teddyView.innerHTML = '<p class="font-weight-bold teddy_name mt-3">' + infosTeddy.name + '</p>'
        + '<img src=' + infosTeddy.imageUrl + '>'
        + '<p class="mt-3 font-weight-bold teddy_price">' + convertCents(infosTeddy.price) + ' €' + '</p>'
        + '<p>' + infosTeddy.description + '</p>';
    const teddyViewNav = document.createElement('div');
    teddyViewNav.classList.add('teddy_view_nav');
    const teddyNavButtons = document.getElementById('teddy_view');
    teddyNavButtons.appendChild(teddyViewNav);
    teddyViewNav.innerHTML = '<p><a href="index.html#' + infosTeddy.name + '">'
        + '<div class="back_to_list"><i class="fas fa-paw"></i><p>Retour</p></div></a></p>';
    const initColor = document.getElementById('color_choice');
    initColor.innerHTML = infosTeddy.colors[0];
    addItems[0] = infosTeddy.colors[0];
    const showQuantity = document.getElementById('quantity_choice');
    showQuantity.innerHTML = item;
    const teddyColors = infosTeddy.colors;
    showColors(teddyColors);
}

//affichage des couleurs dans le menu déroulant et sélection
function showColors(teddyColors) {
    let addNewColor, newColor;
    for (let colorName of teddyColors) {
        newColor = document.createElement('a')            
        newColor.classList.add('dropdown-item');
        newColor.id = colorName;
        addNewColor = document.getElementById('colors_list');
        addNewColor.appendChild(newColor);
        newColor.innerHTML = colorName;        
    };
    let itemColor, showColor, showQuantity;
    for (let colorOption of teddyColors) { 
        itemColor = document.getElementById (colorOption); 
        itemColor.addEventListener('click', function() {
        showColor = document.getElementById('color_choice');
        showColor.innerHTML = colorOption;
        addItems[0] = colorOption;
        addItems[1] = 0;
        item = 0;
        showQuantity = document.getElementById('quantity_choice');
        showQuantity.innerHTML = 0;
        });
    }
}

//sélection du nombre désiré dans la couleur affichée --> ajouter
function addOne() {
    const plus = document.getElementById ('add');
        plus.addEventListener('click', function(event) {
        event.preventDefault();       
        item++;      
        const showQuantity = document.getElementById('quantity_choice');
        showQuantity.innerHTML = item;
        addItems[1] = item;
        });
}

//sélection du nombre désiré dans la couleur affichée --> enlever
function removeOne() {
    const less = document.getElementById ('remove');
    less.addEventListener('click', function(event) {
        event.preventDefault();       
        if (item>0) {
            item--;
            const showQuantity = document.getElementById('quantity_choice');
            showQuantity.innerHTML = item;
            addItems[1] = item;
            }
        });   
}

//ajouter la sélection au panier
function addBasket(infos) {
    const addValidation = document.getElementById('add_basket');
    addValidation.addEventListener('click', function(event) {
        event.preventDefault();
        if(item!=0) {
            const newItemBasket = new OrderTeddy(infos.name, addItems[0], addItems[1], infos.price);
            let allOfThisItem = localStorage.getItem(idItem);
            if(allOfThisItem.length == 0) {
                allOfThisItem = [];
            }
            else {
                allOfThisItem = JSON.parse(allOfThisItem);
            }
            allOfThisItem.push(newItemBasket);
            allOfThisItem = JSON.stringify(allOfThisItem);
            localStorage.setItem(idItem, allOfThisItem);
        };        
        let allArticles = localStorage.getItem('totalArticles');
        allArticles = parseInt(allArticles);
        if(isNaN(allArticles) === true) {
            allArticles = 0;
        };
        const adds = addItems[1];            
        allArticles = allArticles + adds;            
        localStorage.setItem('totalArticles', allArticles);
        showTotalArticles();
        addItems[1] = 0;
        const showQuantity = document.getElementById('quantity_choice');
        showQuantity.innerHTML = 0;
        item = 0;
    });
};

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

function convertCents(priceCent) {
    const priceEuro = priceCent/100;
    return priceEuro;
}

const model = window.location.search;
const idItem = model.substring(1);
const urlApiTeddy = 'http://localhost:3000/api/teddies/' + idItem;
showTotalArticles();
getTeddyInfos();
addOne();
removeOne();