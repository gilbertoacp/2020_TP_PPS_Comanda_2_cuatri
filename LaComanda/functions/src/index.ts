import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const cors = require('cors')({origin: true});
admin.initializeApp();

const auth = admin.auth();

export const registrarUsuario = functions.https.onRequest((req, res) => {

  cors(req, res, async () => {
    const {correo, clave} = req.body;

    try {
      const cred = await auth.createUser({
        email: correo,
        password: clave,
      });
      res.json({
        registrado: true,
        data: cred,
      });
    } catch(err) {
      res.json({
        registrado: false,
        data: err,
      });
    }
  });
 
});