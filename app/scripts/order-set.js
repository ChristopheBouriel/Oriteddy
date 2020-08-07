//vérification : l'utilisateur a-t-il été amené à cette page après avoir validé le formulaire ou a-t-il cliqué sur le bouton "Commande" du menu ?
function checkNew() {
    const check = parseInt(localStorage.isNew);
    if( check == 1) {
        const message = document.getElementById('message_order');
        message.innerHTML = '<p>Votre demande a bien été prise en compte</p><p>Merci de votre confiance !</p>';
        buildNewOrder();
    }
    else {
        askInfos();   
    };   
}

//écriture du numéro de commande reçu de l'API si une nouvelle commande vient d'être passée
function buildNewOrder() {
    const orderNumber = document.getElementById('order_number');
    orderNumber.classList.add('order_view');   
    orderNumber.innerHTML = '<div class="mt-2 ml-3"><p class="mb-1">Votre numéro de commande : </p><p>' + localStorage.idOrder + '</p></div>';
    const resume = JSON.parse(localStorage.orderResume);
    const newOrder = true;
    localStorage.setItem('isNew', 0);
    writeResume(resume, newOrder);
}

checkNew();
showTotalArticles();

//écriture du formulaire dans le cas où l'utilisateur n'a pas validé celui de la page panier 
//mais voudrait essayer de retrouver sa dernière commande
function askInfos() {
    const message = document.getElementById('user_infos');
        message.innerHTML = 
        '<div class="order_infos_2"><p class="text-center px-2" id="initial_message">Veuillez remplir les champs suivants afin que nous tentions de retrouver votre dernière commande'
        + '<p id="form_message">* Tous les champs sont obligatoires, veillez à respecter le format indiqué</p></div>'
        + '<form id="form_2" onsubmit="return searchOrder()">' +
  '<div class="form-group">' +
      '<label for="firstname">Prenom</label>' +
      '<input id="firstname" class="form-control" required type="text" placeholder="Prénom (30 caractères maximum)" pattern="[A-Z\u00C0-\u00D6\u00D8-\u00DF \'-]{1}[a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F \'-]{2,30}"/></div>' +
  '<div class="form-group">' +
      '<label for="lastname">Nom</label>' +
      '<input id="lastname" class="form-control" required type="text" placeholder="NOM (40 caractères maximum)" pattern="[A-Z\u00C0-\u00D6\u00D8-\u00DF \'-]{2,40}"/></div>' +
  '<div class="form-group">' +
      '<label for="email">Adresse email</label>' +
      '<input id="email" class="form-control" type="email" name="adresse_mail" required /></div>' +
  '<div id="validate_button">' +
    '<button class="btn command mb-2" type="submit" id="validate_order">Valider</button></div></form>';
}

//récupération des informations de la dernière commande si celles-ci sont toujours présentes dans le localStorage
function searchOrder() {
    const firstName = $('#firstname').val();
    const lastName = $('#lastname').val();
    const checkUser = firstName + lastName;        
    let checkOrder = localStorage.getItem(checkUser);
    checkOrder = JSON.parse(checkOrder);
    if(checkOrder === null) {
        const message = document.getElementById('message_order');
        message.innerHTML = '<p class="px-2">Désolé, nous n\'avons pas trouvé de commande récente à ce nom effectuée depuis ce navigateur</p>';
        const suppress = document.getElementById('order_infos');        
        const remove = document.getElementById('order_answer');
        remove.removeChild(suppress);            
    }
    else {
        buildOldOrder(checkOrder);
    };
    return false;    
}

//convertion des prix de cent en euro
function convertCents(priceCent) {
   const priceEuro = priceCent/100;
   return priceEuro;
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

//écriture du numéro de la dernière commande si les informations de celle-ci ont pu être retrouvées
function buildOldOrder(checkOrder) {    
    const lastOrder = Object.values(checkOrder)
    const lastResume = lastOrder[1];
    const oldOrder = false;
    const message = document.getElementById('message_order');
    message.innerHTML = '<p class="px-2">Votre dernière commande effectuée portant le numéro :</p><p>' + lastOrder[0] + '</p>';
    const suppress = document.getElementById('order_number');        
    const remove = document.getElementById('order_infos');
    remove.removeChild(suppress); 
    writeResume(lastResume, oldOrder);         
}

//écriture du corps de la commande passée (nouvelle ou ancienne)
function writeResume(resume, newOrder) {
    let totalOrder = 0; 
    let teddyLine, showResume;
    for(let teddy of resume) {
        totalOrder = totalOrder + teddy[3];
        showResume = document.createElement('div');
        showResume.classList.add('mb-2', 'teddy_each');
        teddyLine = document.getElementById('resume');
        teddyLine.appendChild(showResume);
        showResume.innerHTML = '<div class="container subtotal_item"><div class="row no-gutters make_subtotal"><p class="col-4">'
        + teddy[0] + '</p><p class="col-3 text-left">Prix : '+ convertCents(teddy[2]) + ' €</p><p class="col-3 text-center">Quantité</p>'
        + '<p class="subtotal col-2 text-right">Montant</p></div><div class="row no-gutters make_subtotal">'
        + '<p class="col-7 ref_teddy">ref : ' + teddy[4] + '</p>'
        + '<p class="col-3 text-center">' + teddy[1] + '</p><p class="subtotal col-2 text-right">' + convertCents(teddy[3]) + ' €</p></div></div>';

        if(newOrder === true) {
            localStorage.setItem(teddy[4], '');
            localStorage.setItem('totalArticles', '');
        }        
    }
    const showTotal = document.getElementById('show_total');
    showTotal.classList.add('order_view');        
    showTotal.innerHTML = '<p class="col-8 pt-2">Montant total : </p><p class="col-4 pt-2 text-right">' + convertCents(totalOrder) + ' €</p>';
    const suppress = document.getElementById('user_infos');        
    const remove = document.getElementById('order_infos');
    remove.removeChild(suppress);     
}