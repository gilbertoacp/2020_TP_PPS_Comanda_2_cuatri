import { EstadosMesa } from './estado-mesa.enum';
import { TipoMesa } from './tipo-mesa.enum';

export class Mesa {
    public id?: string;
    public numero?: number;
    public cantidad?: number;
    public foto?: string;
    public tipo: TipoMesa;
    public fechaAlta: Date = new Date();
    public fechaModificado: Date = null;
    public fechaBaja: Date = null;
    public estado: EstadosMesa = EstadosMesa.LIBRE;
    public qr:any;
}