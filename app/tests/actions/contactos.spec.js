import axios from 'axios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import * as CONSTANTES_CONTACTO from '../../src/js/constants/contactos';
import * as ACCIONES from '../../src/js/actions/contactos';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const expect = global.expect;

describe('Contactos - Acciones', () => {
  describe('Actualizar Contacto', () => {
    it('actualizarContactoInicio() retorna el objeto esperado.', () => {
      const actual = ACCIONES.actualizarContactoInicio();
      const esperado = {
        type: CONSTANTES_CONTACTO.ACTUALIZAR_CONTACTO.INICIO,
        payload: {
          cargando: true,
          error: ''
        }
      };
      expect(actual).toEqual(esperado);
    });
    it('actualizarContactoCompletado(contacto, index) retorna el objeto esperado.', () => {
      const mockContacto = {
        nombre: 'Steven', celular: '2211-11-22'
      },
      index = 100;

      const actual = ACCIONES.actualizarContactoCompletado(mockContacto, index);
      const esperado = {
        type: CONSTANTES_CONTACTO.ACTUALIZAR_CONTACTO.COMPLETADO,
        payload: {
          contacto: mockContacto,
          index,
          cargando: false,
          error: ''
        }
      };
      expect(actual).toEqual(esperado);
    });
    it('actualizarContactoError(contacto, index) retorna el objeto esperado.', () => {
      const error = 'Este es un error';
      const actual = ACCIONES.actualizarContactoError(error);
      const esperado = {
        type: CONSTANTES_CONTACTO.ACTUALIZAR_CONTACTO.ERROR,
        payload: {
          cargando: false,
          error: error
        }
      };
      expect(actual).toEqual(esperado);
    });
    it('actualizarContactoError(nombre, delular, uid) retorna el objeto esperado cuando es Completado.', (done) => {
      const uid = 'asda!E3-##@$#@$#-DSFdsfs';
      const mockContacto = {
        nombre: 'Steven',
        celular: '2211-9911',
        uid,
      }
      const mockEstado = {
        contactos: {
          nombre: '',
          telefono: '',
          contactos: [mockContacto],
          cargando: false,
          error: '',
        }
      };
      // Detener y simular una llamada satisfactoria
      const stubAxiosActualizar = sinon.stub(axios, 'put')
        .callsFake(() => Promise.resolve({ item: mockContacto }));

      const store = mockStore(mockEstado);
      //Ejecturar el Async Action Creator
      return store.dispatch(
        ACCIONES.actualizarContacto(mockContacto.nombre, mockContacto.celular, uid)
      ).then(() => {
        const actual = store.getActions();
        const esperado = [{
          type: CONSTANTES_CONTACTO.ACTUALIZAR_CONTACTO.INICIO,
          payload: {
            cargando: true,
            error: '',
          }
        }, {
          type: CONSTANTES_CONTACTO.ACTUALIZAR_CONTACTO.COMPLETADO,
          payload: {
            contacto: mockContacto,
            cargando: false,
            error: '',
            index: 0,
          }
        }];

        stubAxiosActualizar.restore();
        expect(actual).toEqual(esperado);
        done();
      });
    });
  })
});