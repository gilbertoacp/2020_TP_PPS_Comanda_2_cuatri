import { Pipe, PipeTransform } from '@angular/core';
import { TipoEmpleado } from '../models/tipo-empleado.enum';

@Pipe({
  name: 'tipoEmpleado'
})
export class TipoEmpleadoPipe implements PipeTransform {

  transform(value: string): string {
    let tipo: string = '';
    
    switch(value) {
      case '0':
        tipo = 'Mozo';
      break;

      case '1':
        tipo = 'Cocinero';
      break;

      case '3':
        tipo = 'Metre';
      break;

      case '2':
        tipo = 'Bartender';
      break;
    }

    return tipo;
  }

}
