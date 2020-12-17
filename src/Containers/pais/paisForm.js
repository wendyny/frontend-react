import React, { useEffect, useState } from 'react';

import { Dropdown, PrimaryButton, ProgressIndicator, TextField } from '@fluentui/react';
import { restClient } from '../../Services/restClient';


export const PaisForm = ({ fetchPaises, paisSeleccionado, acccion, onDismiss }) => {
    const [pais, setPais] = useState({
        Id: acccion === 'Edit' ? paisSeleccionado.Id : 0,
        Nombre: acccion === 'Edit' ? paisSeleccionado.Nombre : ''  
    });

    const [mensajeValidacion, setMensajeValidacion] = useState('');
    const [errorCampo, setErrorCampo] = useState({
        Nombre: ''
        
    });

    const [paises, setPaises] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchPaises = async () => {
            const response = await restClient.httpGet('/pais');

            if (response && response.length) {
                setPaises(response.map(pais => ({
                    key: pais.Id,
                    text: pais.Nombre
                })))
            }
        }

        fetchPaises();
    }, []);

    const handleTextFieldChange = prop => (event, value) => {
        setPais({ ...pais, [prop]: value })
    }
    

    const validandoCampos = () => {
        let mensaje = {};

        if (!pais.Nombre) {
            mensaje = { ...mensaje, nombre: 'Ingrese un nombre para el pais ' };
        }

        
        setErrorCampo(mensaje);

        return Object.keys(mensaje).length;
    }


    const handleGuardarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true); //activar spinner

        const response = await restClient.httpPost('/pais', pais);

        if (typeof response === 'string') {
            setMensajeValidacion(response);
        }

        if (typeof response == "object") {
            setMensajeValidacion('Saved');

            fetchPaises();
        }

        setShowSpinner(false);
        onDismiss();
    }

    const handleEditarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true);

        const url = `/pais/${paisSeleccionado.Id}`;

        const response = await restClient.httpPut(url, pais);

        if (response == 'success') {
            setMensajeValidacion('Saved');

            fetchPaises();
        } else {
            setMensajeValidacion(response);
        }

        setShowSpinner(false);
        onDismiss();
    }

    return (
        <div>

            {showSpinner && <ProgressIndicator label="Guardando..." />}

            <TextField label="Nombre"
                value={pais.Nombre}
                onChange={handleTextFieldChange('Nombre')}
                errorMessage={errorCampo.Nombre} />
            <br />

            <PrimaryButton text="Guardar" onClick={acccion === 'New' ? handleGuardarClick : handleEditarClick} />

            <br />

            <span style={{ color: mensajeValidacion === 'Saved' ? 'green' : 'red' }}>{mensajeValidacion}</span>
        </div>
    )
}

