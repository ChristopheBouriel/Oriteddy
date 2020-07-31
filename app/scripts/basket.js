function getAllTeddiesInfos() {  
    return fetch('http://localhost:3000/api/teddies').then(response => response.json()).then(json => {makeIdTab(json);});  
}

//variables globales nécessaires à la gestion du panier et des modifications éventuelles de celui-ci
let idItemsTab = []; //tableau des id des produits
let totalOrder = 0; //montant total de la commande
let totalTeddiesOrder = 0; //nombre total d'articles
let removeBasketTable = []; //tableau des produits affichés initialement et donc susceptibles d'être ôtés
let colorNumberTableAll = []; //tableau de tableaux de chaque teddy, chacun contenant les tableaux de chaque variante de couleur,
                            //permettant de garder toutes les informations de manière structurée et de les actualiser
let totalTeddyItems = []; //tableau des différents modèles avec notamment le nombre total de chaque, toutes couleurs confondues
let finalOrder = []; //tableau simple de toutes les variantes de teddies, modèle ET couleur,
                    // afin de gérer simplement la supression totale d'une variante et la réécriture du panier

getAllTeddiesInfos();

//écriture du tableau des id
function makeIdTab(infos) {
    let idItem = '';
    for (let teddy of infos) {
        console.log(teddy);
        idItem = teddy._id;
        idItemsTab.push(idItem);
        console.log(idItemsTab);
    };
    
    getBasicListFromStorage(idItemsTab); 
}

//récupération de la liste brute des articles du panier pour chaque modèle
function getBasicListFromStorage(idItemsTab) {
    console.log(colorNumberTableAll);
    //possible de déclarer colorNumberTableAll ici et le passer en paramètre à makeListByColorItem(), removeTeddyColorAll(), removeOneItem(), addOneItem();
    let itemsTab = '';
    let itemsTabObj = '';
    let totalTeddyList = [];
    for (let idItem of idItemsTab) {
        itemsTab = localStorage.getItem(idItem);    
        itemsTab = itemsTab.substring(0,itemsTab.length-1);
        itemsTabObj = '[' + itemsTab + ']';
        console.log(itemsTab);
        totalTeddyList = JSON.parse(itemsTabObj);
        console.log(totalTeddyList);    
        makeListByColorItem(totalTeddyList, idItem);    
    };
    makeTotal();
    createTotalLign();
    removeTeddyColorAll();
    removeOneItem();
    addOneItem();
    resetBasket();    
    console.log(colorNumberTableAll);
} 

//constitution de la liste des articles sans répétition de modèles d'une même couleur (contrôle)
function makeListByColorItem(totalTeddyList, idItem) {
    let totalTeddy = 0;
    let colorNumberTable = [];
    let colorTable = [];
    let countInfos, numberEachColor, teddyName, teddyColor, teddyPrice, colorCheck, colorInTable, colorNumberTableItem;
    for (let readNumberEachColor of totalTeddyList) {            
        if (totalTeddyList != []) {        
            countInfos = Object.values(readNumberEachColor);
            console.log(countInfos);
            numberEachColor = countInfos[2];
            teddyColor = countInfos[1];
            teddyPrice = countInfos[3];
            teddyPrice = parseFloat(teddyPrice);
            teddyName = countInfos[0];
            numberEachColor = parseFloat(numberEachColor);
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
           console.log(colorNumberTable);           
        };        
    };
    colorNumberTableAll.push(colorNumberTable);    
    console.log(colorNumberTableAll);
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
        + y[2] + y[0] +'"> <div class="container"><div class="make_subtotal row no-gutters title_line"><p class="col-4">Article</p><p class="col-3">Prix</p>' 
        + '<p class="col-3">Quantité</p><p class="col-2 text-right">Montant</p></div>'
        + '<div class="make_subtotal row no-gutters"><p class="col-4 pr-1">' + y[2] + '  ' + y[0] + '</p>'
        + '<p class="col-3 price">' + convertCents(y[3]) + ' €</p>' + '<p class="col-3 quantity">' + y[1] + '</p>'
        + '<p class="subtotal col-2 text-right">' + convertCents(y[1]*y[3]) + ' €</p></div></div></div>'
        
        + '<div class="modify_number_basket"><p class="remove_all"><a href="oribear-basket.html" id="del' + y[2] + y[0] + '">Enlever tout</a></p>'
        + '<p class="quantity_infos"><a id="add' +  y[2] + y[0] + '">+</a> <a id="remove' + y[2] + y[0] + '">-</a></div> '
        + '</div>';
        removeBasket = y[2] + y[0];
        removeBasketTable.push(removeBasket);
    }
console.log(removeBasketTable);
};

//affichage initial du total pour chaque modèle et constitution du tableau pour l'envoi à l'API
function showNumberEach(teddyName, teddyPrice, totalTeddy, idItem) {
    if (totalTeddy != 0) {
    const newTeddyOrder = document.createElement('div');
    newTeddyOrder.classList.add('teddy_item_order');
    newTeddyOrder.id = teddyName;
    const teddiesList = document.getElementById('see_basket');
    teddiesList.appendChild(newTeddyOrder);
    newTeddyOrder.innerHTML = '<div class="container subtotal_item"><div class="row no-gutters make_subtotal"><p class="col-7">'
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
    console.log(totalTeddyItems);     
}

//constitution initiale de la liste de toutes les variantes de teddies, modèle ET couleur
function makeFinalOrder(colorNumberTable) {
    for (let i of colorNumberTable) {
        if (i[1] != 0) {
        finalOrder.push(i);
        console.log(finalOrder);
        }
    };        
}

//calcul initial du total de la commande (contrôle)
function makeTotal() {
    for (let makeTotal of totalTeddyItems) {
    totalOrder = totalOrder + makeTotal[3];
    totalTeddiesOrder = totalTeddiesOrder + makeTotal[1];
    console.log(totalTeddiesOrder);
    console.log(totalOrder);
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

//affichage du total de la commande (vue)
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
        }
        const totalArticles = document.getElementById('total_articles');
      totalArticles.innerHTML = '';       
    }
    showTotalArticlesMenu();
    resetBasket();   
}

//affichage du nombre total d'article dans le bouton du menu
function showTotalArticlesMenu() {
    const seeTotalArticles = document.getElementById('total_articles');
    seeTotalArticles.innerHTML = totalTeddiesOrder;
    console.log(localStorage.getItem('totalArticles'));
    localStorage.setItem('totalArticles', totalTeddiesOrder); 
}

//suppression du modèle d'une certaine couleur à l'affichage (vue)
function removeTeddyColorAll() {
    let less, remove, deleteItemColor, teddyColor, removeTeddyTotal, teddyId, changeTotalItem, deleteItem;
    for (let listenRemoveBasket of removeBasketTable) {                
        less = document.getElementById ('del' + listenRemoveBasket);        
        less.addEventListener('click', function(event) {
        event.preventDefault();    
        console.log(listenRemoveBasket);
        remove = document.getElementById (listenRemoveBasket);
        deleteItemColor = document.getElementById('see_basket');
        deleteItemColor.removeChild(remove);        
        //identification du modèle d'une couleur supprimé
            for (let modifyNumberEach of finalOrder) {
                teddyColor = modifyNumberEach[2] + modifyNumberEach[0];                
                console.log(teddyColor);
                removeTeddyTotal = modifyNumberEach[1];
        //affichage du nouveau total pour la commande
                if (listenRemoveBasket == teddyColor) {
                    teddyId = modifyNumberEach[4];
                    totalOrder = totalOrder - modifyNumberEach[1]*modifyNumberEach[3];
                    console.log(totalOrder);
                    totalTeddiesOrder = totalTeddiesOrder - modifyNumberEach[1];
                    console.log(totalTeddiesOrder);
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
                            }                           
                        }                    
                    }                                   
                }    
            }
            console.log(finalOrder);
            newBasket(teddyId);            
            showTotal();            
            console.log(totalTeddyItems);
        })
    }
}

//modification du panier en cas de retour à l'accueil et aux pages produit
function newBasket(teddyId) {
    let constStringItem = '';
    for (let constString of finalOrder) {
        if (constString[1] != 0 && constString[4] == teddyId) {
            let constObj =  '"name":"' + constString[2] + '",'
            + '"color":"' +  constString[0] + '",'
            + '"nombre":' + constString[1] + ','
            + '"price":' + constString[3];
            constObj = '{' + constObj +'},';
            constStringItem = constStringItem + constObj;                     
        }
    localStorage.setItem(teddyId, constStringItem); 
    }
}

//vider totalement le panier et retourner à l'accueil
function resetBasket() {
    if(totalOrder != 0) {
        const resetAll = document.getElementById('reset_basket');
        resetAll.addEventListener('click', function() {        
        for(let idItem of idItemsTab) {
            localStorage.setItem(idItem, '');            
        }
        localStorage.setItem('totalArticles', '');        
        })
    }
}

//modification de la ligne concernée par ajout ou suppression
function modifyLignColorEach(readColorNumberEach, listenBasket) {
    const rewriteOne = document.getElementById ('plus_less_one_' + listenBasket);
    rewriteOne.innerHTML = '<div class="item_color_infos"><div id="plus_less_one_' + readColorNumberEach[2] + readColorNumberEach[0] +'">'
    + '<div class="container"><div class="make_subtotal row no-gutters title_line"><p class="col-4">Article</p><p class="col-3">Prix</p>' 
    + '<p class="col-3">Quantité</p><p class="col-2 text-right">Montant</p></div><div class="make_subtotal row no-gutters">'
    + '<p class="col-4 pr-1">' + readColorNumberEach[2] + '  ' + readColorNumberEach[0] + '</p>'
    + '<p class="col-3">' + convertCents(readColorNumberEach[3]) + ' €</p><p class="col-3">' + readColorNumberEach[1]
    + '</p><p class="subtotal col-2 text-right">' + convertCents(readColorNumberEach[1]*readColorNumberEach[3]) + ' €</p></div></div></div>';
}

//modification du sous-total concerné par ajout ou suppression
function modifyLignEach(newTotalTeddy, teddyName) {
    const changeSubtotal = document.getElementById (teddyName);
    changeSubtotal.innerHTML = '<div class="container subtotal_item"><div class="row no-gutters make_subtotal"><p class="col-7">'
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
        console.log(listenRemoveBasket);
        i = 1;
            for (let readColorNumberTable of colorNumberTableAll) {
                console.log(colorNumberTableAll);              
                for (let readColorNumberEach of readColorNumberTable) {
                    console.log(readColorNumberEach);                    
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
                            }
                        }
                        totalOrder = totalOrder - readColorNumberEach[3];
                        totalTeddiesOrder = totalTeddiesOrder - 1;
                        console.log(totalTeddiesOrder);
                        showTotal();
                    }
                    console.log(totalTeddyItems);
                    console.log(finalOrder);
                }                    
            }
            newBasket(teddyId);
        })
    }
}

//détection et traitement du clic sur un bouton +
function addOneItem() {
    let i, teddyId;
    for (let listenRemoveBasket of removeBasketTable) {                    
        const removeOne = document.getElementById ('add' + listenRemoveBasket);        
        removeOne.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        console.log(listenRemoveBasket);
        i = 1;
            for (let readColorNumberTable of colorNumberTableAll) {                
                for (let readColorNumberEach of readColorNumberTable) {
                    console.log(readColorNumberEach);                    
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
                            }
                        }
                        totalOrder = totalOrder + readColorNumberEach[3];
                        totalTeddiesOrder = totalTeddiesOrder + 1;
                        console.log(totalTeddiesOrder);
                        showTotal();                        
                    }
                    console.log(totalTeddyItems);
                    console.log(finalOrder);
                }                    
            }
            newBasket(teddyId);
        })
    }
}

function convertCents(priceCent) {
    let priceEuro = priceCent/100;
    return priceEuro;
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

//création de l'objet "contact"
function makeContact() {
    if(totalOrder != 0) {
        let firstName = $('#firstname').val();
        let lastName = $('#lastname').val();
        let address = $('#address').val();
        let city = $('#city').val();
        let email = $('#email').val();
        let currentUser = new User(firstName, lastName, address, city, email);
        console.log(currentUser);
        makeIdList(currentUser);
        return false;
    }   
}

//création du tableau des références commandées et stockage du tableau détaillé de la commande pour la page "Commande"
function makeIdList(currentUser) {
    let idList = [];
    for(let g of totalTeddyItems) {
        idList.push(g[4]);
    }
    console.log(idList);
    localStorage.setItem('orderResume', JSON.stringify(totalTeddyItems)); //pour afficher le résumé dans la confirmation de commande
    console.log(localStorage.getItem('orderResume'));
    makeBodyPost(currentUser, idList);
}

//écriture du body de la requête à l'API
function makeBodyPost(currentUser, idList) {
    let obj = new Order (currentUser, idList)
    console.log(obj);
    if(totalOrder != 0) {
        sendOrder(obj);
    }
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
    console.log(confirmedOrder);
    let infos = Object.values(confirmedOrder);
    let orderNumber = infos[2];
    console.log(orderNumber);
    localStorage.setItem('idOrder', orderNumber);
    console.log(localStorage.idOrder);
    
    localStorage.setItem('isNew', 1);
    console.log(localStorage.isNew);

    let a = Object.values(infos[0]);
    let idUser = a[0] + a[1];
    console.log(idUser);
    let lastOrder = {"orderId": infos[2], "saveOrder": JSON.parse(localStorage.orderResume)};
    localStorage.setItem(idUser,JSON.stringify(lastOrder));
    console.log(localStorage.getItem(idUser));
    goToOrder();
}

//aller à la page "Commande"
function goToOrder(){
    document.location.href='oribear-order.html'; 
}