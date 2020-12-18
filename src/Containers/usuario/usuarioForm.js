import React, { useEffect, useState } from 'react';

import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Dropdown, PrimaryButton, ProgressIndicator, TextField } from '@fluentui/react';
import { restClient } from '../../Services/restClient';

const estado = [{ key: 'true', text: 'True' }, { key: 'false', text: 'False' }];
export const UsuarioForm = ({ fetchUsuarios, usuarioSeleccionado, acccion, onDismiss }) => {
    const [usuario, setUsuario] = useState({
        UsuarioId: acccion === 'Edit' ? usuarioSeleccionado.UsuarioId : '',
        PasswordUsuario: acccion === 'Edit' ? usuarioSeleccionado.PasswordUsuario : '',  
        isActive: acccion === 'Edit' ? usuarioSeleccionado.isActive : ''  
    });

    const [mensajeValidacion, setMensajeValidacion] = useState('');
    const [errorCampo, setErrorCampo] = useState({
        UsuarioId: '',
        PasswordUsuario:'',
        isActive:''
        
    });

    const [usuarios, setUsuarios] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchUsuarios = async () => {
            const response = await restClient.httpGet('/usuario');

            if (response && response.length) {
                setUsuarios(response.map(usuario => ({
                    key: usuario.UsuarioId,
                    text: usuario.PasswordUsuario
                   
                })))
            }
        }

        fetchUsuarios();
    }, []);

    const handleTextFieldChange = prop => (event, value) => {
        setUsuario({ ...usuario, [prop]: value })
    }
    
    const handleSelectedIsActiveChange = (event, option) => {
        setUsuario({ ...usuario, isActive: option.key });
    }
    


    const validandoCampos = () => {
        let mensaje = {};

        if (!usuario.UsuarioId) {
            mensaje = { ...mensaje, UsuarioId: 'Ingrese un nombre para el usuario ' };
        }
        if (!usuario.PasswordUsuario) {
            mensaje = { ...mensaje, PasswordUsuario: 'Ingrese una contrase;a para el usuario ' };
        }

        
        setErrorCampo(mensaje);

        return Object.keys(mensaje).length;
    }


    const handleGuardarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true); //activar spinner

        const response = await restClient.httpPost('/usuario', usuario);

        if (typeof response === 'string') {
            setMensajeValidacion(response);
        }

        if (typeof response == "object") {
            setMensajeValidacion('Saved');

            fetchUsuarios();
        }

        setShowSpinner(false);
        onDismiss();
    }

    const handleEditarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true);

        const url = `/usuario/${usuarioSeleccionado.UsuarioId}`;

        const response = await restClient.httpPut(url, usuario);

        if (response == 'success') {
            setMensajeValidacion('Saved');

            fetchUsuarios();
        } else {
            setMensajeValidacion(response);
        }

        setShowSpinner(false);
        onDismiss();
    }
    const stackTokens = { childrenGap: 10 };
    
    return (
        <div>

            {showSpinner && <ProgressIndicator label="Guardando..." />}

            <TextField label="Usuario"
                value={usuario.UsuarioId}
                onChange={handleTextFieldChange('UsuarioId')}
                errorMessage={errorCampo.UsuarioId} />
            <TextField label="Contraseña"
                value={usuario.PasswordUsuario}
                onChange={handleTextFieldChange('PasswordUsuario')}
                errorMessage={errorCampo.PasswordUsuario} />
              <Dropdown label="Estado"
                options={estado}
                selectedKey={usuario.isActive}
                onChange={handleSelectedIsActiveChange}
                errorMessage={errorCampo.sexo} />

               
            <br />
            <PrimaryButton text="Guardar" onClick={acccion === 'New' ? handleGuardarClick : handleEditarClick} />

            <br />

            <span style={{ color: mensajeValidacion === 'Saved' ? 'green' : 'red' }}>{mensajeValidacion}</span>
        </div>
    )
}

