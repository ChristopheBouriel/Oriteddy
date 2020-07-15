
function getAllTeddiesInfos() {
    return fetch('http://localhost:3000/api/teddies').then(response => response.json()).then(json => {readList(json);});   
  }

