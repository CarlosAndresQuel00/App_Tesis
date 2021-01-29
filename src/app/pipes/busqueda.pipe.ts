
import { Pipe, PipeTransform } from '@angular/core';
import { PublicationInterface } from 'src/app/shared/publication.interface';
@Pipe({
  name: 'busqueda'
})
export class BusquedaPipe implements PipeTransform {

  transform(publicaciones: PublicationInterface[],texto: string): PublicationInterface[] {
    if(texto.length === 0){
      return publicaciones;
    }
    texto = texto.toLowerCase();

    return publicaciones.filter(publi =>{
      return publi.title.toLowerCase().includes(texto);
    });
    // return publicacionesBuscadas;
  }

}
