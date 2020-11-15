import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EncuestasService {

  constructor(private db:AngularFirestore) { }

  guardarEncuestaCliente(mesa, idCliente, rangoEdad, llamativo, puntajeProtocolo, arrayRecomendados, sugerencia, arrayFotos)
  {
    return new Promise((resolve, rejected) => {
      this.db.collection("encuestasClientes").add({
        mesa: mesa,
        cliente: idCliente,
        fecha: Date.now(),
        rangoEdad: rangoEdad,
        llamativo: llamativo,
        puntajeProtocolo: puntajeProtocolo,
        recomendados: arrayRecomendados,
        sugerencia: sugerencia,
        fotos: arrayFotos
      }).catch(error => {
        alert(error);
        rejected(error)
      });
    });
  }

}
