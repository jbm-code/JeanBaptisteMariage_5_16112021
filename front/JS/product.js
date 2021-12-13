
//Ajout des produits sélectionnés a Local Storage
function ajoutProduitLocalStorage(id) {
    //creation de la variable "bouton" (let a une portée limitée au bloc)
    let bouton = document.getElementById('addToCart');
    bouton.addEventListener("click", function () {
        let color = document.getElementById('colors')
        color = color.options[color.selectedIndex].value;
        const qty = document.getElementById('quantity').value;
        const newItem = {
            id: id,
            qty: qty,
            color: color,
        }
        console.log("--2-- Création de variable du produit", newItem)

        //si le panier contient deja des produits
        if (localStorage.getItem('panier') && localStorage.getItem('panier').length > 0) {
            //pour la lecture, la syntaxe JSON.parse() reforme l’objet à partir de la chaîne linéarisée.
            const cart = JSON.parse(localStorage.getItem('panier'));
            const productPosition = cart.findIndex(item => item.id === newItem.id && item.color === newItem.color);
            
            //si la fonction renvoie faux pour tous les éléments du tableau, le résultat vaut -1.
            //cad si l'id ou la couleur sont nouveaux
            if (productPosition === -1) {
                cart.push(newItem);
                //on linéarise l’objet avec la syntaxe JSON.stringify().
                //Cette opération transforme l’objet en une chaîne de caractères.
                localStorage.setItem('panier', JSON.stringify(cart));
                console.log("--3b-- Ajout a Local Storage du nouveau produit") 
                console.table(newItem)

            // l'id et la couleur sont les mêmes, on change la quantité           
            } else {           
                cart[productPosition].qty = parseInt(cart[productPosition].qty) + parseInt(newItem.qty);
                localStorage.setItem('panier', JSON.stringify(cart));
                console.log("--3c-- Ajout a Local Storage des nouvelles quantités = produit existant, quantités modifiées") 
                console.table(newItem)
            }

        //si le panier est vide, creation d'un nouveau 
        } else {
        let newCart = new Array();
        newCart.push(newItem);
        console.log("--3a-- Ajout a Local Storage du premier produit") 
        console.table(newCart)
        localStorage.setItem('panier', JSON.stringify(newCart));
        }
    })
}   
 //afichage des données dans la page produit   
    async function affichagePageProduit() {
        // propriété "window.location.href" qui recupere l'url de la page courante 
        const str = window.location.href;
        //https://waytolearnx.com/2019/10/comment-recuperer-les-parametres-durl-en-javascript.html
        const url = new URL(str)
        const recherche_param = new URLSearchParams(url.search);
        //La méthode has() peut être utilisée pour vérifier si le paramètre existe dans l’URL. 
        //dans script.js =>  <a href="./product.html?id=${item._id}"> 'id' a été défini !! 
        if (recherche_param.has('id')) {
        //Si le paramètre existe, sa valeur peut être trouvée via la méthode get.
            let IdProduitUrl = recherche_param.get('id');
            await fetch(`http://localhost:3000/api/products/${IdProduitUrl}`)
                .then(res => res.json())                
                .then(produit => {
                    document.querySelector(".item__img").innerHTML = `<img src="${produit.imageUrl}" alt="${produit.altTxt}">`;
                    document.getElementById("title").innerHTML = produit.name;
                    document.getElementById("price").innerHTML = produit.price;
                    document.getElementById("description").innerHTML = produit.description;
                    produit.colors.forEach(couleur => {
                        document.getElementById("colors").innerHTML += `<option value="${couleur}">${couleur}</option>`;
                        document.title = produit.name
                    });
                })
                .catch(function(err) {
                    console.log("erreur")
                })
                ajoutProduitLocalStorage(IdProduitUrl)
            console.log("--1-- Id récuperé de l URL = " + IdProduitUrl)
        }
    }  
    affichagePageProduit();



