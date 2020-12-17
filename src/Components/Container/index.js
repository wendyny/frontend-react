import {Nav} from '@fluentui/react';
import React from 'react'
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import { Estudiante } from '../../Containers/estudiante';
import { Curso } from '../../Containers/curso';
import { Pais } from '../../Containers/pais';
import { Asignatura } from '../../Containers/asignatura';
import { Docente } from '../../Containers/docente';

import './container.css'

    export const ContainerMain=()=>{
        return(
            <div className="container">
                <Nav
                    selectedKey="key3"
                    ariaLabel="Nav basic example"
                    styles={{
                        root:{
                            width:210,
                            height: '100%',
                            boxSizing: 'border-box',
                            border: '1px solid #eee',
                            overflowY:'auto',
                        },
                    }}
                    groups={[{
                        links:[{
                            name: 'Estudiantes',
                            url: '/estudiantes',
                            icon: 'UserFollowed',
                            key: 'estudiantesNav',
                        },
                    {
                        name:'Cursos',
                        url:'/cursos',
                        icon:'News',
                        key:'cursosNav',
                    },
                    {
                        name:'Paises',
                        url:'/paises',
                        icon:'world',
                        key:'paisesNav',
                    },
                    {
                        name:'Asignaturas',
                        url:'/asignaturas',
                        icon:'Dictionary',
                        key:'asignaturasNav',
                    },
                    {
                            name:'Docentes',
                            url:'/docentes',
                            icon:'ManagerSelfService',
                            key:'docentesNav',
                    }]
                    }]}
            />
            <Router>
                <Switch>
                    <Route exact path="/estudiantes" component={Estudiante} />
                    <Route exact path="/cursos" component={Curso} />
                    <Route exact path="/paises" component={Pais} />
                    <Route exact path="/asignaturas" component={Asignatura} />
                    <Route exact path="/docentes" component={Docente} />
                </Switch>
            </Router>
            </div>
        )
    }