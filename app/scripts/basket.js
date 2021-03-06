//récupération des infos des teddies auprès de l'API
function getAllTeddiesInfos() {  
    return fetch('http://localhost:3000/api/teddies').then(response => response.json()).then(json => {makeIdTab(json);});  
}

//variables globales nécessaires à la gestion du panier et des modifications éventuelles de celui-ci
const idItemsTab = []; //tableau des id des produits
let totalOrder = 0; //montant total de la commande
let totalTeddiesOrder = 0; //nombre total d'articles
const removeBasketTable = []; //tableau des produits affichés initialement et donc susceptibles d'être ôtés
const colorNumberTableAll = []; //tableau de tableaux de chaque teddy, chacun contenant les tableaux de chaque variante de couleur,
                            //permettant de garder toutes les informations de manière structurée et de les actualiser
const totalTeddyItems = []; //tableau des différents modèles avec notamment le nombre total de chaque, toutes couleurs confondues
const finalOrder = []; //tableau simple de toutes les variantes de teddies, modèle ET couleur,
                    // afin de gérer simplement la supression totale d'une variante et la réécriture du panier

class OrderTeddy {
    constructor (name, color, number, price) {
        this.name = name;
        this.color = color;
        this.number = number;
        this.price = price;
    }
}

class User {
    constructor(firstName, lastName, address, city, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.city = city;
        this.email = email;
    }
}
class Order {
    constructor(user, orderList) {
        this.contact = user;
        this.products = orderList;
    }
}

getAllTeddiesInfos();

//écriture du tableau des id
function makeIdTab(infos) {
    let idItem;
    for (let teddy of infos) {
        idItem = teddy._id;
        idItemsTab.push(idItem);
    };    
    getBasicListFromStorage(idItemsTab); 
}

//récupération de la liste brute des articles du panier pour chaque modèle
function getBasicListFromStorage(idItemsTab) {
    //possible de déclarer colorNumberTableAll ici et le passer en paramètre à makeListByColorItem(), removeTeddyColorAll(), removeOneItem(), addOneItem();
    let totalTeddyList = [];
    let itemsTab;
    for (let idItem of idItemsTab) {
        itemsTab = localStorage.getItem(idItem);    
        if(itemsTab.length != 0) {
            totalTeddyList = JSON.parse(itemsTab);   
            makeListByColorItem(totalTeddyList, idItem);
        }; 
    };
    makeTotal();
    createTotalLign();
    removeTeddyColorAll();
    removeOneItem();
    addOneItem();
    resetBasket();
} 

//constitution de la liste des articles sans répétition de modèles d'une même couleur
function makeListByColorItem(totalTeddyList, idItem) {
    let totalTeddy = 0;
    const colorNumberTable = [];
    const colorTable = [];
    let countInfos, numberEachColor, teddyName, teddyColor, teddyPrice, colorCheck, colorInTable, colorNumberTableItem;
    for (let readNumberEachColor of totalTeddyList) {            
        if (totalTeddyList != []) {        
            countInfos = Object.values(readNumberEachColor);
            numberEachColor = countInfos[2];
            teddyColor = countInfos[1];
            teddyPrice = countInfos[3];
            teddyPrice = parseInt(teddyPrice);
            teddyName = countInfos[0];
            numberEachColor = parseInt(numberEachColor);
            totalTeddy = totalTeddy + numberEachColor;                
            colorCheck = colorTable.includes(teddyColor);                    
                if (colorCheck === false) {                            
                    colorTable.push(teddyColor);
                    colorNumberTableItem = [];
                    colorNumberTableItem[0] = teddyColor;
                    colorNumberTableItem[1] = numberEachColor;
                    colorNumberTableItem[2] = teddyName;
                    colorNumberTableItem[3] = teddyPrice;
                    colorNumberTableItem[4] = idItem;                      
                    colorNumberTable.push(colorNumberTableItem);                    
                    }
                else {
                    for (let z of colorNumberTable) {                                
                        colorInTable = z[0];
                        if (colorInTable == teddyColor) {  
                            z[1] = z[1] + numberEachColor;   
                        };         
                    };      
                };           
        };        
    };
    colorNumberTableAll.push(colorNumberTable);    
    showNumberColorEach(colorNumberTable);
    showNumberEach(teddyName, teddyPrice, totalTeddy, idItem);
    makeFinalOrder(colorNumberTable);     
}

// affichage initial des articles d'une certaine couleur pour chaque modèle
function showNumberColorEach(colorNumberTable) {
    let removeBasket, newTeddyOrderColor, teddyList;
    for (let y of colorNumberTable) {
        newTeddyOrderColor = document.createElement('div');
        newTeddyOrderColor.classList.add('teddy_item_order_color');
        newTeddyOrderColor.id = y[2] + y[0];
        teddyList = document.getElementById('see_basket');
        teddyList.appendChild(newTeddyOrderColor);
        newTeddyOrderColor.innerHTML = '<div class="item_color_infos"><div id="plus_less_one_'
        + y[2] + y[0] +'"> <div class="container-fluid"><div class="make_subtotal row no-gutters title_line"><p class="col-4">Article</p><p class="col-3">Prix</p>' 
        + '<p class="col-3">Quantité</p><p class="col-2 text-right">Montant</p></div>'
        + '<div class="make_subtotal row no-gutters infos_line"><p class="col-4 pr-1">' + y[2] + '  ' + y[0] + '</p>'
        + '<p class="col-3 price">' + convertCents(y[3]) + ' €</p>' + '<p class="col-3 quantity">' + y[1] + '</p>'
        + '<p class="subtotal col-2 text-right">' + convertCents(y[1]*y[3]) + ' €</p></div></div></div>'
        
        + '<div class="modify_number_basket"><p class="remove_all"><a href="oribear-basket.html" id="del' + y[2] + y[0] + '">Enlever tout</a></p>'
        + '<p class="quantity_infos"><a id="add' +  y[2] + y[0] + '">+</a> <a id="remove' + y[2] + y[0] + '">-</a></div> '
        + '</div>';
        removeBasket = y[2] + y[0];
        removeBasketTable.push(removeBasket);
    }
};

//affichage initial du total pour chaque modèle et constitution du tableau pour l'envoi à l'API
function showNumberEach(teddyName, teddyPrice, totalTeddy, idItem) {
    if (totalTeddy != 0) {
    const newTeddyOrder = document.createElement('div');
    newTeddyOrder.classList.add('teddy_item_order');
    newTeddyOrder.id = teddyName;
    const teddiesList = document.getElementById('see_basket');
    teddiesList.appendChild(newTeddyOrder);
    newTeddyOrder.innerHTML = '<div class="container-fluid subtotal_item"><div class="row no-gutters make_subtotal"><p class="col-7">'
    + teddyName + '</p><p class="col-3">Quantité</p>'
    + '<p class="subtotal col-2 text-right">Montant</p></div><div class="row no-gutters make_subtotal">'
    + '<a class="col-7 back_button" href="oribear-item.html?' + idItem + '">Revoir l\'article</a>'
    + '<p class="col-3">' + totalTeddy + '</p><p class="subtotal col-2 text-right">' + convertCents(totalTeddy*teddyPrice) + ' €</p></div></div>';
    let totalTeddyFinal = [];
    totalTeddyFinal[0] = teddyName;
    totalTeddyFinal[1] = totalTeddy;
    totalTeddyFinal[2] = teddyPrice;
    totalTeddyFinal[3] = totalTeddy*teddyPrice;
    totalTeddyFinal[4] = idItem;
    totalTeddyItems.push(totalTeddyFinal);    
    };     
}

//constitution initiale de la liste de toutes les variantes de teddies, modèle ET couleur
function makeFinalOrder(colorNumberTable) {
    for (let i of colorNumberTable) {
        if (i[1] != 0) {
        finalOrder.push(i);
        };
    };        
}

//calcul initial du total de la commande
function makeTotal() {
    for (let makeTotal of totalTeddyItems) {
    totalOrder = totalOrder + makeTotal[3];
    totalTeddiesOrder = totalTeddiesOrder + makeTotal[1];
    };
}

//création de la ligne du total de la commande
function createTotalLign() {
    const seeTotalOrder = document.createElement('div');
    seeTotalOrder.classList.add('text-center', 'my-5');
    seeTotalOrder.id = 'total_order';
    const teddiesTotalPrice = document.getElementById('see_basket');
    teddiesTotalPrice.appendChild(seeTotalOrder);
    showTotal();
}

//affichage du total de la commande
function showTotal() {
    const seeTotalOrder = document.getElementById('total_order');
    if (totalOrder != 0) {    
    seeTotalOrder.innerHTML = '<p>Total de votre panier : ' + convertCents(totalOrder) + ' €</p>'
    + '<a href="index.html" class="btn command" id="reset_basket">Vider le panier</a>';
    }
    else {
    seeTotalOrder.innerHTML = '<p>Votre panier est vide</p>';
        for(let idItem of idItemsTab) {
            localStorage.setItem(idItem, '');            
        };
        const totalArticles = document.getElementById('total_articles');
      totalArticles.innerHTML = '';       
    };
    localStorage.setItem('totalArticles', totalTeddiesOrder); 
    showTotalArticles();
    resetBasket();   
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

//suppression d'un modèle d'une certaine couleur
function removeTeddyColorAll() {
    let less, remove, deleteItemColor, teddyColor, removeTeddyTotal, teddyId, changeTotalItem, deleteItem;
    for (let listenRemoveBasket of removeBasketTable) {                
        less = document.getElementById ('del' + listenRemoveBasket);        
        less.addEventListener('click', function(event) {
        event.preventDefault();
        remove = document.getElementById (listenRemoveBasket);
        deleteItemColor = document.getElementById('see_basket');
        deleteItemColor.removeChild(remove);        
        //identification du modèle d'une couleur supprimé
            for (let modifyNumberEach of finalOrder) {
                teddyColor = modifyNumberEach[2] + modifyNumberEach[0];                
                removeTeddyTotal = modifyNumberEach[1];
        //affichage du nouveau total pour la commande
                if (listenRemoveBasket == teddyColor) {
                    teddyId = modifyNumberEach[4];
                    totalOrder = totalOrder - modifyNumberEach[1]*modifyNumberEach[3];
                    totalTeddiesOrder = totalTeddiesOrder - modifyNumberEach[1];
                    modifyNumberEach[1] = 0;
                    for (let b of totalTeddyItems) {
                        if ( modifyNumberEach[2] == b[0]) {
                            b[1] = b[1] - removeTeddyTotal;                        
        //suppression du modèle à l'affichage s'il n'y en a plus ou modification du sous-total pour le modèle s'il en reste dans d'autres couleurs                        
                            changeTotalItem = document.getElementById(modifyNumberEach[2]);
                            if (b[1] == 0) {
                                deleteItem = document.getElementById('see_basket');                                
                                deleteItem.removeChild(changeTotalItem);                                
                            }
                            else {
                                modifyLignEach(b, modifyNumberEach[2]);
                            };                          
                        };                    
                    };                                  
                };    
            };
            newBasket(teddyId);            
            showTotal();            
        });
    };
}

//modification du panier en cas de retour à l'accueil et aux pages produit et commande
function newBasket(teddyId) {
    let allOfThisItem = [];
    let newItemBasket;
    for (let constObjTeddy of finalOrder) {
        if (constObjTeddy[1] != 0 && constObjTeddy[4] == teddyId) {
            newItemBasket = new OrderTeddy(constObjTeddy[2], constObjTeddy[0], constObjTeddy[1], constObjTeddy[3]);
            allOfThisItem.push(newItemBasket);
        };
    };
    allOfThisItem = JSON.stringify(allOfThisItem);
    localStorage.setItem(teddyId, allOfThisItem);
}

//vider totalement le panier et retourner à l'accueil
function resetBasket() {
    if(totalOrder != 0) {
        const resetAll = document.getElementById('reset_basket');
        resetAll.addEventListener('click', function() {        
        for(let idItem of idItemsTab) {
            localStorage.setItem(idItem, '');            
        };
        localStorage.setItem('totalArticles', '');        
        });
    };
}

//modification de la ligne concernée par ajout ou suppression
function modifyLignColorEach(readColorNumberEach, listenBasket) {
    const rewriteOne = document.getElementById ('plus_less_one_' + listenBasket);
    rewriteOne.innerHTML = '<div class="item_color_infos"><div id="plus_less_one_' + readColorNumberEach[2] + readColorNumberEach[0] +'">'
    + '<div class="container-fluid"><div class="make_subtotal row no-gutters title_line"><p class="col-4">Article</p><p class="col-3">Prix</p>' 
    + '<p class="col-3">Quantité</p><p class="col-2 text-right">Montant</p></div><div class="make_subtotal row no-gutters infos_line">'
    + '<p class="col-4 pr-1">' + readColorNumberEach[2] + '  ' + readColorNumberEach[0] + '</p>'
    + '<p class="col-3">' + convertCents(readColorNumberEach[3]) + ' €</p><p class="col-3">' + readColorNumberEach[1]
    + '</p><p class="subtotal col-2 text-right">' + convertCents(readColorNumberEach[1]*readColorNumberEach[3]) + ' €</p></div></div></div>';
}

//modification du sous-total concerné par ajout ou suppression
function modifyLignEach(newTotalTeddy, teddyName) {
    const changeSubtotal = document.getElementById (teddyName);
    changeSubtotal.innerHTML = '<div class="container-fluid subtotal_item"><div class="row no-gutters make_subtotal"><p class="col-7">'
    + newTotalTeddy[0] + '</p><p class="col-3">Quantité</p>'
    + '<p class="subtotal col-2 text-right">Montant</p></div><div class="row no-gutters make_subtotal">'
    + '<a class="col-7 back_button" href="oribear-item.html?' + newTotalTeddy[4] + '">Revoir l\'article</a><p class="col-3">' + newTotalTeddy[1] + '</p>'
    + '<p class="subtotal col-2 text-right">' + convertCents(newTotalTeddy[1]*newTotalTeddy[2]) + ' €</p></div></div>';
}

//détection et traitement du clic sur un bouton -
function removeOneItem() {
    let i, teddyId;
    for (let listenRemoveBasket of removeBasketTable) {            
        const removeOne = document.getElementById ('remove' + listenRemoveBasket);        
        removeOne.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        i = 1;
            for (let readColorNumberTable of colorNumberTableAll) {              
                for (let readColorNumberEach of readColorNumberTable) {                    
                    if (readColorNumberEach[2]+readColorNumberEach[0] == listenRemoveBasket && i == 1 && readColorNumberEach[1] != 0 ) {
                        readColorNumberEach[1] = readColorNumberEach[1] - 1;
                        modifyLignColorEach(readColorNumberEach, listenRemoveBasket);
                        i--;
                        for (let newTotalTeddy of totalTeddyItems) {
                            if (newTotalTeddy[0] == readColorNumberEach[2]) {
                                teddyId = newTotalTeddy[4];
                                newTotalTeddy[1] = newTotalTeddy[1] - 1;
                                newTotalTeddy[3] = newTotalTeddy[1]*newTotalTeddy[2];
                                modifyLignEach(newTotalTeddy, readColorNumberEach[2]);                                
                            };
                        };
                        totalOrder = totalOrder - readColorNumberEach[3];
                        totalTeddiesOrder = totalTeddiesOrder - 1;
                        showTotal();
                    };
                };                   
            };
            newBasket(teddyId);
        });
    };
}

//détection et traitement du clic sur un bouton +
function addOneItem() {
    let i, teddyId;
    for (let listenRemoveBasket of removeBasketTable) {                    
        const removeOne = document.getElementById ('add' + listenRemoveBasket);        
        removeOne.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        i = 1;
            for (let readColorNumberTable of colorNumberTableAll) {                
                for (let readColorNumberEach of readColorNumberTable) {                    
                    if (readColorNumberEach[2]+readColorNumberEach[0] == listenRemoveBasket && i == 1) {
                        readColorNumberEach[1] = readColorNumberEach[1] + 1;
                        modifyLignColorEach(readColorNumberEach, listenRemoveBasket);
                        i--;
                        for (let newTotalTeddy of totalTeddyItems) {
                            if (newTotalTeddy[0] == readColorNumberEach[2]) {
                                teddyId = newTotalTeddy[4];
                                newTotalTeddy[1] = newTotalTeddy[1] + 1;
                                newTotalTeddy[3] = newTotalTeddy[1]*newTotalTeddy[2];
                                modifyLignEach(newTotalTeddy, readColorNumberEach[2]);
                            };
                        };
                        totalOrder = totalOrder + readColorNumberEach[3];
                        totalTeddiesOrder = totalTeddiesOrder + 1;
                        showTotal();                        
                    };
                };                    
            };
            newBasket(teddyId);
        });
    };
}

//convertion des prix de cent en euro
function convertCents(priceCent) {
    const priceEuro = priceCent/100;
    return priceEuro;
}

//création de l'objet "contact"
function makeContact() {
    if(totalOrder != 0) {
        const firstName = $('#firstname').val();
        const lastName = $('#lastname').val();
        const address = $('#address').val();
        const city = $('#city').val();
        const email = $('#email').val();
        const currentUser = new User(firstName, lastName, address, city, email);
        makeIdList(currentUser);
        return false;
    };
}

//création du tableau des références commandées et stockage du tableau de la commande pour la page "Commande"
function makeIdList(currentUser) {
    let idList = [];
    for(let g of totalTeddyItems) {
        idList.push(g[4]);
    };
    localStorage.setItem('orderResume', JSON.stringify(totalTeddyItems)); //pour afficher le résumé dans la confirmation de commande
    makeBodyPost(currentUser, idList);
}

//écriture du body de la requête à l'API
function makeBodyPost(currentUser, idList) {
    const obj = new Order (currentUser, idList);
    if(totalOrder != 0) {
        sendOrder(obj);
    };
}

//envoi de la requête à l'API et récupération de la réponse
function sendOrder(obj) {
    return fetch('http://localhost:3000/api/teddies/order', {
        method: 'POST',        
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(obj),
    })
    .then(response => response.json())
    .then(json => prepareConfirmation(json));
}

//récupération et stockage des infos nécessaires à la gestion de l'affichage de la page "Commande"
function prepareConfirmation(confirmedOrder) {
    const infos = Object.values(confirmedOrder);
    const orderNumber = infos[2];
    localStorage.setItem('idOrder', orderNumber);
    localStorage.setItem('isNew', 1);
    const a = Object.values(infos[0]);
    const idUser = a[0] + a[1];
    const lastOrder = {'orderId': infos[2], 'saveOrder': JSON.parse(localStorage.orderResume)};
    localStorage.setItem(idUser,JSON.stringify(lastOrder));
    goToOrder();
}

//aller à la page "Commande"
function goToOrder(){
    document.location.href='oribear-order.html'; 
}