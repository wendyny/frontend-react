import React, { useEffect, useState } from 'react';
import { CommandBar, DefaultButton, DetailsListLayoutMode, Dialog, DialogFooter, DialogType, IconButton, Panel, PrimaryButton, SearchBox, Selection, SelectionMode, ShimmeredDetailsList,Checkbox } from '@fluentui/react';
import './usuario.css'
import { restClient } from '../../Services/restClient';
import { UsuarioForm } from './usuarioForm';

export const Usuario = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAlert, setIsOpenAlert] = useState(true);
    const [usuarios, setUsuarios] = useState(undefined); //data.map(item => ({ ...item, nombreCurso: item.usuario.nombre }))
    const [filtro, setFiltro] = useState([]);
    const [usuario, setUsuario] = useState();
    const [acccion, setAccion] = useState('New');

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        const response = await restClient.httpGet('/usuario');

        if (!response.length) {
            return;
        }
        
        setUsuarios(response.map(item => ({ UsuarioId: item.usuarioId,PasswordUsuario: item.passwordUsuario, IsActive: item.isActive })));
  
    }

    const handleRefreshClick = () => {
        setUsuarios(undefined);

        fetchUsuarios();
    }

    const handleDismissClick = () => {
        setIsOpen(!isOpen);
    }

    const handleNuevoUsuarioClick = () => {
        setAccion('New');
        setIsOpen(true);
    }

    const handleRemoveUsuarioClick = () => {
        setIsOpenAlert(false);
    }

    const seleccion = new Selection({
        onSelectionChanged: () => {
            const itemSeleccionado = seleccion.getSelection();

            setUsuario(itemSeleccionado.length ? itemSeleccionado[0] : null);

        },
    });

    const handleSearchUsuario = value => {

        if(!value){
            setUsuarios(undefined);
            setFiltro([]);
            fetchUsuarios();

            return;
        }

        const dataFilter = usuarios && usuarios.filter(item => item.usuarioId.toUpperCase().includes(value.toUpperCase()));

        setFiltro(dataFilter);
    }

    const handleDismissAlertClick = () => {
        setIsOpenAlert(true);
    }

    const handleEditUsuarioClick = () => {
        if (!usuario) return 'Selecione el nombre del usuario';

        setAccion('Edit');
        setIsOpen(true);
    }

    const handleRemoverUsuarioClick = async () => {
        if (!usuario) return;

        const response = await restClient.httpDelete('/usuario', usuario.usuarioId);

        if (response === 'success') {
            handleDismissAlertClick();
            setUsuarios(undefined);
            fetchUsuarios();
        }
    }

    const handleNoRemoverUsuarioClick = () => {

        handleDismissAlertClick();
    }

    const onRenderEdit = (row) => <IconButton iconProps={{ iconName: 'Edit' }} onClick={handleEditUsuarioClick} />
    const onRenderDelete = (row) => <IconButton iconProps={{ iconName: 'Delete' }} onClick={handleRemoveUsuarioClick} />

    const columns = [
        { key: 'onRenderEdit', name: '', fieldName: '', minWidth: 30, maxWidth: 30, isResizable: true, onRender: onRenderEdit },
        { key: 'onRenderDelete', name: '', fieldName: '', minWidth: 30, maxWidth: 30, isResizable: true, onRender: onRenderDelete },
        { key: 'column1', name: 'UsuarioId', fieldName: 'UsuarioId', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column2', name: 'PasswordUsuario', fieldName: 'PasswordUsuario', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column2', name: 'IsActive', fieldName: 'IsActive', minWidth: 100, maxWidth: 200, isResizable: true }    
    ]

    const isDisableButton = usuario ? false : true;

    return (
        <div className="usuario">
            
            <CommandBar // Esta es la barra de comandos en donde están los botones para agregar, editar, etc.
                items={[{
                    key: 'refresh',
                    text: 'Actualizar',
                    iconProps: { iconName: 'Refresh' },
                    onClick: handleRefreshClick,
                }, {
                    key: 'newUsuario',
                    text: 'Nuevo',
                    iconProps: { iconName: 'Add' },
                    onClick: handleNuevoUsuarioClick,
                },
                {
                    key: 'removeUsuario',
                    text: 'Eliminar',
                    iconProps: { iconName: 'Delete' },
                    onClick: handleRemoveUsuarioClick,
                    disabled: isDisableButton
                }, {
                    key: 'editarUsuario',
                    text: 'Editar Usuario',
                    iconProps: { iconName: 'Edit' },
                    onClick: handleEditUsuarioClick,
                    disabled: isDisableButton
                }]}
            />

            <SearchBox // Control de búsqueda
            styles={{ root: { width: '300px' } }} placeholder="Buscar..." onSearch={handleSearchUsuario} />

            <div className="contenedorLista">
                <ShimmeredDetailsList
                    items={filtro.length ? filtro : usuarios}
                    columns={columns}
                    layoutMode={DetailsListLayoutMode.justified}
                    selection={seleccion}
                    selectionPreservedOnEmptyClick={true}
                    selectionMode={SelectionMode.single}
                    enableShimmer={!usuarios}
                />
            </div>

            <Panel // Este es el panel que sale del lado derecho para agregar o editar información
                headerText={acccion === 'New' ? "Nuevo Usuario" : "Editar Usuario"} // Aquí se valida si el título de header es para hacer uno nuevo o para editar, esto debido a que se esta reutilizando el mismo panel
                isOpen={isOpen}
                onDismiss={handleDismissClick}
                customWidth="700px"
            >
                <UsuarioForm // Este es el formulario que contiene los controles con la información
                    fetchUsuarios={fetchUsuarios} // Hace un GET a la API
                    usuarioSeleccionado={usuario || {}}
                    acccion={acccion}
                    onDismiss={handleDismissClick}
                />
            </Panel>

            <Dialog // Ventana de diálogo que aparece cuándo se desea remover un registro
                hidden={isOpenAlert}
                onDismiss={handleDismissAlertClick} 
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Eliminar usuario',
                    closeButtonAriaLabel: 'Close',
                    subText: 'Eliminar el usuario?',
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
                    <PrimaryButton onClick={handleRemoverUsuarioClick} text="Si" />
                    <DefaultButton onClick={handleNoRemoverUsuarioClick} text="No" />
                </DialogFooter>
            </Dialog>
        </div>
    )
}

