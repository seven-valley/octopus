const database ='https://my-vip-cocktail-default-rtdb.europe-west1.firebasedatabase.app/'
const noeud = database+'personne.json';

const creationLigneTr= (personne)=>{
    const tbody = document.querySelector('tbody');
    const template = document.getElementById('ligne');
    const clone = template.content.cloneNode(true);
    if (personne.status){
        clone.querySelector('tr').className='table-success';
    }
    else{
        clone.querySelector('tr').className='table-danger'; 
    }
    console.log(clone.querySelectorAll('td'));
    clone.querySelectorAll('td')[0].innerHTML=personne.prenom;
    clone.querySelectorAll('td')[1].innerHTML=personne.nom;
    console.log(personne);
   // clone.querySelector('tr').setAttribute('data-id',personne.id);
    clone.querySelector('.btn-danger').onclick= async (evt)=>{
            //let id=  evt.target.closest('tr').dataset.id;
            console.log(personne.id);
            const retour = await effacerFire(personne.id);
            console.log(retour);
           
            evt.target.closest('tr').remove();
           
          }
          clone.querySelector('.btn-warning').onclick= async (evt)=>{
            let id=  evt.target.closest('tr').dataset.id;
            await modifierFire(personne);
            personne.status =!personne.satus;
            if (personne.status){
                evt.target.closest('tr').className='table-success';
            }
            else{
                evt.target.closest('tr').className='table-danger'; 
            }
            console.log(id);
            
          }
    tbody.append(clone);
}
const effacerFire= async(id)=>{
    const response = await fetch(database+'personne/'+id+'.json', {
        method: "DELETE",
       
    });
}
const modifierFire= async(personne)=>{
    const response = await fetch(database+'personne/'+personne.id+'.json', {
        method: "PATCH",
        body: JSON.stringify( { status: ! personne.status } ) 
       
    });
}


const ajouterFire= async(prenom,nom)=>{
   const personne ={prenom:prenom,nom:nom,status:true}
   const response = await fetch(noeud, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify(personne),
		});
		const data = await response.json();
        console.log(data);
    return data.name;
}

const lectureFire= async()=>{
    const response = await fetch(noeud);
    const data = await response.json();
    for (let id in data){
        const personne = data[id];
        personne.id=id;
        creationLigneTr(personne);
    }

}

document.getElementById('ajouter').onclick = async()  =>{
    const nom = document.getElementById('nom').value;
    document.getElementById('nom').value=''; // vider input
    const prenom = document.getElementById('prenom').value;
    document.getElementById('prenom').value=''; // vider input
    const id =await ajouterFire(prenom,nom);
    const personne ={id:id,prenom:prenom,nom:nom,status:true}
    creationLigneTr(personne);
}

lectureFire();