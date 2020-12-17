import React, { useEffect, useState } from 'react';
import { CommandBar, DefaultButton, DetailsListLayoutMode, Dialog, DialogFooter, DialogType, IconButton, Panel, PrimaryButton, SearchBox, Selection, SelectionMode, ShimmeredDetailsList } from '@fluentui/react';
import './docente.css'
import { restClient } from '../../Services/restClient';
import { DocenteForm } from './docenteForm';

export const Docente = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAlert, setIsOpenAlert] = useState(true);
    const [docentes, setDocentes] = useState(undefined); //data.map(item => ({ ...item, nombreCurso: item.curso.nombre }))
    const [filtro, setFiltro] = useState([]);
    const [docente, setDocente] = useState();
    const [acccion, setAccion] = useState('New');

    useEffect(() => {
        fetchDocentes();
    }, []);

    const fetchDocentes = async () => {
        const response = await restClient.httpGet('/docente');
        debugger
        
        if (!response.length) {
            return;
        }

        setDocentes(response.map(item => ({ ...item, nombreAsignatura: item.asignatura.nombre})));
    }

    const handleRefreshClick = () => {
        setDocentes(undefined);

        fetchDocentes();
    }

    const handleDismissClick = () => {
        setIsOpen(!isOpen);
    }

    const handleNuevoDocenteClick = () => {
        setAccion('New');
        setIsOpen(true);
    }

    const handleRemoveDocenteClick = () => {
        setIsOpenAlert(false);
    }

    const seleccion = new Selection({
        onSelectionChanged: () => {
            const itemSeleccionado = seleccion.getSelection();

            setDocente(itemSeleccionado.length ? itemSeleccionado[0] : null);

        },
    });

    const handleSearchDocente = value => {

        if(!value){
            setDocentes(undefined);
            setFiltro([]);
            fetchDocentes();

            return;
        }

        const dataFilter = docentes && docentes.filter(item => item.nombre.toUpperCase().includes(value.toUpperCase()));

        setFiltro(dataFilter);
    }

    const handleDismissAlertClick = () => {
        setIsOpenAlert(true);
    }

    const handleEditDocenteClick = () => {
        if (!docente) return 'Selecione un docente';

        setAccion('Edit');
        setIsOpen(true);
    }

    const handleRemoverDocenteClick = async () => {
        if (!docente) return;

        const response = await restClient.httpDelete('/docente', docente.id);

        if (response === 'success') {
            handleDismissAlertClick();
            setDocentes(undefined);
            fetchDocentes();
        }
    }

    const handleNoRemoverDocenteClick = () => {

        handleDismissAlertClick();
    }

    const onRenderEdit = (row) => <IconButton iconProps={{ iconName: 'Edit' }} onClick={handleEditDocenteClick} />
    const onRenderDelete = (row) => <IconButton iconProps={{ iconName: 'Delete' }} onClick={handleRemoveDocenteClick} />

    const columns = [
        { key: 'onRenderEdit', name: '', fieldName: '', minWidth: 30, maxWidth: 30, isResizable: true, onRender: onRenderEdit },
        { key: 'onRenderDelete', name: '', fieldName: '', minWidth: 30, maxWidth: 30, isResizable: true, onRender: onRenderDelete },
        { key: 'column1', name: 'Id', fieldName: 'id', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'column2', name: 'Docente', fieldName: 'nombre', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'column3', name: 'Edad', fieldName: 'edad', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'column4', name: 'Sexo', fieldName: 'sexo', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'column5', name: 'AsignaturaId', fieldName: 'asignaturaId', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'column6', name: 'Nombre de la asignatura', fieldName: 'nombreAsignatura', minWidth: 100, maxWidth: 200, isResizable: true },
       
    ]

    const isDisableButton = docente ? false : true;

    return (
        <div className="docente">
            
            <CommandBar // Esta es la barra de comandos en donde están los botones para agregar, editar, etc.
                items={[{
                    key: 'refresh',
                    text: 'Actualizar',
                    iconProps: { iconName: 'Refresh' },
                    onClick: handleRefreshClick,
                }, {
                    key: 'newDocente',
                    text: 'Nuevo',
                    iconProps: { iconName: 'Add' },
                    onClick: handleNuevoDocenteClick,
                },
                {
                    key: 'removeDocente',
                    text: 'Eliminar',
                    iconProps: { iconName: 'Delete' },
                    onClick: handleRemoveDocenteClick,
                    disabled: isDisableButton
                }, {
                    key: 'editarDocente',
                    text: 'Editar Docente',
                    iconProps: { iconName: 'Edit' },
                    onClick: handleEditDocenteClick,
                    disabled: isDisableButton
                }]}
            />

            <SearchBox // Control de búsqueda
            styles={{ root: { width: '300px' } }} placeholder="Buscar..." onSearch={handleSearchDocente} />

            <div className="contenedorLista">
                <ShimmeredDetailsList
                    items={filtro.length ? filtro : docentes}
                    columns={columns}
                    layoutMode={DetailsListLayoutMode.justified}
                    selection={seleccion}
                    selectionPreservedOnEmptyClick={true}
                    selectionMode={SelectionMode.single}
                    enableShimmer={!docentes}
                />
            </div>

            <Panel // Este es el panel que sale del lado derecho para agregar o editar información
                headerText={acccion === 'New' ? "Nuevo Docente" : "Editar Docente"} // Aquí se valida si el título de header es para hacer uno nuevo o para editar, esto debido a que se esta reutilizando el mismo panel
                isOpen={isOpen}
                onDismiss={handleDismissClick}
                customWidth="700px"
            >
                <DocenteForm // Este es el formulario que contiene los controles con la información
                    fetchDocentes={fetchDocentes} // Hace un GET a la API
                    docenteSeleccionado={docente || {}}
                    acccion={acccion}
                    onDismiss={handleDismissClick}
                />
            </Panel>

            <Dialog // Ventana de diálogo que aparece cuándo se desea remover un registro
                hidden={isOpenAlert}
                onDismiss={handleDismissAlertClick} 
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Eliminar docente',
                    closeButtonAriaLabel: 'Close',
                    subText: 'Remover Docente?',
                }}
                modalProps={{
                    titleAriaId: '',
                    subtitleAriaId: '',
                    isBlocking: false,
                    styles: { main: { maxWidth: 450 } },
                }}
            >
                
                <DialogFooter 
                // Esto muestra los dos botones en la parte inferior, conultando se desea o no eliminar el registro
                > 
                    <PrimaryButton onClick={handleRemoverDocenteClick} text="Si" />
                    <DefaultButton onClick={handleNoRemoverDocenteClick} text="No" />
                </DialogFooter>
            </Dialog>
        </div>
    )
}

