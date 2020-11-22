import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import * as express from 'express';

const cors = require('cors')({origin: true});
admin.initializeApp();

const auth = admin.auth();
const app = express();
const config = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '<correo>',
        pass: '<clave>',
    },
});

app.use(cors);

app.post('/', (req, res) => {

  const body = req.body;
  const isValidMessage = body.message && body.to &&  body.subject;

  if(!isValidMessage) {
    return res.status(400).send({
      message: 'Invalid Request',
    });
  }

  const mensaje = {
    from : '<correo>',
    to: body.to,
    subject: body.subject,
    text: body.message,
  }

  config.sendMail(mensaje, (err, data) => {
    if(err) {
      return res.status(500).send({message: 'err' + err.message});
    }

    return res.send({message: 'email sent'});
  });
});


export const api = functions.https.onRequest(app);

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