// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyAXZOAyi5-sSVeOou5dhrKdBbrtgUy6MhY",
    authDomain: "lacomanda-4960e.firebaseapp.com",
    databaseURL: "https://lacomanda-4960e.firebaseio.com",
    projectId: "lacomanda-4960e",
    storageBucket: "lacomanda-4960e.appspot.com",
    messagingSenderId: "1010262992102",
    appId: "1:1010262992102:web:75ff51f9840fb728848727"
  },
  authRegister: 'https://us-central1-lacomanda-4960e.cloudfunctions.net/registrarUsuario'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
