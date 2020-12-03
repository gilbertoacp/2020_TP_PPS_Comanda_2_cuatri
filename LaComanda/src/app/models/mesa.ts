import { EstadosMesa } from './estado-mesa.enum';
import { TipoMesa } from './tipo-mesa.enum';

export interface Mesa {
    id: string;
    docId?: string;
    numero?: number;
    cantidad?: number;
    foto?: string;
    tipo: TipoMesa;
    fechaAlta: Date;
    fechaModificado: Date;
    fechaBaja: Date;
    estado: EstadosMesa;
    qr:any;
    docIdCliente?: string;
    chat?: any
}