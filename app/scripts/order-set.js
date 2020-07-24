function checkNew() {
    let check = parseFloat(localStorage.isNew);
    console.log(check);
    if( check == 1) {
        let message = document.getElementById('message_order');
        message.innerHTML = '<p>Votre demande a bien été prise en compte</p><p>Merci de votre confiance !</p>'
        buildOrder();
    }
    else if( check == 0) {
        let message = document.getElementById('message_order');
        message.innerHTML = '<p>Votre dernière commande effectuée</p>'
        buildOrder();
        
    }
    else{
        let message = document.getElementById('message_order');
        let suppress = document.getElementById('order_infos');
        message.innerHTML = '<p>Nous n\'avons pas trouvé de commande récente effectuée depuis ce navigateur</p>'
        let remove = document.getElementById('order_answer');
        remove.removeChild(suppress);
    }
}

function buildOrder() {
    let orderNumber = document.getElementById('order_number');    
    orderNumber.innerHTML = 
    '<div class="mt-2 ml-3"><p class="mb-1">Votre numéro de commande : </p><p>' + localStorage.idOrder + '</p></div>';
    let resume = JSON.parse(localStorage.orderResume);
    console.log(resume);
    let totalOrder = 0;
    for(let teddy of resume) {
        totalOrder = totalOrder + teddy[3];
        const showResume = document.createElement('div');
        showResume.classList.add('mb-2', 'teddy_each');
        let teddyLine = document.getElementById('resume');
        teddyLine.appendChild(showResume);
        showResume.innerHTML =
        '<div class="container subtotal_item"><div class="row no-gutters make_subtotal"><p class="col-4">'
    + teddy[0] + '</p><p class="col-3 text-left">Prix : '+ teddy[2] + '</p><p class="col-3 text-center">Quantité</p>'
    + '<p class="subtotal col-2 text-right">Montant</p></div><div class="row no-gutters make_subtotal">'
     + '<p class="col-7 ref_teddy">ref : ' + teddy[4] + '</p><p class="col-3 text-center">' + teddy[1] + '</p><p class="subtotal col-2 text-right">' + teddy[3] + '</p></div></div>';

        localStorage.setItem(teddy[4], '');
        console.log(localStorage.getItem(teddy[4]));
        localStorage.setItem("totalArticles", '');
    }
    
        let showTotal = document.getElementById('show_total');
        
        showTotal.innerHTML = '<p class="col-8 pt-2">Montant total : </p><p class="col-4 pt-2 text-right">' + totalOrder + '</p>';

    localStorage.setItem("isNew", 0);
    
}


checkNew();
//localStorage.setItem("isNew", '');
//localStorage.setItem("isNew", 1);