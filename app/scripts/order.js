getAllTeddiesInfos();

function getAllTeddiesInfos() {  
    return fetch('http://localhost:3000/api/teddies').then(response => response.json()).then(json => {makeIdTab(json);});  
  }




  

let idItemsTab = [];
let totalOrder = 0;
let removeBasketTable = [];
let colorNumberTableAll = [];

//écriture du tableau des id
function makeIdTab(infos) {
    
    
    for (let teddy of infos) {
        console.log(teddy);
        let idItem = teddy._id;
        idItemsTab.push(idItem);
        console.log(idItemsTab);
        //remise à zero panier
        //localStorage.setItem(idItem, []);
        //
 
    };
    makeBasicListFromStorage(idItemsTab); 
}

//récupération de la liste brute des articles du panier pour chaque modèle
function makeBasicListFromStorage(idItemsTab) {
    console.log(colorNumberTableAll);
        let preFinalOrder = [];
        let finalOrder = [];
        let totalTeddyItems = [];
        
    for (let idItem of idItemsTab) {
    let itemsTab = localStorage.getItem(idItem);
    
    itemsTab = itemsTab.substring(0,itemsTab.length-1);
    let itemsTabObj = '[' + itemsTab + ']';
    console.log(itemsTab);
    let totalTeddyList = JSON.parse(itemsTabObj);
    console.log(totalTeddyList);
    
    makeListByColorItem(totalTeddyList, idItem);
    
    }
    
    console.log(colorNumberTableAll);
} 




//constitution de la liste des articles sans répétition de modèles d'une même couleur (contrôle)
function makeListByColorItem(totalTeddyList, idItem) {
    let totalTeddy = 0;            
    let teddyName = '';
    let colorTable = [];
    let teddyPrice = 0;   
    let colorNumberTable = [];
    let totalTeddyFinal = [];

    for (let readNumberEachColor of totalTeddyList) {
            
        if (totalTeddyList != []) {
        
            let countInfos = Object.values(readNumberEachColor);
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
    showNumberColorEach(colorNumberTable)
}


// affichage des articles d'une certaine couleur pour chaque modèle

function showNumberColorEach(colorNumberTable) {
    
    for (let y of colorNumberTable) {
        const newTeddyOrderColor = document.createElement('div');
        newTeddyOrderColor.classList.add('teddy_item_order_color');
        newTeddyOrderColor.id = y[2] + y[0];
        let teddyList = document.getElementById('see_basket');
        teddyList.appendChild(newTeddyOrderColor);
        newTeddyOrderColor.innerHTML = '<div class="item_color_infos"><div id="plus_less_one_'
        + y[2] + y[0] +'"> <div class="container"><div class="make_subtotal row no-gutters"><p class="col-4">' + y[2] + '  ' + y[0] + '</p>'
        + '<p class="col-3">Prix unitaire : ' + y[3] + '</p>' + '<p class="col-3">Quantité : ' + y[1] + '</p>'
        + '<p class="subtotal col-2">' + y[1]*y[3] + '</p></div></div></div>'
        
        + '<div class="modify_number_basket"><p class="remove_all"><a href="oribear-basket.html" id="del' + y[2] + y[0] + '">Enlever tout</a></p>'
        + '<p class="quantity_infos"><a id="add' +  y[2] + y[0] + '">+</a> <a id="remove' + y[2] + y[0] + '">-</a></div> '
        + '</div>';
        let removeBasket = y[2] + y[0];
        removeBasketTable.push(removeBasket);
    }
console.log(removeBasketTable);
};


//affichage du total pour chaque modèle et constitution du tableau pour l'envoi à l'API
function showNumberEach() {
    if (totalTeddy != 0) {
    const newTeddyOrder = document.createElement('div');
    newTeddyOrder.classList.add('teddy_item_order');
    newTeddyOrder.id = teddyName
    let teddiesList = document.getElementById('see_basket');
    teddiesList.appendChild(newTeddyOrder);
    newTeddyOrder.innerHTML = '<div class="container subtotal_item"><div class="row no-gutters make_subtotal"><p class="col-7">'+ teddyName + '</p><p class="col-3">Quantité : ' + totalTeddy + '</p>'
    + '<p class="subtotal col-2">' + totalTeddy*teddyPrice + '</p></div></div>';

    totalTeddyFinal[0] = teddyName;
    totalTeddyFinal[1] = totalTeddy;
    totalTeddyFinal[2] = teddyPrice;
    totalTeddyFinal[3] = totalTeddy*teddyPrice;
    totalTeddyItems.push(totalTeddyFinal); 
    };



console.log(preFinalOrder);
console.log(totalTeddyItems);
}


