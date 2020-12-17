import React, { useEffect, useState } from 'react';
import { CommandBar, DefaultButton, DetailsListLayoutMode, Dialog, DialogFooter, DialogType, IconButton, Panel, PrimaryButton, SearchBox, Selection, SelectionMode, ShimmeredDetailsList } from '@fluentui/react';
import './asignatura.css'
import { restClient } from '../../Services/restClient';
import { AsignaturaForm } from './asignaturaForm';

export const Asignatura = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAlert, setIsOpenAlert] = useState(true);
    const [asignaturas, setAsignaturas] = useState(undefined); //data.map(item => ({ ...item, nombreCurso: item.curso.nombre }))
    const [filtro, setFiltro] = useState([]);
    const [asignatura, setAsignatura] = useState();
    const [acccion, setAccion] = useState('New');

    useEffect(() => {
        fetchAsignaturas();
    }, []);

    const fetchAsignaturas = async () => {
        const response = await restClient.httpGet('/asignatura');
        debugger
        
        if (!response.length) {
            return;
        }

        setAsignaturas(response.map(item => ({ ...item, nombreCurso: item.curso.nombre })));
    }

    const handleRefreshClick = () => {
        setAsignaturas(undefined);

        fetchAsignaturas();
    }

    const handleDismissClick = () => {
        setIsOpen(!isOpen);
    }

    const handleNuevoAsignaturaClick = () => {
        setAccion('New');
        setIsOpen(true);
    }

    const handleRemoveAsignaturaClick = () => {
        setIsOpenAlert(false);
    }

    const seleccion = new Selection({
        onSelectionChanged: () => {
            const itemSeleccionado = seleccion.getSelection();

            setAsignatura(itemSeleccionado.length ? itemSeleccionado[0] : null);

        },
    });

    const handleSearchAsignatura = value => {

        if(!value){
            setAsignaturas(undefined);
            setFiltro([]);
            fetchAsignaturas();

            return;
        }

        const dataFilter = asignaturas && asignaturas.filter(item => item.nombre.toUpperCase().includes(value.toUpperCase()));

        setFiltro(dataFilter);
    }

    const handleDismissAlertClick = () => {
        setIsOpenAlert(true);
    }

    const handleEditAsignaturaClick = () => {
        if (!asignatura) return 'Selecione una asignatura';

        setAccion('Edit');
        setIsOpen(true);
    }

    const handleRemoverAsignaturaClick = async () => {
        if (!asignatura) return;

        const response = await restClient.httpDelete('/asignatura', asignatura.id);

        if (response === 'success') {
            handleDismissAlertClick();
            setAsignaturas(undefined);
            fetchAsignaturas();
        }
    }

    const handleNoRemoverAsignaturaClick = () => {

        handleDismissAlertClick();
    }

    const onRenderEdit = (row) => <IconButton iconProps={{ iconName: 'Edit' }} onClick={handleEditAsignaturaClick} />
    const onRenderDelete = (row) => <IconButton iconProps={{ iconName: 'Delete' }} onClick={handleRemoveAsignaturaClick} />

    const columns = [
        { key: 'onRenderEdit', name: '', fieldName: '', minWidth: 30, maxWidth: 30, isResizable: true, onRender: onRenderEdit },
        { key: 'onRenderDelete', name: '', fieldName: '', minWidth: 30, maxWidth: 30, isResizable: true, onRender: onRenderDelete },
        { key: 'column1', name: 'Id', fieldName: 'id', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'column2', name: 'Asignatura', fieldName: 'nombre', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'column5', name: 'CursoId', fieldName: 'cursoId', minWidth: 100, maxWidth: 100, isResizable: true },
        { key: 'column6', name: 'Nombre del curso', fieldName: 'nombreCurso', minWidth: 100, maxWidth: 100, isResizable: true },
    ]

    const isDisableButton = asignatura ? false : true;

    return (
        <div className="asignatura">
            
            <CommandBar // Esta es la barra de comandos en donde están los botones para agregar, editar, etc.
                items={[{
                    key: 'refresh',
                    text: 'Actualizar',
                    iconProps: { iconName: 'Refresh' },
                    onClick: handleRefreshClick,
                }, {
                    key: 'newAsignatura',
                    text: 'Nuevo',
                    iconProps: { iconName: 'Add' },
                    onClick: handleNuevoAsignaturaClick,
                },
                {
                    key: 'removeAsignatura',
                    text: 'Eliminar',
                    iconProps: { iconName: 'Delete' },
                    onClick: handleRemoveAsignaturaClick,
                    disabled: isDisableButton
                }, {
                    key: 'editarAsignatura',
                    text: 'Editar Asignatura',
                    iconProps: { iconName: 'Edit' },
                    onClick: handleEditAsignaturaClick,
                    disabled: isDisableButton
                }]}
            />

            <SearchBox // Control de búsqueda
            styles={{ root: { width: '300px' } }} placeholder="Buscar..." onSearch={handleSearchAsignatura} />

            <div className="contenedorLista">
                <ShimmeredDetailsList
                    items={filtro.length ? filtro : asignaturas}
                    columns={columns}
                    layoutMode={DetailsListLayoutMode.justified}
                    selection={seleccion}
                    selectionPreservedOnEmptyClick={true}
                    selectionMode={SelectionMode.single}
                    enableShimmer={!asignaturas}
                />
            </div>

            <Panel // Este es el panel que sale del lado derecho para agregar o editar información
                headerText={acccion === 'New' ? "Nuevo Asignatura" : "Editar Asignatura"} // Aquí se valida si el título de header es para hacer uno nuevo o para editar, esto debido a que se esta reutilizando el mismo panel
                isOpen={isOpen}
                onDismiss={handleDismissClick}
                customWidth="700px"
            >
                <AsignaturaForm // Este es el formulario que contiene los controles con la información
                    fetchAsignaturas={fetchAsignaturas} // Hace un GET a la API
                    asignaturaSeleccionado={asignatura || {}}
                    acccion={acccion}
                    onDismiss={handleDismissClick}
                />
            </Panel>

            <Dialog // Ventana de diálogo que aparece cuándo se desea remover un registro
                hidden={isOpenAlert}
                onDismiss={handleDismissAlertClick} 
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Eliminar asignatura',
                    closeButtonAriaLabel: 'Close',
                    subText: 'Remover Asignatura?',
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
                    <PrimaryButton onClick={handleRemoverAsignaturaClick} text="Si" />
                    <DefaultButton onClick={handleNoRemoverAsignaturaClick} text="No" />
                </DialogFooter>
            </Dialog>
        </div>
    )
}

