// donner un nom au cache pour éviter tout conflit avec une autre application //
const cacheName = "vip_cocktail-v1";
// la liste des fichiers à mettre en cache //
const assets = [
  "/",
  "manifest.json",
  "/index.html",
  "/js/app.js",
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
    // tableau des noms de cache sauf le courent : cacheName
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
    const url =
      "https://my-vip-cocktail-default-rtdb.europe-west1.firebasedatabase.app/personne.json";
    if (event.request.url.indexOf(url) > -1) {
      const res = await fetch(event.request);
      // attention le cloange est autorisé et recommandé !!!!
      const clonedRes = res.clone();
      // on stocke la rpéonse dans le cache
	  const cache = await caches.open(cacheName);
      cache.put(event.request.url, clonedRes); //put 
      //----------------------------------------------
    }

    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    } else {
      return fetch(event.request);
    }
  };
  /*
	const url = 'https://my-vip-cocktail-default-rtdb.europe-west1.firebasedatabase.app/personne.json';
		if (event.request.url.indexOf(url) > -1) {
		  event.respondWith(fetch(event.request)
			.then(function (res) {
			  var clonedRes = res.clone();
			  clearAllData('posts')
				.then(function () {
				  return clonedRes.json();
				})
				.then(function (data) {
				  for (var key in data) {
					writeData('posts', data[key]);
				  }
				});
			  return res;
			})
		  );
		  */
  //------------------------------------------------
  // if
  event.respondWith(fetchInterception());
});
