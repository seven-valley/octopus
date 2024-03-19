//-------------------------------------------------------
// CREATE DATA BASE  cocktail-store indexed DB
//-------------------------------------------------------
var dbPromise;
const initDB= async()=>{
    dbPromise= await idb.openDB("cocktail-store", 1, {
    upgrade(db) {
      // Création de la table personne
      //const store = db.createObjectStore('personne', {keyPath: 'id', autoIncrement: true });
      const store = db.createObjectStore("personne", { keyPath: "id" });
      console.log("creation de la base");
    },
  });
 
}
initDB();
//-------------------------------------------------------
// INSERT INTO indexed DB
//-------------------------------------------------------
const writeData= async (table,data) =>{
    const tx = dbPromise.transaction(table, "readwrite");
    await tx.store.put(data);
    console.log('ecriture indexed DB ...');
    console.log(data)
    return tx.complete;
} 
 
//-------------------------------------------------------
// SELECT indexed DB
//-------------------------------------------------------
const getAllData = async (table) =>{
    const tx = dbPromise.transaction(table, "readonly");
    const store = tx.objectStore(table);
    const response = await store.getAll();
    tab=[]
      for (let p of response) {
        datas.push(p);
      }
    return tab;
} 
//-------------------------------------------------------
// DELETE FROM indexed DB
//-------------------------------------------------------
const deleteData= async (table) =>{
    const tx = dbPromise.transaction(table, "readwrite");
    await tx.store.clear();
    return tx.complete;
} 

