import React, { useEffect, useState } from 'react';

import { Dropdown, PrimaryButton, ProgressIndicator, TextField } from '@fluentui/react';
import { restClient } from '../../Services/restClient';



export const AsignaturaForm = ({ fetchAsignaturas, asignaturaSeleccionado, acccion, onDismiss }) => {
    const [asignatura, setAsignatura] = useState({
        id: acccion === 'Edit' ? asignaturaSeleccionado.id : 0,
        nombre: acccion === 'Edit' ? asignaturaSeleccionado.nombre : '',
        cursoId: acccion === 'Edit' ? asignaturaSeleccionado.cursoId : 0
    });

    const [mensajeValidacion, setMensajeValidacion] = useState('');
    const [errorCampo, setErrorCampo] = useState({
        nombre: '',
        cursoId: ''
    });

    const [cursos, setCursos] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchCursos = async () => {
            const response = await restClient.httpGet('/curso');

            if (response && response.length) {
                setCursos(response.map(curso => ({
                    key: curso.id,
                    text: curso.nombre
                })))
            }
        }

        fetchCursos();
    }, []);

    const handleTextFieldChange = prop => (event, value) => {
        setAsignatura({ ...asignatura, [prop]: value })
    }

    const handleSelectedCursoChange = (event, option) => {
        setAsignatura({ ...asignatura, cursoId: option.key });
    }
   

    const validandoCampos = () => {
        let mensaje = {};

        if (!asignatura.nombre) {
            mensaje = { ...mensaje, nombre: 'Ingrese nombre' };
        }
        if (!asignatura.cursoId) {
            mensaje = { ...mensaje, cursoId: 'Seleccione un curso...' };
        }
      setErrorCampo(mensaje);

        return Object.keys(mensaje).length;
    }


    const handleGuardarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true); //activar spinner

        const response = await restClient.httpPost('/Asignatura', asignatura);

        if (typeof response === 'string') {
            setMensajeValidacion(response);
        }

        if (typeof response == "object") {
            setMensajeValidacion('Saved');

            fetchAsignaturas();
        }

        setShowSpinner(false);
        onDismiss();
    }

    const handleEditarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true);

        const url = `/Asignatura/${asignaturaSeleccionado.id}`;

        const response = await restClient.httpPut(url, asignatura);

        if (response == 'success') {
            setMensajeValidacion('Saved');

            fetchAsignaturas();
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
                value={asignatura.nombre}
                onChange={handleTextFieldChange('nombre')}
                errorMessage={errorCampo.nombre} />

            <Dropdown label="Seleccione un curso"
                options={cursos}
                selectedKey={asignatura.cursoId}
                onChange={handleSelectedCursoChange}
                errorMessage={errorCampo.cursoId} />

            <br />

            <PrimaryButton text="Guardar" onClick={acccion === 'New' ? handleGuardarClick : handleEditarClick} />

            <br />

            <span style={{ color: mensajeValidacion === 'Saved' ? 'green' : 'red' }}>{mensajeValidacion}</span>
        </div>
    )
}

