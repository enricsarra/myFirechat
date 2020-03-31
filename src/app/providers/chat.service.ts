import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

import * as firebase from 'firebase/app';
// import { firebase } from '@firebase/app';
// import 'firebase/auth';
import { auth } from 'firebase/app';

import { Mensaje } from '../interface/mensaje.interface';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  // chats se utiliza para que desde chat.component
  // el *ngfor apunte a _cs del componente que apunta
  // a ChatService ---> *ngFor="let chat of _cs.chats">
  // El mensaje será: {{ chat.mensaje}}
  public chats: Mensaje[] = [];

  public usuario: any = {};

  constructor( private afs: AngularFirestore ,
               public afAuth: AngularFireAuth) {

  this.afAuth.authState.subscribe( user => {

       // console.log( 'Estado del usuario: ', user );
      // salir  si no hay usuario
      console.log('user...', user);
      if ( !user ) {
        return;
      }

      /*  Si usuario conectado ==> Elejimos los datos del usuario.
      uid es único, es decir, si nos hemos logueado con direrentes proveedores este uid es único. Significa que nos hemos logueado y punto.
      */

       /* this.usuario.nombre = user.displayName;
       this.usuario.uid = user.uid;
       this.usuario.email = user.email;
       this.usuario.phoneNumber = user.phoneNumber;
       this.usuario.photoURL = user.photoURL; */

      this.usuario = {nombre: `${ user.displayName}`,
                     uid: `${ user.uid }`,
                     email: `${ user.email}`,
                     photoURL: `${ user.photoURL}`,
      };
      console.log('usuario', this.usuario);


    });

  }

   login( proveedor: string ) {

     if ( proveedor === 'google' ) {

      this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());

       // this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      // La propiedad 'auth' no existe en el tipo 'AngularFireAuth'.ts(2339)

     } else {
      this.afAuth.signInWithPopup( new auth.TwitterAuthProvider());
     }

   }

   logout() {
     console.log('Antes  this.usuario ', this.usuario);

     this.usuario = {};

     // this.afAuth.auth.signOut();      <-------------------
     // (La propiedad 'auth' no existe en el tipo 'AngularFireAuth'.ts(2339))

     this.afAuth.signOut()
     .then( resp => console.log('Respuesta this.afAuth.signOut()', resp))
     .catch( err => console.log('error', err));

     console.log('despues this.usuario', this.usuario);
   }



  cargarMensajes(): Observable<Mensaje[]> {

  this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(95) );

  return this.itemsCollection.valueChanges()
              .pipe(
                map((mensajes: Mensaje[]) => {
                    this.chats = [];
                    // grabamos al principio del array
                    mensajes.map( mensaje => {
                      this.chats.unshift(mensaje);
                    });
                    return this.chats;

                   }
                )) ;

    // si quisieramos recuperar el id del documento tenemos que
    // llamar a snapshotChanges() y con el pipe devolvemos el id y
    // los campos del documento
  /* this.afs.collection<Mensaje>('chats').snapshotChanges()
    .pipe(
      map((resp) => resp.map(e => ({id: e.payload.doc.id,
                                   ...e.payload.doc.data() as {}} )
       ))
    ); */



  }


  agregarMensaje( texto: string ) {

    // TODO falta el UID del usuario
    console.log('usuario', this.usuario);
    const mensaje: Mensaje = {
    nombre:  this.usuario.nombre,
    mensaje: texto,
    fecha: new Date().getTime(),
    uid: this.usuario.uid
  };

    return this.itemsCollection.add( mensaje );
  }

}

