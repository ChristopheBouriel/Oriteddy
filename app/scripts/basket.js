
let idItemsTab = [];
let totalOrder = 0;

let request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        let infos = JSON.parse(this.responseText);

        
//écriture du tableau des id 
        for (let teddy of infos) {
            console.log(teddy);
            let idItem = teddy._id;
            idItemsTab.push(idItem);
            console.log(idItemsTab);
            //remise à zero panier
            //localStorage.setItem(idItem, []);
            //
            };
        };
        let removeBasketTable = [];
        let preFinalOrder = [];
        let finalOrder = [];
        let totalTeddyItems = [];
        let colorNumberTableAll = [];
        
//récupération de la liste brute des articles d'un modèle du panier
        for (let idItem of idItemsTab) {
            let itemsTab = localStorage.getItem(idItem);
            
            itemsTab = itemsTab.substring(0,itemsTab.length-1);
            let itemsTabObj = '[' + itemsTab + ']';
            console.log(itemsTab);
            let totalTeddyList = JSON.parse(itemsTabObj);
            console.log(totalTeddyList);
            let totalTeddy = 0;            
            let teddyName = '';
            let colorTable = [];
            let teddyPrice = 0;
            let colorNumberTable = [];
            let totalTeddyFinal = [];
            
            
//constitution de la liste des articles sans répétition de modèles d'une même couleur (contrôle)
            for (let readNumberEach of totalTeddyList) {
            
                if (totalTeddyList != []) {
                
                    let countInfos = Object.values(readNumberEach);
                    console.log(countInfos);
                    let numberEach = countInfos[2];
                    let teddyColor = countInfos[1];
                    teddyPrice = countInfos[3];
                    teddyPrice = parseFloat(teddyPrice);
                    teddyName = countInfos[0];
                    numberEach = parseFloat(numberEach);
                    totalTeddy = totalTeddy + numberEach;                   
                    
                    let colorCheck = colorTable.includes(teddyColor);                    
                        if (colorCheck === false) {                            
                            colorTable.push(teddyColor);
                            let colorNumberTableItem = [];
                            colorNumberTableItem[0] = teddyColor;
                            colorNumberTableItem[1] = numberEach;
                            colorNumberTableItem[2] = teddyName;
                            colorNumberTableItem[3] = teddyPrice;
                            colorNumberTableItem[4] = idItem;                      
                            colorNumberTable.push(colorNumberTableItem);                                                     
                        }
                        else {
                            for (let z of colorNumberTable) {                                
                                let colorInTable = z[0];
                                if (colorInTable == teddyColor) {  
                                    z[1] = z[1] + numberEach;   
                                };         
                            };
                             
                        }
                    
                }
                   
            console.log(colorNumberTable);
            
            };
            colorNumberTableAll.push(colorNumberTable);
            console.log(colorNumberTableAll);
            
// affichage des articles d'une certaine couleur pour chaque modèle
            for (let y of colorNumberTable) {
                    const newTeddyOrderColor = document.createElement('div');
                    newTeddyOrderColor.classList.add('teddy_item_order_color');
                    newTeddyOrderColor.id = teddyName + y[0];
                    let teddyList = document.getElementById('see_basket');
                    teddyList.appendChild(newTeddyOrderColor);
                    newTeddyOrderColor.innerHTML = '<div class="item_color_infos"><div id="plus_less_one_'
                    + teddyName + y[0] +'"> <div class="container"><div class="make_subtotal row no-gutters"><p class="col-4">' + teddyName + '  ' + y[0] + '</p>'
                     + '<p class="col-3">Prix unitaire : ' + y[3] + '</p>' + '<p class="col-3">Quantité : ' + y[1] + '</p>'
                      + '<p class="subtotal col-2">' + y[1]*y[3] + '</p></div></div></div>'
                    
                     + '<div class="modify_number_basket"><p class="remove_all"><a href="oribear-basket.html" id="del' + teddyName + y[0] + '">Enlever tout</a></p>'
                     + '<p class="quantity_infos"><a id="add' +  teddyName + y[0] + '">+</a> <a id="remove' + teddyName + y[0] + '">-</a></div> '
                     + '</div>';
                    let removeBasket = teddyName + y[0];
                    removeBasketTable.push(removeBasket);
                    console.log(removeBasketTable);
                    
                };

//constitution de la liste finale avant commande
            for (let i of colorNumberTable) {
                    if (i[1] != 0) {
                    preFinalOrder.push(i);
                    console.log(preFinalOrder);
                    }
                
                };
            
               
//affichage du total pour chaque modèle et constitution du tableau pour l'envoi à l'API
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
        };

        
//calcul du total de la commande (contrôle)
        for (let makeTotal of totalTeddyItems) {
        totalOrder = totalOrder + makeTotal[3];
        }  

//affichage du total de la commande (vue)
        if (totalOrder != 0) {
        const seeTotalOrder = document.createElement('div');
        seeTotalOrder.classList.add('text-center', 'my-5');
        seeTotalOrder.id = 'total_order'
        let teddiesTotalPrice = document.getElementById('see_basket');
        teddiesTotalPrice.appendChild(seeTotalOrder);
        seeTotalOrder.innerHTML = '<p>Total ' + totalOrder + '</p>';
        }
              

//suppression du modèle d'une certaine couleur à l'affichage (vue)
        for (let listenRemoveBasket of removeBasketTable) {
            
            const less = document.getElementById ('del' + listenRemoveBasket);
            
            less.addEventListener('click', function(event) {
            event.preventDefault();
           // event.stopPropagation();
            console.log(listenRemoveBasket);
            const remove = document.getElementById (listenRemoveBasket);
            let deleteItemColor = document.getElementById('see_basket');
            deleteItemColor.removeChild(remove);

            
//identification du modèle d'une couleur supprimé
            for (let modifyNumberEach of preFinalOrder) {
                let a = modifyNumberEach[2] + modifyNumberEach[0]
                console.log(a);
                let removeTeddyTotal = modifyNumberEach[1];
//affichage du nouveau total pour la commande
                if (listenRemoveBasket == a) {
                    totalOrder = totalOrder - modifyNumberEach[1]*modifyNumberEach[3];
                    console.log(totalOrder);
                    let changeTotalPrice = document.getElementById('total_order');                    
                    changeTotalPrice.innerHTML = '<p>Total ' + totalOrder + '</p>';

                    
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
                                changeTotalItem.innerHTML = 
                                '<div class="container subtotal_item"><div class="row no-gutters make_subtotal"><p class="col-7">'+ modifyNumberEach[2] + '</p><p class="col-3">Quantité : ' + b[1] + '</p>'
                                    + '<p class="subtotal col-2">' + b[1]*b[2] + '</p></div></div>';

                            }                           
                        }
                        
                    }
                    
                }    
            }
            console.log(preFinalOrder);


//modification du panier en cas de retour à l'accueil et aux pages produit
            for (let idEach of idItemsTab) {
                let constStringItem = [];
            
                localStorage.setItem(idEach, constStringItem);
                for (let constString of preFinalOrder) {
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
                
            console.log(totalTeddyItems);
        })  


        
    }

          //**********************************************************
        for (let listenRemoveBasket of removeBasketTable) {
            
            const removeOne = document.getElementById ('remove' + listenRemoveBasket);
            
            removeOne.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            console.log(listenRemoveBasket);
            let i = 1
                for (let readColorNumberTable of colorNumberTableAll) {
                    
                    for (let readColorNumberEach of readColorNumberTable) {
                        console.log(readColorNumberEach)
                        
                        if (readColorNumberEach[2]+readColorNumberEach[0] == listenRemoveBasket && i == 1 && readColorNumberEach[1] != 0 ) {
                            readColorNumberEach[1] = readColorNumberEach[1] - 1;
                            const removeOne = document.getElementById ('plus_less_one_' + listenRemoveBasket);
                            removeOne.innerHTML = '<div class="item_color_infos"><div id="plus_less_one_' + readColorNumberEach[2] + readColorNumberEach[0] +'"><div class="container"><div class="make_subtotal row no-gutters"><p class="col-4">' + readColorNumberEach[2] + '  ' + readColorNumberEach[0] + '</p>'
                            + '<p class="col-3">Prix unitaire : ' + readColorNumberEach[3] + '</p><p class="col-3">Quantité : ' + readColorNumberEach[1]
                             + '</p><p class="subtotal col-2">' + readColorNumberEach[1]*readColorNumberEach[3] + '</p></div></div></div>';
                            
                           
                            i--;
                            for (let newTotalTeddy of totalTeddyItems) {
                                if (newTotalTeddy[0] == readColorNumberEach[2]) {
                                    newTotalTeddy[1] = newTotalTeddy[1] - 1;
                                    newTotalTeddy[3] = newTotalTeddy[1]*newTotalTeddy[2];
                                    const changeSubtotal = document.getElementById (readColorNumberEach[2]);
                                    changeSubtotal.innerHTML = 

                                    '<div class="container subtotal_item"><div class="row no-gutters make_subtotal"><p class="col-7">'+ newTotalTeddy[0] + '</p><p class="col-3">Quantité : ' + newTotalTeddy[1] + '</p>'
                                    + '<p class="subtotal col-2">' + newTotalTeddy[1]*newTotalTeddy[2] + '</p></div></div>';


                                }
                            }
                            totalOrder = totalOrder - readColorNumberEach[3];
                            let changeTotalPrice = document.getElementById('total_order');                    
                            changeTotalPrice.innerHTML = '<p>Total ' + totalOrder + '</p>';
                        }
                        console.log(totalTeddyItems);
                        console.log(preFinalOrder);
                    }                    
                }
//modification du panier en cas de retour à l'accueil et aux pages produit               
                for (let idEach of idItemsTab) {
                    let constStringItem = [];
                
                    localStorage.setItem(idEach, constStringItem);
                    for (let constString of preFinalOrder) {
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
            })
        }
//**********************************************************  

        for (let listenRemoveBasket of removeBasketTable) {
                    
            const removeOne = document.getElementById ('add' + listenRemoveBasket);
            
            removeOne.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            console.log(listenRemoveBasket);
            let i = 1
                for (let readColorNumberTable of colorNumberTableAll) {
                    
                    for (let readColorNumberEach of readColorNumberTable) {
                        console.log(readColorNumberEach)
                        
                        if (readColorNumberEach[2]+readColorNumberEach[0] == listenRemoveBasket && i == 1) {
                            readColorNumberEach[1] = readColorNumberEach[1] + 1;
                            const removeOne = document.getElementById ('plus_less_one_' + listenRemoveBasket);
                            removeOne.innerHTML = '<div class="item_color_infos"><div id="plus_less_one_' + readColorNumberEach[2] + readColorNumberEach[0] +'"><div class="container"><div class="make_subtotal row no-gutters"><p class="col-4">' + readColorNumberEach[2] + '  ' + readColorNumberEach[0] + '</p>'
                            + '<p class="col-3">Prix unitaire : ' + readColorNumberEach[3] + '</p><p class="col-3">Quantité : ' + readColorNumberEach[1]
                             + '</p><p class="subtotal col-2">' + readColorNumberEach[1]*readColorNumberEach[3] + '</p></div></div></div>';
                            
                            
                            
                            
                            
                            
                            i--;
                            for (let newTotalTeddy of totalTeddyItems) {
                                if (newTotalTeddy[0] == readColorNumberEach[2]) {
                                    newTotalTeddy[1] = newTotalTeddy[1] + 1;
                                    newTotalTeddy[3] = newTotalTeddy[1]*newTotalTeddy[2];
                                    const changeSubtotal = document.getElementById (readColorNumberEach[2]);
                                    changeSubtotal.innerHTML = '<div class="container subtotal_item"><div class="row no-gutters make_subtotal"><p class="col-7">'+ newTotalTeddy[0] + '</p><p class="col-3">Quantité : ' + newTotalTeddy[1] + '</p>'
                                    + '<p class="subtotal col-2">' + newTotalTeddy[1]*newTotalTeddy[2] + '</p></div></div>';
                                }
                            }
                            totalOrder = totalOrder + readColorNumberEach[3];
                            let changeTotalPrice = document.getElementById('total_order');                    
                            changeTotalPrice.innerHTML = '<p>Total ' + totalOrder + '</p>';
                        }
                        console.log(totalTeddyItems);
                        console.log(preFinalOrder);
                    }                    
                }
//modification du panier en cas de retour à l'accueil et aux pages produit                
                for (let idEach of idItemsTab) {
                    let constStringItem = [];
                
                    localStorage.setItem(idEach, constStringItem);
                    for (let constString of preFinalOrder) {
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
            })
        }

        console.log(preFinalOrder);

};
request.open('GET', 'http://localhost:3000/api/teddies');
request.send();


     
        
           

        
        

