//importScripts("./js/umd.js");
//importScripts("./js/idb.js");
console.log('aaa');
// donner un nom au cache pour éviter tout conflit avec une autre application //
const cacheName = "vip_cocktail-v1";
// la liste des fichiers à mettre en cache //
const assets = [
  "/",
  "manifest.json",
  "/index.html",
  "/js/app.js",
  "/js/umd.js",
  "/js/idb.js",
  "/js/db.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
];

//------------------------------------
// Instalation : mettre en cache
//------------------------------------
self.addEventListener("install", async (event) => {
  const mettreEnCache = async () => {
    const cache = await caches.open(cacheName);
    for (let asset of assets) {
      cache.add(asset);
    }
  };
  //------------------------------------------------
  event.waitUntil(mettreEnCache());
});
//------------------------------------
// Activation : nettoyer le cache
//------------------------------------
self.addEventListener("activate", (event) => {
  //------------------------------------------------
  const deleteCache = async (key) => {
    await caches.delete(key);
  };
  //------------------------------------------------
  const deleteOldCaches = async () => {
    const keyList = await caches.keys();
    // tableau des noms de cache sauf le courant : cacheName
    const cachesToDelete = keyList.filter((key) => key !== cacheName);
    /*
		cachesToDelete.map(deleteCache)
		cachesToDelete.map(key => deleteCache(key));
		cachesToDelete.forEach(key => {
  			deleteCache(key)
		}
		*/
    await Promise.all(cachesToDelete.map(deleteCache));
  };
  //------------------------------------------------
  event.waitUntil(deleteOldCaches());
});
//------------------------------------
// Interception des fetch
//------------------------------------
self.addEventListener("fetch", async (event) => {
  const fetchInterception = async () => {
    //----------------------------------------------
    // Interception lecture des personnes
    //----------------------------------------------
    const url =
      "https://my-vip-cocktail-default-rtdb.europe-west1.firebasedatabase.app/personne.json";
    if (event.request.url.indexOf(url) > -1 && event.request.method == "GET") {
      try {
        console.log("Interception lecture des personnes");
        const res = await fetch(event.request);
        // attention le clonage est autorisé et recommandé !!!!
        const clonedRes = res.clone();
        // on stocke la réponse dans le cache
        const cache = await caches.open(cacheName);
        console.log(event.request.url);
        console.log(clonedRes);
        cache.put(event.request.url, clonedRes); //put
        // on stocke la réponse dans la base indexedDB
        const data = await res.json();
        console.log('------------vide le cache');
        await deleteData('personne');
        for (let id in data) {
          const personne = data[id];
          personne.id = id;
          // console.log('abc');
          // console.log(personne);
          await writeData("personne", personne);
        }
      } catch {
        // servir le indexed db getALL ---- A FAIRE
        console.log("hors ligne");
      }
    }
    //----------------------------------------------
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {
      //console.log("vient du cache", cachedResponse);
      return cachedResponse;
    } else {
      //console.log("vientPAS cache", event.request);
      return fetch(event.request);
    }
  };

  //------------------------------------------------
  // if
  event.respondWith(fetchInterception());
});
//------------------------------------
// Synchronisation background
//------------------------------------
const database =
  "https://my-vip-cocktail-default-rtdb.europe-west1.firebasedatabase.app/";
const noeud = database + "personne.json";

// appeller quand sync
self.addEventListener("sync", async (event) => {
  console.log("[Service Worker] Background syncing", event);
  const checkSyncTask = async () => {
    if (event.tag === "sync-new-personne") {
      const data = await readAllData("ajouter-personne");
      for (let d of data) {
        const response = await fetch(noeud, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(d),
        });
        const data = await response.json();
      }
    }
  };
  event.waitUntil(checkSyncTask());
});
//------------------------------------
//------------------------------------
