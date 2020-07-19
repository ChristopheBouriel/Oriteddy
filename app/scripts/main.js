

function readList(list) {
    for (let teddy of list) {
        const newTeddy = document.createElement('div');
            newTeddy.classList.add('teddy_item_list', 'text-center', 'card', 'my-5');
            newTeddy.id = teddy.name;           
            let teddyList = document.getElementById('teddies_list');
            teddyList.appendChild(newTeddy);
            newTeddy.innerHTML = '<p class="font-weight-bold mt-3">' + teddy.name + '</p>'
              + '<img src=' + teddy.imageUrl + '>'
               + '<p class="mt-3">' + teddy.price + ' Bath' + '</p>'
                + '<a href="oribear-item.html?' + teddy._id + '" class="stretched-link">Cliquer pour voir plus</a>';       
              let test =  localStorage.getItem(teddy._id);
              console.log(test);
                if (test === null) {
                  localStorage.setItem(teddy._id, '');
                  console.log('ok')
                }
    }
}


function getAllTeddiesInfos() {  
  return fetch('http://localhost:3000/api/teddies').then(response => response.json()).then(json => {readList(json);});  
}


let shit = getAllTeddiesInfos();

















