import { Component, OnInit } from '@angular/core';

import { ChatService } from '../../providers/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {

  mensaje = '';
  elemento: any;


  // tslint:disable-next-line: variable-name
  constructor( public _cs: ChatService  ) {

   this._cs.cargarMensajes()
            .subscribe( ( mensajes ) => {

              // retrasamos para que le dé tiempo a 
              // renderizar la pantalla
              setTimeout( () => {
                this.elemento.scrollTop = this.elemento.scrollHeight;
              }, 20);


            });
 

         /*  this._cs.cargarMensajes()
          .subscribe( ( mensajes ) => {
            console.log('mensajes...', mensajes );
          }); */

  }

  ngOnInit() {
    // para cambiar el scroll 
    this.elemento = document.getElementById('app-mensajes');
  }



  enviar_mensaje() {

    if ( this.mensaje.length === 0 ) {
      return;
    }


    this._cs.agregarMensaje( this.mensaje )
              .then( () => this.mensaje = '')
              .catch( (err) => console.error('Error al enviar',  err ) );

  }

}
