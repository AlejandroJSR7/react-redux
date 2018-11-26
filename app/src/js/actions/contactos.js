import axios from 'axios';
import findIndex from 'lodash/findIndex';
import * as ACCIONES from '../constants/contactos';
import { apiUrl } from '../utils/http';

// d_ GENERALES
// >> Action Creators <<

export function limpiarFormulario() {
  return {
    type: ACCIONES.ESTADO_CONTACTOS.LIMPIAR_FORMULARIO,
    payload: {
      nombre: '',
      celular: ''
    }
  };
}

export function guardarNombre(nombre) {
  return {
    type: ACCIONES.ESTADO_CONTACTOS.GUARDAR_NOMBRE,
    payload: {
      nombre,
    }
  }
}

export function guardarCelular(celular) {
  return {
    type: ACCIONES.ESTADO_CONTACTOS.GUARDAR_CELULAR,
    payload: {
      celular
    }
  }
}

// d_ OBTENER CONTACTOS
// >> Action Creators <<

export function obtenerContactosInicio() {
  return {
    type: ACCIONES.OBTENER_CONTACTOS.INICIO,
    payload: {
      contactos: [],
      cargando: true,
      error: ''
    },
  };
}

export function obtenerContactosCompletado(contactos) {
  return {
    type: ACCIONES.OBTENER_CONTACTOS.COMPLETADO,
    payload: {
      contactos,
      cargando: false,
      error: ''
    }
  }
}

export function obtenerContactosError(error) {
  return {
    type: ACCIONES.OBTENER_CONTACTOS.ERROR,
    payload: {
      error,
      cargando: false
    }
  }
}

// >> Async Action Creator <<
export function obtenerContactos() {
  return (dispatch, getState) => {
    dispatch(obtenerContactosInicio());

    return axios.get(`${apiUrl}/contactos`)
      .then(({ data }) => dispatch(obtenerContactosCompletado(data)))
      .catch((error) => {
        const mensaje = error.message || error;
        dispatch(obtenerContactosError(mensaje))
      })
  };
}

// d_ CREAR CONTACTO
// >> Action Creators <<

export function crearContactoInicio() {
  return {
    type: ACCIONES.CREAR_CONTACTO.INICIO,
    payload: {
      cargando: true,
      error: ''
    },
  };
}

export function crearContactoCompletado(contacto) {
  return {
    type: ACCIONES.CREAR_CONTACTO.COMPLETADO,
    payload: {
      contacto,
      cargando: false,
      error: ''
    }
  }
}

export function crearContactoError(error) {
  return {
    type: ACCIONES.CREAR_CONTACTO.ERROR,
    payload: {
      error,
      cargando: false
    }
  }
}

// >> Async Action Creator <<
export function crearContacto() {
  return (dispatch, getState) => {
    dispatch(crearContactoInicio());
    return axios.post(`${apiUrl}/contactos`, { nombre, celular })
      .then(( { item: contacto }) => dispatch(crearContactoCompletado(contacto)) )
      .catch((error) => {
        const mensaje = error.message || error;
        dispatch(crearContactoError(mensaje))
      })
  };
}

// d_ ACTUALIZAR CONTACTO
// >> Action Creators <<

export function actualizarContactoInicio() {
  return {
    type: ACCIONES.ACTUALIZAR_CONTACTO.INICIO,
    payload: {
      cargando: true,
      error: ''
    },
  };
}

export function actualizarContactoCompletado(contacto, index) {
  return {
    type: ACCIONES.ACTUALIZAR_CONTACTO.COMPLETADO,
    payload: {
      contacto,
      index,
      cargando: false,
      error: ''
    }
  }
}

export function actualizarContactoError(error) {
  return {
    type: ACCIONES.ACTUALIZAR_CONTACTO.ERROR,
    payload: {
      error,
      cargando: false
    }
  }
}

// >> Async Action Creator <<
export function actualizarContacto(nombre, celular, uid) {
  return (dispatch, getState) => {
    dispatch(actualizarContactoInicio());

    // Validación
    const { contactos } = getState().contactos;
    const index = findIndex(contactos, { uid });
    if (index === -1) {
      return dispatch(actualizarContactoError('El contacto no ha sido encontrado.'))
    }

    return axios.put(`${apiUrl}/contactos`, { nombre, celular })
      .then(( { item: contacto }) => dispatch(actualizarContactoCompletado(contacto, index)) )
      .catch((error) => {
        const mensaje = error.message || error;
        dispatch(actualizarContactoError(mensaje))
      })
  };
}

// d_ BORRAR CONTACTO
// >> Action Creators <<

export function borrarContactoInicio() {
  return {
    type: ACCIONES.BORRAR_CONTACTO.INICIO,
    payload: {
      cargando: true,
      error: ''
    },
  };
}

export function borrarContactoCompletado(uid, index) {
  return {
    type: ACCIONES.BORRAR_CONTACTO.COMPLETADO,
    payload: {
      uid,
      index,
      cargando: false,
      error: ''
    }
  }
}

export function borrarContactoError(error) {
  return {
    type: ACCIONES.BORRAR_CONTACTO.ERROR,
    payload: {
      error,
      cargando: false
    }
  }
}

// >> Async Action Creator <<
export function borrarContacto(uid) {
  return (dispatch, getState) => {
    dispatch(borrarContactoInicio());

    // Validación
    const { contactos } = getState().contactos;
    const index = findIndex(contactos, { uid });
    if (index === -1) {
      return dispatch(borrarContactoError('El contacto no ha sido encontrado.'))
    }

    return axios.delete(`${apiUrl}/contactos/${uid}`)
      .then(( { uid }) => dispatch(borrarContactoCompletado(uid, index)) )
      .catch((error) => {
        const mensaje = error.message || error;
        dispatch(borrarContactoError(mensaje))
      })
  };
}