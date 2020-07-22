//récupération des infos du teddy

function getTeddyInfos() {
    return fetch(urlApiTeddy).then(response => response.json()).then(json => {getOneTeddyInfos(json);
        addBasket(json);});   
  }


//affichage initial du produit
let addItems = {};
let item = 0;
function getOneTeddyInfos (infosTeddy) {    
    const teddyView = document.createElement('div');
    teddyView.classList.add('teddy_item_view', 'text-center', 'mt-md-5');
    let teddyInfos = document.getElementById('teddy_view');
    teddyInfos.appendChild(teddyView);
    teddyView.innerHTML = '<p class="font-weight-bold mt-3">' + infosTeddy.name + '</p>'
        + '<img src=' + infosTeddy.imageUrl + '>'
        + '<p class="mt-3">' + infosTeddy.price + ' Bath' + '</p>'
        + '<p>' + infosTeddy.description + '</p>';
    const teddyViewNav = document.createElement('div');
    teddyViewNav.classList.add('teddy_view_nav');
    let teddyNavButtons = document.getElementById('teddy_view');
    teddyNavButtons.appendChild(teddyViewNav);
    teddyViewNav.innerHTML = '<p><a href="index.html#' + infosTeddy.name + '"><div class="back_to_list"><i class="fas fa-paw"></i><p>Retour</p></div></a></p>';

    let initColor = document.getElementById('color_choice');
    initColor.innerHTML = infosTeddy.colors[0];
    addItems[0] = infosTeddy.colors[0];
    let showQuantity = document.getElementById('quantity_choice');
    showQuantity.innerHTML = item;
    let teddyColors = infosTeddy.colors;
    showColors(teddyColors);
}

//affichage des couleurs dans le menu déroulant et sélection
function showColors(teddyColors) {
    for (let colorName of teddyColors) {
        const newColor = document.createElement('a')            
        newColor.classList.add('dropdown-item');
        newColor.id = colorName;
        let addNewColor = document.getElementById('colors_list');
        addNewColor.appendChild(newColor);
        newColor.innerHTML = colorName;        
    };

    for (let prout of teddyColors) { 
        let eltColor = document.getElementById (prout); 
        eltColor.addEventListener('click', function() {
            let showColor = document.getElementById('color_choice');
            showColor.innerHTML = prout;
            addItems[0] = prout;
            addItems[1] = 0;
            item = 0;
            let showQuantity = document.getElementById('quantity_choice');
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
        console.log(item);
        let showQuantity = document.getElementById('quantity_choice');
            showQuantity.innerHTML = item;
            addItems[1] = item;
        });
        console.log(addItems);
}

//sélection du nombre désiré dans la couleur affichée --> enlever
function removeOne() {
    const less = document.getElementById ('remove');
        less.addEventListener('click', function(event) {
        event.preventDefault();       
        if (item>0) {
            item--;           
            console.log(item);
            let showQuantity = document.getElementById('quantity_choice');
            showQuantity.innerHTML = item;
            addItems[1] = item;
            }
        });
        console.log(addItems);   
}

//ajouter la sélection au panier
function addBasket(infos) {
    const addValidation = document.getElementById('add_basket');
        addValidation.addEventListener('click', function(event) {
            event.preventDefault();
            if (item!=0) {
                console.log(addItems);
                let constObjName = '"name":"' + infos.name + '",';
                let constObjColor = '"color":"' +  addItems[0] + '",';
                console.log(constObjColor);
                let constObjQuty = '"nombre":' + addItems[1] + ',';
                let constObjPrice = '"price":' + infos.price;
                let constObj = constObjName + constObjColor + constObjQuty + constObjPrice;
                console.log(constObj);
                let grr = localStorage.getItem(idItem);            
                grr = '{' + constObj +'},' + grr;
                localStorage.setItem(idItem, grr);
                console.log(localStorage.getItem(idItem));
                
            }
            let allArticles = localStorage.getItem("totalArticles");
            allArticles = parseFloat(allArticles);
            let adds = addItems[1];            
            allArticles = allArticles + adds;            
            localStorage.setItem("totalArticles", allArticles);
            showTotalArticles();
            addItems = [];
            let showQuantity = document.getElementById('quantity_choice');
            showQuantity.innerHTML = 0;
        });
};

function showTotalArticles() {
    let totalArticles = document.getElementById('total_articles');
    let checkBasket = localStorage.getItem("totalArticles");
    checkBasket = parseFloat(checkBasket);
    console.log(checkBasket);
    if(checkBasket != 0) {
      totalArticles.innerHTML = localStorage.getItem("totalArticles");
      console.log('zut');
    }
    else {
      let totalArticles = document.getElementById('total_articles');
      totalArticles.innerHTML = '';
      console.log('put');
    }
  }

let model = window.location.search;
let idItem = model.substring(1);
let urlApiTeddy = 'http://localhost:3000/api/teddies/' + idItem;
console.log (urlApiTeddy);
showTotalArticles();
getTeddyInfos();
addOne();
removeOne();
