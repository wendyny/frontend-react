import React, { useEffect, useState } from 'react';
import { CommandBar, DefaultButton, DetailsListLayoutMode, Dialog, DialogFooter, DialogType, IconButton, Panel, PrimaryButton, SearchBox, Selection, SelectionMode, ShimmeredDetailsList } from '@fluentui/react';
import './pais.css'
import { restClient } from '../../Services/restClient';
import { PaisForm } from './paisForm';

export const Pais = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenAlert, setIsOpenAlert] = useState(true);
    const [paises, SetPaises] = useState(undefined); //data.map(item => ({ ...item, nombreCurso: item.pais.nombre }))
    const [filtro, setFiltro] = useState([]);
    const [pais, SetPais] = useState();
    const [acccion, setAccion] = useState('New');

    useEffect(() => {
        fetchPaises();
    }, []);

    const fetchPaises = async () => {
        const response = await restClient.httpGet('/pais');

        if (!response.length) {
            return;
        }

        SetPaises(response.map(item => ({ Id: item.id,Nombre: item.nombre })));
    }

    const handleRefreshClick = () => {
        SetPaises(undefined);

        fetchPaises();
    }

    const handleDismissClick = () => {
        setIsOpen(!isOpen);
    }

    const handleNuevoPaisClick = () => {
        setAccion('New');
        setIsOpen(true);
    }

    const handleRemovePaisClick = () => {
        setIsOpenAlert(false);
    }

    const seleccion = new Selection({
        onSelectionChanged: () => {
            const itemSeleccionado = seleccion.getSelection();

            SetPais(itemSeleccionado.length ? itemSeleccionado[0] : null);

        },
    });

    const handleSearchPais = value => {

        if(!value){
            SetPaises(undefined);
            setFiltro([]);
            fetchPaises();

            return;
        }

        const dataFilter = paises && paises.filter(item => item.Nombre.toUpperCase().includes(value.toUpperCase()));

        setFiltro(dataFilter);
    }

    const handleDismissAlertClick = () => {
        setIsOpenAlert(true);
    }

    const handleEditPaisClick = () => {
        if (!pais) return 'Selecione el nombre del pais';

        setAccion('Edit');
        setIsOpen(true);
    }

    const handleRemoverPaisClick = async () => {
        if (!pais) return;

        const response = await restClient.httpDelete('/pais', pais.Id);

        if (response === 'success') {
            handleDismissAlertClick();
            SetPaises(undefined);
            fetchPaises();
        }
    }

    const handleNoRemoverPaisClick = () => {

        handleDismissAlertClick();
    }

    const onRenderEdit = (row) => <IconButton iconProps={{ iconName: 'Edit' }} onClick={handleEditPaisClick} />
    const onRenderDelete = (row) => <IconButton iconProps={{ iconName: 'Delete' }} onClick={handleRemovePaisClick} />

    const columns = [
        { key: 'onRenderEdit', name: '', fieldName: '', minWidth: 30, maxWidth: 30, isResizable: true, onRender: onRenderEdit },
        { key: 'onRenderDelete', name: '', fieldName: '', minWidth: 30, maxWidth: 30, isResizable: true, onRender: onRenderDelete },
        { key: 'column1', name: 'Id', fieldName: 'Id', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column2', name: 'Nombre', fieldName: 'Nombre', minWidth: 100, maxWidth: 200, isResizable: true }
        ]

    const isDisableButton = pais ? false : true;

    return (
        <div className="pais">
            
            <CommandBar // Esta es la barra de comandos en donde están los botones para agregar, editar, etc.
                items={[{
                    key: 'refresh',
                    text: 'Actualizar',
                    iconProps: { iconName: 'Refresh' },
                    onClick: handleRefreshClick,
                }, {
                    key: 'newPais',
                    text: 'Nuevo',
                    iconProps: { iconName: 'Add' },
                    onClick: handleNuevoPaisClick,
                },
                {
                    key: 'removePais',
                    text: 'Eliminar',
                    iconProps: { iconName: 'Delete' },
                    onClick: handleRemovePaisClick,
                    disabled: isDisableButton
                }, {
                    key: 'editarPais',
                    text: 'Editar Pais',
                    iconProps: { iconName: 'Edit' },
                    onClick: handleEditPaisClick,
                    disabled: isDisableButton
                }]}
            />

            <SearchBox // Control de búsqueda
            styles={{ root: { width: '300px' } }} placeholder="Buscar..." onSearch={handleSearchPais} />

            <div className="contenedorLista">
                <ShimmeredDetailsList
                    items={filtro.length ? filtro : paises}
                    columns={columns}
                    layoutMode={DetailsListLayoutMode.justified}
                    selection={seleccion}
                    selectionPreservedOnEmptyClick={true}
                    selectionMode={SelectionMode.single}
                    enableShimmer={!paises}
                />
            </div>

            <Panel // Este es el panel que sale del lado derecho para agregar o editar información
                headerText={acccion === 'New' ? "Nuevo Pais" : "Editar Pais"} // Aquí se valida si el título de header es para hacer uno nuevo o para editar, esto debido a que se esta reutilizando el mismo panel
                isOpen={isOpen}
                onDismiss={handleDismissClick}
                customWidth="700px"
            >
                <PaisForm // Este es el formulario que contiene los controles con la información
                    fetchPaises={fetchPaises} // Hace un GET a la API
                    paisSeleccionado={pais || {}}
                    acccion={acccion}
                    onDismiss={handleDismissClick}
                />
            </Panel>

            <Dialog // Ventana de diálogo que aparece cuándo se desea remover un registro
                hidden={isOpenAlert}
                onDismiss={handleDismissAlertClick} 
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Eliminar pais',
                    closeButtonAriaLabel: 'Close',
                    subText: 'Eliminar el pais?',
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
                    <PrimaryButton onClick={handleRemoverPaisClick} text="Si" />
                    <DefaultButton onClick={handleNoRemoverPaisClick} text="No" />
                </DialogFooter>
            </Dialog>
        </div>
    )
}

