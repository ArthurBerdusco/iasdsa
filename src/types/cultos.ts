import { Orador } from "./oradores";


export interface Culto {
  id: number;
  titulo: string;
  diasemana: string;
  data: string | Date;
  hora: string;
  orador: Orador;
  arte: string;
  cordestaque: string;
}
