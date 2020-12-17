import React, { useEffect, useState } from 'react';

import { Dropdown, PrimaryButton, ProgressIndicator, TextField } from '@fluentui/react';
import { restClient } from '../../Services/restClient';

const generos = [{ key: 'F', text: 'F' }, { key: 'M', text: 'M' }];

export const DocenteForm = ({ fetchDocentes, docenteSeleccionado, acccion, onDismiss }) => {
    const [docente, setDocente] = useState({
        id: acccion === 'Edit' ? docenteSeleccionado.id : 0,
        nombre: acccion === 'Edit' ? docenteSeleccionado.nombre : '',
        sexo: acccion === 'Edit' ? docenteSeleccionado.sexo : '',
        edad: acccion === 'Edit' ? docenteSeleccionado.edad : 0,
        asignaturaId: acccion === 'Edit' ? docenteSeleccionado.cursoId : 0

    });

    const [mensajeValidacion, setMensajeValidacion] = useState('');
    const [errorCampo, setErrorCampo] = useState({
        nombre: '',
        sexo: '',
        edad: '',
        asignaturaId: '' 
    });

    const [asignaturas, setAsignaturas] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const fetchAsignaturas = async () => {
            const response = await restClient.httpGet('/asignatura');

            if (response && response.length) {
                setAsignaturas(response.map(asignatura => ({
                    key: asignatura.id,
                    text: asignatura.nombre
                })))
            }
        }

        fetchAsignaturas();
    }, []);
    
    
    const handleTextFieldChange = prop => (event, value) => {
        setDocente({ ...docente, [prop]: value })
    }

    const handleSelectedAsignaturaChange = (event, option) => {
        setDocente({ ...docente, asignaturaId: option.key });
    }
   
    const handleSelectedSexoChange = (event, option) => {
        setDocente({ ...docente, sexo: option.key });
    }

    const validandoCampos = () => {
        let mensaje = {};

        if (!docente.nombre) {
            mensaje = { ...mensaje, nombre: 'Ingrese nombre' };
        }

        if (docente.edad < 18) {
            mensaje = { ...mensaje, edad: 'Edad debe sera mayor o igual a 18' };
        }

        if (!docente.sexo) {
            mensaje = { ...mensaje, sexo: 'Seleccione un genero...' };
        }

        if (!docente.asignaturaId) {
            mensaje = { ...mensaje, asignaturaId: 'Seleccione un asignatura...' };
        }
        

        setErrorCampo(mensaje);

        return Object.keys(mensaje).length;
    }


    const handleGuardarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true); //activar spinner

        const response = await restClient.httpPost('/Docente', docente);

        if (typeof response === 'string') {
            setMensajeValidacion(response);
        }

        if (typeof response == "object") {
            setMensajeValidacion('Saved');

            fetchDocentes();
        }

        setShowSpinner(false);
        onDismiss();
    }

    const handleEditarClick = async () => {
        if (validandoCampos()) {
            return;
        }

        setShowSpinner(true);

        const url = `/Docente/${docenteSeleccionado.id}`;

        const response = await restClient.httpPut(url, docente);

        if (response == 'success') {
            setMensajeValidacion('Saved');

            fetchDocentes();
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
                value={docente.nombre}
                onChange={handleTextFieldChange('nombre')}
                errorMessage={errorCampo.nombre} />

            <TextField type="Number" label="Edad"
                value={docente.edad}
                onChange={handleTextFieldChange('edad')}
                errorMessage={errorCampo.edad} />

            <Dropdown label="Seleccione un asignatura"
                options={asignaturas}
                selectedKey={docente.asignaturaId}
                onChange={handleSelectedAsignaturaChange}
                errorMessage={errorCampo.asignaturaId} />

           
            <Dropdown label="Seleccione un género"
                options={generos}
                selectedKey={docente.sexo}
                onChange={handleSelectedSexoChange}
                errorMessage={errorCampo.sexo} />

            <br />

            <PrimaryButton text="Guardar" onClick={acccion === 'New' ? handleGuardarClick : handleEditarClick} />

            <br />

            <span style={{ color: mensajeValidacion === 'Saved' ? 'green' : 'red' }}>{mensajeValidacion}</span>
        </div>
    )
}

