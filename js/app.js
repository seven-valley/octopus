if ("serviceWorker" in navigator) {
	try {
		 const registration = await navigator.serviceWorker.register("./sw.js");
	} catch (error) {
		console.log("Une erreur à eu lieu !", error.message);
	}
}