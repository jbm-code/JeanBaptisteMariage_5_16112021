//la fonction recupère l'objet dans le local storage, puis le reforme à partir de la chaîne linéarisée.
function panierFormatJSON() {
        return JSON.parse(localStorage.getItem('panier'))
    }

async function chargementPanier() {
        const products = await affichageProduitsPanier();
        modifPanier(); 
    }
chargementPanier();


//fonction qui affiche les produits seléctionnés dans la page panier
async function affichageProduitsPanier() {   
    let panier = panierFormatJSON()
    let prixTotal = 0
    let quantiteTotal = 0
    let contentHtml = ""

    console.log("--1--le panier est un tableau des produits, au format JSON", panier)
  
    if(panier.length > 0){
    for (const produit of panier) {
      let produitId = produit.id;
      let produitColor = produit.color;
      let produitQuantity = produit.qty;
  
      await fetch(`http://localhost:3000/api/products/${produitId}`)
        .then(res => res.json())
        .then(produitApi => {
  
          let produitImage = produitApi.imageUrl
          let produitAlt = produitApi.altTxt
          let produitNom = produitApi.name
          let produitPrix = produitApi.price
          let prixTotalParProduit = produitPrix * produitQuantity

          console.table(produitApi)
          console.log(produitQuantity, "x", produitNom)

          contentHtml += `<article class="cart__item item_${produitId}" data-qty="${produitQuantity}" data-name="${produitNom}" data-id="${produitId}" data-color="${produitColor}">
                <div class="cart__item__img">
                  <img src="${produitImage}" alt="${produitAlt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__titlePrice">
                    <h2>${produitNom}</h2>
                    <p id="color">${produitColor}</p>
                    <p data-name="prix" id="prix">${prixTotalParProduit} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p id="quantite">Qté : ${produitQuantity} </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${produitQuantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`
          console.log("prix par produit", prixTotalParProduit)
          prixTotal = parseInt(prixTotal) + parseInt(prixTotalParProduit)
          document.getElementById('totalPrice').innerHTML = prixTotal
          console.log("prix total", prixTotal)
  
          quantiteTotal = parseInt(quantiteTotal) + parseInt(produitQuantity)
          document.getElementById('totalQuantity').innerHTML = quantiteTotal
        })
        .catch(function(err) {
          console.log("erreur")
      })
    } 
    
    } else {
      contentHtml = "Votre panier est vide :'("
      document.getElementById('totalPrice').innerHTML = 
      document.getElementById('totalQuantity').innerHTML = 0
    }
    document.getElementById('cart__items').innerHTML = ""
    document.getElementById('cart__items').innerHTML = contentHtml
  }

//fonction qui filtre le panier; le produit ciblé est "false", donc supprimé 
function deleteItem(aSuppId, aSuppCouleur) {
    const panier = panierFormatJSON();
    const newPanier = panier.filter(itemPanier => {
        if (itemPanier.id === aSuppId && itemPanier.color === aSuppCouleur) {
        return false
        } else {
        return true
        }
    })
    localStorage.setItem('panier', JSON.stringify(newPanier))
    chargementPanier()
    }

//fonction qui applique les  nouveaux paramètres au panier  
function updateQty(aModifId, aModifCouleur, inputValeur) {
    const panier = panierFormatJSON();
    //La méthode findIndex() renvoie l'indice du premier élément du tableau qui satisfait une condition donnée par une fonction.
    const indice = panier.findIndex(item => item.id === aModifId && item.color === aModifCouleur)
    //on change la valeur de cet élément
    panier[indice].qty = inputValeur
    localStorage.setItem('panier', JSON.stringify(panier))
    chargementPanier()
    }

//fonction qui prend en compte les parametres a modifier    
function modifPanier() {
    let supprimer = document.querySelectorAll('.deleteItem')
    let quantites = document.querySelectorAll('.itemQuantity')  

                supprimer.forEach(suppr => {
                suppr.addEventListener('click', function (event) {
                    //"Event.target" est une référence à l'objet qui a envoyé l'événement
                    //La méthode "Element.closest()" renvoie l'ancêtre le plus proche de l'élément courant 
                    const aSupp = event.target.closest('article');
                    const aSuppId = aSupp.dataset.id;
                    const aSuppCouleur = aSupp.dataset.color;
                    const aSuppNom = aSupp.dataset.name;
                    deleteItem(aSuppId, aSuppCouleur)
                    console.log("le produit", aSuppNom,"de couleur",aSuppCouleur, "a été supprimé");
                });
                });
            
                //fonction qui enregistre les paramètres a changer
                quantites.forEach(element => {
                element.addEventListener('change', function (event) {
                    const aModif = event.target.closest('article');
                    const aModifId = aModif.dataset.id;
                    const inputValeur = event.target.value
                    const aModifCouleur = aModif.dataset.color
                    const aModifNom = aModif.dataset.name;
                    updateQty(aModifId, aModifCouleur, inputValeur)
                    console.log("le produit", aModifNom,"de couleur",aModifCouleur, "a été modifié,", 
                                     "maintenant quantité =", inputValeur);
                })
                });
  }