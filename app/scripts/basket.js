getAllTeddiesInfos();

function getAllTeddiesInfos() {  
    return fetch('http://localhost:3000/api/teddies').then(response => response.json()).then(json => {makeIdTab(json);});  
  }

let idItemsTab = [];
let totalOrder = 0;
let totalTeddiesOrder = 0;
let removeBasketTable = [];
let colorNumberTableAll = [];
let totalTeddyItems = [];
let finalOrder = [];

//écriture du tableau des id
function makeIdTab(infos) {    
    for (let teddy of infos) {
        console.log(teddy);
        let idItem = teddy._id;
        idItemsTab.push(idItem);
        console.log(idItemsTab);
    };
    makeBasicListFromStorage(idItemsTab); 
}

//récupération de la liste brute des articles du panier pour chaque modèle
function makeBasicListFromStorage(idItemsTab) {
    console.log(colorNumberTableAll);
    for (let idItem of idItemsTab) {
        let itemsTab = localStorage.getItem(idItem);    
        itemsTab = itemsTab.substring(0,itemsTab.length-1);
        let itemsTabObj = '[' + itemsTab + ']';
        console.log(itemsTab);
        let totalTeddyList = JSON.parse(itemsTabObj);
        console.log(totalTeddyList);    
        makeListByColorItem(totalTeddyList, idItem);    
    }
    makeTotal(totalTeddyItems);
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
    let teddyName = '';
    let colorTable = [];
    let teddyPrice = 0;   
    let colorNumberTable = [];
    let countInfos
    for (let readNumberEachColor of totalTeddyList) {            
        if (totalTeddyList != []) {        
            countInfos = Object.values(readNumberEachColor);
            console.log(countInfos);
            let numberEachColor = countInfos[2];
            let teddyColor = countInfos[1];
            teddyPrice = countInfos[3];
            teddyPrice = parseFloat(teddyPrice);
            teddyName = countInfos[0];
            numberEachColor = parseFloat(numberEachColor);
            totalTeddy = totalTeddy + numberEachColor;                
            let colorCheck = colorTable.includes(teddyColor);                    
                if (colorCheck === false) {                            
                    colorTable.push(teddyColor);
                    let colorNumberTableItem = [];
                    colorNumberTableItem[0] = teddyColor;
                    colorNumberTableItem[1] = numberEachColor;
                    colorNumberTableItem[2] = teddyName;
                    colorNumberTableItem[3] = teddyPrice;
                    colorNumberTableItem[4] = idItem;                      
                    colorNumberTable.push(colorNumberTableItem);                    
                    }
                else {
                    for (let z of colorNumberTable) {                                
                        let colorInTable = z[0];
                        if (colorInTable == teddyColor) {  
                            z[1] = z[1] + numberEachColor;   
                        };         
                    };      
                }
           console.log(colorNumberTable);           
        }        
    };
    colorNumberTableAll.push(colorNumberTable);    
    console.log(colorNumberTableAll);
    showNumberColorEach(colorNumberTable);
    showNumberEach(teddyName, teddyPrice, totalTeddy, idItem);
    makeFinalOrder(colorNumberTable);    
}

// affichage initial des articles d'une certaine couleur pour chaque modèle

function showNumberColorEach(colorNumberTable) {    
    for (let y of colorNumberTable) {
        const newTeddyOrderColor = document.createElement('div');
        newTeddyOrderColor.classList.add('teddy_item_order_color');
        newTeddyOrderColor.id = y[2] + y[0];
        let teddyList = document.getElementById('see_basket');
        teddyList.appendChild(newTeddyOrderColor);
        newTeddyOrderColor.innerHTML = '<div class="item_color_infos"><div id="plus_less_one_'
        + y[2] + y[0] +'"> <div class="container"><div class="make_subtotal row no-gutters title_line"><p class="col-4">Article</p><p class="col-3">Prix</p>' 
        + '<p class="col-3">Quantité</p><p class="col-2 text-right">Montant</p></div>'
        + '<div class="make_subtotal row no-gutters"><p class="col-4 pr-1">' + y[2] + '  ' + y[0] + '</p>'
        + '<p class="col-3 price">' + y[3] + '</p>' + '<p class="col-3 quantity">' + y[1] + '</p>'
        + '<p class="subtotal col-2 text-right">' + y[1]*y[3] + '</p></div></div></div>'
        
        + '<div class="modify_number_basket"><p class="remove_all"><a href="oribear-basket.html" id="del' + y[2] + y[0] + '">Enlever tout</a></p>'
        + '<p class="quantity_infos"><a id="add' +  y[2] + y[0] + '">+</a> <a id="remove' + y[2] + y[0] + '">-</a></div> '
        + '</div>';
        let removeBasket = y[2] + y[0];
        removeBasketTable.push(removeBasket);
    }
console.log(removeBasketTable);
};

//affichage initial du total pour chaque modèle et constitution du tableau pour l'envoi à l'API
function showNumberEach(teddyName, teddyPrice, totalTeddy, idItem) {
    if (totalTeddy != 0) {
    const newTeddyOrder = document.createElement('div');
    newTeddyOrder.classList.add('teddy_item_order');
    newTeddyOrder.id = teddyName
    let teddiesList = document.getElementById('see_basket');
    teddiesList.appendChild(newTeddyOrder);
    newTeddyOrder.innerHTML = '<div class="container subtotal_item"><div class="row no-gutters make_subtotal"><p class="col-7">'
    + teddyName + '</p><p class="col-3">Quantité</p>'
    + '<p class="subtotal col-2 text-right">Montant</p></div><div class="row no-gutters make_subtotal">'
     + '<a class="col-7" href="oribear-item.html?' + idItem + '">Revoir</a><p class="col-3">' + totalTeddy + '</p><p class="subtotal col-2 text-right">' + totalTeddy*teddyPrice + '</p></div></div>';

    let totalTeddyFinal = [];
    totalTeddyFinal[0] = teddyName;
    totalTeddyFinal[1] = totalTeddy;
    totalTeddyFinal[2] = teddyPrice;
    totalTeddyFinal[3] = totalTeddy*teddyPrice;
    totalTeddyFinal[4] = idItem
    totalTeddyItems.push(totalTeddyFinal);    
    };
    console.log(totalTeddyItems);    
}

//constitution initiale de la liste avant commande
function makeFinalOrder(colorNumberTable) {
    for (let i of colorNumberTable) {
        if (i[1] != 0) {
        finalOrder.push(i);
        console.log(finalOrder);
        }
    };        
}

//calcul initial du total de la commande (contrôle)
function makeTotal(totalTeddyItems) {
    for (let makeTotal of totalTeddyItems) {
    totalOrder = totalOrder + makeTotal[3];
    totalTeddiesOrder = totalTeddiesOrder + makeTotal[1];
    console.log(totalTeddiesOrder);
    console.log(totalOrder);
    }
}

//création de la ligne du total de la commande
function createTotalLign() {
    const seeTotalOrder = document.createElement('div');
    seeTotalOrder.classList.add('text-center', 'my-5');
    seeTotalOrder.id = 'total_order'
    let teddiesTotalPrice = document.getElementById('see_basket');
    teddiesTotalPrice.appendChild(seeTotalOrder);
    showTotal();
}

//affichage du total de la commande (vue)
function showTotal() {
    let seeTotalOrder = document.getElementById('total_order');
    if (totalOrder != 0) {    
    seeTotalOrder.innerHTML = '<p>Total de votre panier : ' + totalOrder + '</p><a href="index.html" class="btn command" id="reset_basket">Vider le panier</a>'; 
    
    }
    else {
    seeTotalOrder.innerHTML = '<p>Votre panier est vide</p>';
        for(let idItem of idItemsTab) {
            localStorage.setItem(idItem, '');            
        }
        let totalArticles = document.getElementById('total_articles');
      totalArticles.innerHTML = '';       
    }
    let seeTotalArticles = document.getElementById('total_articles');
    seeTotalArticles.innerHTML = totalTeddiesOrder;
    console.log(localStorage.getItem("totalArticles"));
    localStorage.setItem("totalArticles", totalTeddiesOrder);
    resetBasket();
    
}




//suppression du modèle d'une certaine couleur à l'affichage (vue)
function removeTeddyColorAll() {
    for (let listenRemoveBasket of removeBasketTable) {                
        const less = document.getElementById ('del' + listenRemoveBasket);        
        less.addEventListener('click', function(event) {
        event.preventDefault();    
        console.log(listenRemoveBasket);
        const remove = document.getElementById (listenRemoveBasket);
        let deleteItemColor = document.getElementById('see_basket');
        deleteItemColor.removeChild(remove);        
        //identification du modèle d'une couleur supprimé
            for (let modifyNumberEach of finalOrder) {
                let a = modifyNumberEach[2] + modifyNumberEach[0]
                console.log(a);
                let removeTeddyTotal = modifyNumberEach[1];
        //affichage du nouveau total pour la commande
                if (listenRemoveBasket == a) {
                    totalOrder = totalOrder - modifyNumberEach[1]*modifyNumberEach[3];
                    console.log(totalOrder);
                    totalTeddiesOrder = totalTeddiesOrder - modifyNumberEach[1];
                        console.log(totalTeddiesOrder);
                    //let changeTotalPrice = document.getElementById('total_order');                    
                    //changeTotalPrice.innerHTML = '<p>Total ' + totalOrder + '</p>';
                                 
                    modifyNumberEach[1] = 0;
                    for (let b of totalTeddyItems) {
                        if ( modifyNumberEach[2] == b[0]) {
                            b[1] = b[1] - removeTeddyTotal;                        
        //suppression du modèle à l'affichage s'il n'y en a plus ou modification du sous-total pour le modèle s'il en reste dans d'autres couleurs                        
                            let changeTotalItem = document.getElementById(modifyNumberEach[2]);
                            if (b[1] == 0) {
                                let deleteItem = document.getElementById('see_basket');                                
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
            newBasket();
            
                    showTotal();            
            console.log(totalTeddyItems);
        })
    }
}

//modification du panier en cas de retour à l'accueil et aux pages produit
function newBasket() {
    for (let idEach of idItemsTab) {
            let constStringItem = [];        
            localStorage.setItem(idEach, constStringItem);
            for (let constString of finalOrder) {
                    if (constString[1] != 0 && constString[4] == idEach) {
                        let constObj =  '"name":"' + constString[2] + '",'
                        + '"color":"' +  constString[0] + '",'
                        + '"nombre":' + constString[1] + ','
                        + '"price":' + constString[3];
                        constObj = '{' + constObj +'},';
                        constStringItem = constStringItem + constObj;                     
                    }
                let constStringObj = localStorage.getItem(idEach);
                constStringObj = constStringItem;
                localStorage.setItem(idEach, constStringObj); 
            }                
        }
}

//vider totalement le panier et retourner à l'accueil
function resetBasket() {
    const resetAll = document.getElementById('reset_basket');
    resetAll.addEventListener('click', function() {        
        for(let idItem of idItemsTab) {
            localStorage.setItem(idItem, '');            
        }
        localStorage.setItem("totalArticles", '');        
    })
}

//modification de la ligne concernée par ajout ou suppression
function modifyLignColorEach(readColorNumberEach, listenBasket) {
    const rewriteOne = document.getElementById ('plus_less_one_' + listenBasket);
    rewriteOne.innerHTML = '<div class="item_color_infos"><div id="plus_less_one_' + readColorNumberEach[2] + readColorNumberEach[0] +'"><div class="container"><div class="make_subtotal row no-gutters title_line"><p class="col-4">Article</p><p class="col-3">Prix</p>' 
    + '<p class="col-3">Quantité</p><p class="col-2 text-right">Montant</p></div><div class="make_subtotal row no-gutters"><p class="col-4 pr-1">' + readColorNumberEach[2] + '  ' + readColorNumberEach[0] + '</p>'
                        + '<p class="col-3">' + readColorNumberEach[3] + '</p><p class="col-3">' + readColorNumberEach[1]
                         + '</p><p class="subtotal col-2 text-right">' + readColorNumberEach[1]*readColorNumberEach[3] + '</p></div></div></div>';
}

//modification du sous-total concerné par ajout ou suppression
function modifyLignEach(newTotalTeddy, teddyName) {
    const changeSubtotal = document.getElementById (teddyName);
    changeSubtotal.innerHTML = '<div class="container subtotal_item"><div class="row no-gutters make_subtotal"><p class="col-7">'
    + newTotalTeddy[0] + '</p><p class="col-3">Quantité</p>'
    + '<p class="subtotal col-2 text-right">Montant</p></div><div class="row no-gutters make_subtotal">'
     + '<a class="col-7" href="oribear-item.html?' + newTotalTeddy[4] + '">Revoir</a><p class="col-3">' + newTotalTeddy[1] + '</p><p class="subtotal col-2 text-right">' + newTotalTeddy[1]*newTotalTeddy[2] + '</p></div></div>';
}

//détection et traitement du clic sur un bouton -
function removeOneItem() {
    for (let listenRemoveBasket of removeBasketTable) {            
        const removeOne = document.getElementById ('remove' + listenRemoveBasket);        
        removeOne.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        console.log(listenRemoveBasket);
        let i = 1
            for (let readColorNumberTable of colorNumberTableAll) {                
                for (let readColorNumberEach of readColorNumberTable) {
                    console.log(readColorNumberEach);                    
                    if (readColorNumberEach[2]+readColorNumberEach[0] == listenRemoveBasket && i == 1 && readColorNumberEach[1] != 0 ) {
                        readColorNumberEach[1] = readColorNumberEach[1] - 1;
                        modifyLignColorEach(readColorNumberEach, listenRemoveBasket);
                        i--;
                        for (let newTotalTeddy of totalTeddyItems) {
                            if (newTotalTeddy[0] == readColorNumberEach[2]) {
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
            newBasket();
        })
    }
}

//détection et traitement du clic sur un bouton +
function addOneItem() {
    for (let listenRemoveBasket of removeBasketTable) {                    
        const removeOne = document.getElementById ('add' + listenRemoveBasket);        
        removeOne.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        console.log(listenRemoveBasket);
        let i = 1
            for (let readColorNumberTable of colorNumberTableAll) {                
                for (let readColorNumberEach of readColorNumberTable) {
                    console.log(readColorNumberEach);                    
                    if (readColorNumberEach[2]+readColorNumberEach[0] == listenRemoveBasket && i == 1) {
                        readColorNumberEach[1] = readColorNumberEach[1] + 1;
                        modifyLignColorEach(readColorNumberEach, listenRemoveBasket);
                        i--;
                        for (let newTotalTeddy of totalTeddyItems) {
                            if (newTotalTeddy[0] == readColorNumberEach[2]) {
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
            newBasket();
        })
    }
}