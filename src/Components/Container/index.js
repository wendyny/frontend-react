import {Nav} from '@fluentui/react';
import React from 'react'
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import { Estudiante } from '../../Containers/estudiante';
import { Curso } from '../../Containers/curso';
import { Pais } from '../../Containers/pais';
import { Asignatura } from '../../Containers/asignatura';
import { Docente } from '../../Containers/docente';
import { Usuario } from '../../Containers/usuario';
import './container.css'
import { Header } from '../Header';

    export const ContainerMain=()=>{
        const handleNavClick = () => {

        }
    
        return(
            <div className="container">
               <Header/>
            <Nav
                onLinkClick={handleNavClick}
                selectedKey="key3"
                ariaLabel="Nav basic example"
                styles={{
                    root: {
                        width: 210,
                        height: '100%',
                        boxSizing: 'border-box',
                        border: '1px solid #eee',
                        overflowY: 'auto',
                    },
                }}
                    groups={[{
                        links:[{
                            name: 'Estudiantes',
                            url: '/containers/estudiantes',
                            icon: 'UserFollowed',
                            key: 'estudiantesNav',
                        },
                    {
                        name:'Cursos',
                        url:'/containers/cursos',
                        icon:'News',
                        key:'cursosNav',
                    },
                    {
                        name:'Paises',
                        url:'/containers/paises',
                        icon:'world',
                        key:'paisesNav',
                    },
                    {
                        name:'Asignaturas',
                        url:'/containers/asignaturas',
                        icon:'Dictionary',
                        key:'asignaturasNav',
                    },
                    {
                            name:'Docentes',
                            url:'/containers/docentes',
                            icon:'ManagerSelfService',
                            key:'docentesNav',
                    },
                    {
                        name:'Usuarios',
                        url:'/containers/usuarios',
                        icon:'FabricUserFolder',
                        key:'usuariosNav',
                    },]
                    }]}
            />
            <Router>
                <Switch>
                    <Route path="/containers/estudiantes" component={Estudiante} />
                    <Route path="/containers/cursos" component={Curso} />
                    <Route path="/containers/paises" component={Pais} />
                    <Route path="/containers/asignaturas" component={Asignatura} />
                    <Route path="/containers/docentes" component={Docente} />
                    <Route path="/containers/usuarios" component={Usuario} />

                </Switch>
            </Router>
            </div>
        )
    }