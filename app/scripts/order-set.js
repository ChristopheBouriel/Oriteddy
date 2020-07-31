function checkNew() {
    let check = parseFloat(localStorage.isNew);
    console.log(check);
    if( check == 1) {
        const message = document.getElementById('message_order');
        message.innerHTML = '<p>Votre demande a bien été prise en compte</p><p>Merci de votre confiance !</p>'
        buildNewOrder();
    }
    else {
        askInfos();   
    }    
}

function buildNewOrder() {
    const orderNumber = document.getElementById('order_number');
    orderNumber.classList.add('order_view');   
    orderNumber.innerHTML = 
    '<div class="mt-2 ml-3"><p class="mb-1">Votre numéro de commande : </p><p>' + localStorage.idOrder + '</p></div>';
    let resume = JSON.parse(localStorage.orderResume);
    console.log(resume);
    let newOrder = true;
    localStorage.setItem('isNew', 0);
    writeResume(resume, newOrder);
}

checkNew();
//localStorage.setItem("isNew", '');
//localStorage.setItem("isNew", 1);

function askInfos() {
    const message = document.getElementById('user_infos');
        message.innerHTML = 
        '<p class="text-center" id="initial_message">Veuillez remplir les champs suivants afin que nous tentions de retrouver votre dernière commande'
         + '<form id="form_2" onsubmit="return searchOrder()">' +
  '<div class="form-group">' +
      '<label for="firstname">Prenom</label>' +
      '<input id="firstname" class="form-control" required type="text"/></div>' +
  '<div class="form-group">' +
      '<label for="lastname">Nom</label>' +
      '<input id="lastname" class="form-control" required type="text"/></div>' +
  '<div class="form-group">' +
      '<label for="email">Adresse email</label>' +
      '<input id="email" class="form-control" type="email" name="adresse_mail" required /></div>' +
  '<div id="validate_button">' +
    '<button class="btn command mb-2" type="submit" id="validate_order">Valider</button></div></form>';
}

function searchOrder() {
    let firstName = $('#firstname').val();
    let lastName = $('#lastname').val();
    let checkUser = firstName + lastName;        
    let checkOrder = localStorage.getItem(checkUser);
    checkOrder = JSON.parse(checkOrder);
    console.log(checkOrder);
    if(checkOrder === null) {
        let message = document.getElementById('message_order');
        message.innerHTML = '<p>Nous n\'avons pas trouvé de commande récente à ce nom effectuée depuis ce navigateur</p>'
        + '<p>Veuillez vérifier les informations que vous avez saisies</p>';
        const suppress = document.getElementById('initial_message');        
        const remove = document.getElementById('user_infos');
        remove.removeChild(suppress);            
    }
    else {
        buildOldOrder(checkOrder);
    }
    return false;    
}

function convertCents(priceCent) {
    let priceEuro = priceCent/100;
    return priceEuro;
}

function buildOldOrder(checkOrder) {    
    let lastOrder = Object.values(checkOrder)
    let lastResume = lastOrder[1];
    console.log(lastResume);
    let oldOrder = false;
    const message = document.getElementById('message_order');
    message.innerHTML = '<p>Votre dernière commande effectuée portant le numéro :</p><p>' + lastOrder[0] + '</p>';
    const suppress = document.getElementById('order_number');        
    const remove = document.getElementById('order_infos');
    remove.removeChild(suppress); 
    writeResume(lastResume, oldOrder);         
}

function writeResume(resume, newOrder) {
    let totalOrder = 0; 
    let teddyLine, showResume;
    for(let teddy of resume) {
        totalOrder = totalOrder + teddy[3];
        showResume = document.createElement('div');
        showResume.classList.add('mb-2', 'teddy_each');
        teddyLine = document.getElementById('resume');
        teddyLine.appendChild(showResume);
        showResume.innerHTML =
        '<div class="container subtotal_item"><div class="row no-gutters make_subtotal"><p class="col-4">'
        + teddy[0] + '</p><p class="col-3 text-left">Prix : '+ convertCents(teddy[2]) + ' €</p><p class="col-3 text-center">Quantité</p>'
        + '<p class="subtotal col-2 text-right">Montant</p></div><div class="row no-gutters make_subtotal">'
        + '<p class="col-7 ref_teddy">ref : ' + teddy[4] + '</p>'
        + '<p class="col-3 text-center">' + teddy[1] + '</p><p class="subtotal col-2 text-right">' + convertCents(teddy[3]) + ' €</p></div></div>';

        if(newOrder === true) {
            localStorage.setItem(teddy[4], '');
            console.log(localStorage.getItem(teddy[4]));
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