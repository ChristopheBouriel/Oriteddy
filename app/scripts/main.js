
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
  
  
  


function readList(list) {
    for (let teddy of list) {
        const newTeddy = document.createElement('div');
            newTeddy.classList.add('teddy_item_list', 'text-center', 'card', 'product', 'my-5');
            newTeddy.id = teddy.name;           
            let teddyList = document.getElementById('teddies_list');
            teddyList.appendChild(newTeddy);
            newTeddy.innerHTML = '<p class="font-weight-bold mt-3">' + teddy.name + '</p>'
              + '<img src=' + teddy.imageUrl + '>'
               + '<p class="mt-3">' + teddy.price + ' Bath' + '</p>'
                + '<a href="oribear-item.html?' + teddy._id + '" class="stretched-link mb-2">Cliquer pour voir plus</a>';       
              let testId =  localStorage.getItem(teddy._id);
              console.log(testId);
                if (testId === null) {
                  localStorage.setItem(teddy._id, '');
                  console.log('ok')
                }
              }
              let seeTotalArticles = localStorage.getItem("totalArticles");
    console.log(seeTotalArticles);
    if (seeTotalArticles === null) {
      localStorage.setItem("totalArticles", '');
      console.log('raz')  
    }
    
       
        
}


function getAllTeddiesInfos() {  
  return fetch('http://localhost:3000/api/teddies').then(response => response.json()).then(json => {readList(json);});  
}

showTotalArticles();
getAllTeddiesInfos();



















