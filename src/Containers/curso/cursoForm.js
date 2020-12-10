import React, { useEffect, useState } from 'react';

import { Dropdown, PrimaryButton, ProgressIndicator, TextField } from '@fluentui/react';
import { restClient } from '../../Services/restClient';


export const CursoForm = ({ fetchCursos, cursoSeleccionado, acccion, onDismiss }) => {
    const [curso, setCurso] = useState({
        Id: acccion === 'Edit' ? cursoSeleccionado.Id : 0,
        Nombre: acccion === 'Edit' ? cursoSeleccionado.Nombre : ''  
    });

    const [mensajeValidacion, setMensajeValidacion] = useState('');
    const [errorCampo, setErrorCampo] = useState({
        Nombre: ''
        
    });

    const [cursos, setCursos] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchCursos = async () => {
            const response = await restClient.httpGet('/curso');

            if (response && response.length) {
                setCursos(response.map(curso => ({
                    key: curso.Id,
                    text: curso.Nombre
                })))
            }
        }

        fetchCursos();
    }, []);

    const handleTextFieldChange = prop => (event, value) => {
        setCurso({ ...curso, [prop]: value })
    }
    

    const validandoCampos = () => {
        let mensaje = {};

        if (!curso.Nombre) {
            mensaje = { ...mensaje, nombre: 'Ingrese un nombre para el curso ' };
        }

        
        setErrorCampo(mensaje);

        return Object.keys(mensaje).length;
    }


    const handleGuardarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true); //activar spinner

        const response = await restClient.httpPost('/curso', curso);

        if (typeof response === 'string') {
            setMensajeValidacion(response);
        }

        if (typeof response == "object") {
            setMensajeValidacion('Saved');

            fetchCursos();
        }

        setShowSpinner(false);
        onDismiss();
    }

    const handleEditarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true);

        const url = `/curso/${cursoSeleccionado.Id}`;

        const response = await restClient.httpPut(url, curso);

        if (response == 'success') {
            setMensajeValidacion('Saved');

            fetchCursos();
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
                value={curso.Nombre}
                onChange={handleTextFieldChange('Nombre')}
                errorMessage={errorCampo.Nombre} />
            <br />

            <PrimaryButton text="Guardar" onClick={acccion === 'New' ? handleGuardarClick : handleEditarClick} />

            <br />

            <span style={{ color: mensajeValidacion === 'Saved' ? 'green' : 'red' }}>{mensajeValidacion}</span>
        </div>
    )
}

