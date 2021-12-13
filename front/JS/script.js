// appel a l'API de affichage des données dans la page d'acceuil
async function fetchAPI() {
    await fetch("http://localhost:3000/api/products")
    .then(reponseAPI => reponseAPI.json())
    .then(listeDesProduits => {    
        for (const item of listeDesProduits) {
            document.querySelector("section").innerHTML +=
                `<a href="./product.html?id=${item._id}">
                    <article>
                        <img src="${item.imageUrl}" alt="${item.altTxt}">
                        <h3 class="productName">
                            ${item.name}
                        </h3>
                        <p class="productDescription">
                        ${item.description}
                        </p>
                    </article>
                </a>`
        }
    }) 
    .catch(function(err) {
        console.log("erreur")
    })
}
fetchAPI()