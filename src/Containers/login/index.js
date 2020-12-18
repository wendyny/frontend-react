import React, { useState } from 'react';

import { PrimaryButton, TextField } from '@fluentui/react';

import './login.css';
import { restClient } from '../../Services/restClient';

export const Login = ({ history }) => {
    const [usuario, setUsuario] = useState({
        usuarioId: '',
        passwordUsuario: ''
    });

    const [message, setMessage] = useState();

    const handleUserChange = prop => (event, value) => {
        setUsuario({ ...usuario, [prop]: value });
    }

    const handleEnterClick = async () => {
        if (!usuario.usuarioId && !usuario.passwordUsuario) {
            return;
        }

        const response = await restClient.httpGet(`/usuario/${usuario.usuarioId}/${usuario.passwordUsuario}`);

        debugger

        if (response === 'sucess') {
            history.push('/containers/estudiantes');
        }

        setMessage(response);
    }

    return <div className="login">

        <div className="form">
            {/* <div className="line" /> */}

            <h2>Login</h2>

            <TextField
                label="Usuario"
                value={usuario.usuarioId}
                underlined
                onChange={handleUserChange('usuarioId')} />

            <TextField
                type="passwordUsuario"
                label="Contraseña"
                value={usuario.passwordUsuario}
                canRevealPassword
                underlined
                onChange={handleUserChange('passwordUsuario')} />

            <PrimaryButton text="Enter" onClick={handleEnterClick} />

            <span>{message}</span>
        </div>

    </div>
}

