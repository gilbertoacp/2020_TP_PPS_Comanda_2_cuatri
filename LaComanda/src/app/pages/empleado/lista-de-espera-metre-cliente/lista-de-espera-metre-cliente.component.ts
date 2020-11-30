import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../../models/cliente';
import { ClientesService } from 'src/app/services/clientes.service';
import { MesaService } from 'src/app/services/mesa.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PerfilUsuario } from 'src/app/models/perfil-usuario.enum';
import { Mesa } from 'src/app/models/mesa';
import { Pedido } from 'src/app/models/pedido';
import { PedidosService } from 'src/app/services/pedidos.service';
import { EstadosMesa } from 'src/app/models/estado-mesa.enum';

@Component({
  selector: 'app-lista-de-espera-metre-cliente',
  templateUrl: './lista-de-espera-metre-cliente.component.html',
  styleUrls: ['./lista-de-espera-metre-cliente.component.scss'],
})
export class ListaDeEsperaMetreClienteComponent implements OnInit {

  clientesEnEspera: Cliente[];

  listado: any;
  mesasLibres: any;
  private subscription: Subscription;
  cliente : Cliente;
  
  constructor(
    private clientesService: ClientesService,
    private mesaService: MesaService,
    private authService: AuthService,
    private pedidoService: PedidosService,
  ) { }


  ngOnInit()
  {
    this.subscription = this.authService.getCurrentUserData(PerfilUsuario.CLIENTE).subscribe(cliente => {
      if(Array.isArray(cliente)) {
        /** Cliente normal */
        this.cliente = cliente[0];
      } else {
        /** CLiente anónimo */
        this.cliente = cliente;
      }
      console.log(this.cliente);
    });
    this.clientesService.clientesEnListaDeEspera().subscribe(clientes => this.clientesEnEspera = clientes);
    this.obtenerMesasLibres();
  }

  cancelarCliente(cliente: Cliente): void {
    this.clientesService.cambiarEstadoDelCliente(cliente, false);
  }

  obtenerMesasLibres() {
    this.mesaService.getMesasLibre().subscribe(listado => {
      this.mesasLibres = listado;
    });
  }

  // FALTARIA ASIGNAR LA MESA (CON EL USUARIO) Y CREAR EL PEDIDO DEL USUARIO

  asignarMesa(cliente : Cliente) {
    const mesasOpt = this.mesasLibres.map(m => {
      const d =
      {
        name: `mesa${m.numero}`,
        type: 'radio',
        label: `MESA #${m.numero}`,
        value: cliente
      };
      return d;
    });
    const callback = (data) => this.crearPedido(data);
    //this.presentAlertRadio('Mesas libres a asignar', mesasOpt, callback);

  }

  crearPedido(data)
  {
    const mesa = data.mesa as Mesa;
    const cliente = data.cliente as Cliente;

    console.log(mesa);
    console.log(cliente)

    const pedido = new Pedido();
    
    console.log(pedido);

    pedido.mesa = { id: mesa.id, numero: mesa.numero };
    pedido.usuario = { id: cliente.docId, nombre: cliente.nombre };

    this.pedidoService.crearPedido(pedido).then(resp => {
     // Actualizo el estado de la mesa luego de crear el pedido
      mesa.estado = EstadosMesa.ASIGNADA;
      this.mesaService.actualizarMesa(mesa);

      this.clientesService.ponerEnLaMesa(cliente);
      this.clientesService.cambiarEstadoDelCliente(cliente, false);

      //this.presentToast('Mesa asignada', 'toast-info');
    }).catch
    (e => console.log(e));

  }

}
