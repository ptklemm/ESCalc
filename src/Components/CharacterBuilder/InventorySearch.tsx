import { useContext, useState, useCallback, useEffect, ChangeEvent } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { ColDef, RowSelectedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { useAppSelector, useAppDispatch } from '../../redux/hooks.ts';
import {
    changeName,
    changeCode,
    changeCategory,
    changeSlotType,
    changeCharacterClass,
    changeRequiredLevel
} from '../../redux/inventorySearchReducer.ts';
import { EasternSunCatalogContext } from '../../types/EasternSunCatalog.ts';
import { Category, CATEGORY_OPTIONS } from '../../types/ItemCatalog.ts';
import { Item } from '../../types/Item.ts';
// import { ItemProperty } from '../../types/Property.ts';
import { CharacterClass, CLASS_OPTIONS } from '../../types/Character.ts';
import { SLOT_TYPE_OPTIONS, SlotType } from '../../types/Inventory.ts';
import { HorizontalInput, HorizontalSelect } from '../shared/FormComponents.tsx';

interface InventorySearchProps {
    calledFromInventory?: boolean;
    onItemSelected?: (item: Item) => void;
}

export default function InventorySearch({ calledFromInventory, onItemSelected }: InventorySearchProps) {
    const dispatch = useAppDispatch();

    const catalog = useContext(EasternSunCatalogContext);

    const options = useAppSelector(state => state.inventorySearch);
  
    const [results, setResults] = useState<Item[]>([]);

    const defaultColDef: ColDef<Item> = { cellStyle: { textAlign: 'center' }};

    const [colDefs] = useState<ColDef<Item>[]>([
        { field: "code", width: 70 },
        { field: "name", headerName: "Item", width: 200, cellStyle: {textAlign: 'left'} },
        { field: "qualityLevel", headerName: "QLvl", width: 70, sort: 'desc' },
        { field: "magicLevel", headerName: "Magic Lvl", width: 100 },
        { field: "requiredLevel", headerName: "Req Lvl", width: 100 },
        { field: "requiredStrength", headerName: "Req Str", width: 100 },
        { field: "defenseMin", headerName: "DefMin", width: 100 },
        { field: "defenseMax", headerName: "DefMax", width: 100 },
        { field: "damageMin", headerName: "DmgMin", width: 100 },
        { field: "damageMax", headerName: "DmgMax", width: 100 }
    ]);

    const change = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { value } = event.target;
        switch(event.target.id) {
            case "name":
                dispatch(changeName(value));
                break;
            case "code":
                dispatch(changeCode(value));
                break;
            case "category":
                dispatch(changeCategory(value as Category));
                break;
            case "slotType":
                dispatch(changeSlotType(value as SlotType));
                break;
            case "characterClass":
                dispatch(changeCharacterClass(value as CharacterClass));
                break;
            case "requiredLevel":
                dispatch(changeRequiredLevel(Number(value)));
                break;
        }
    }, [dispatch]);

    const selectItem = useCallback((event: RowSelectedEvent<Item>) => {
        if (onItemSelected && event.data) {
            onItemSelected(event.data);
        }
    }, [onItemSelected]);

    useEffect(() => {
        if (calledFromInventory) {
            const res = catalog.items.SearchForItems(options);
            setResults(res);
        }
    }, [calledFromInventory, options, catalog]);

    return (
        <Form id="InventorySearch">
            <Row style={{ marginBottom: 20 }}>
                <Col md={5}>
                    <HorizontalSelect 
                        id="category" 
                        label="Category" 
                        options={CATEGORY_OPTIONS} 
                        value={options.category} 
                        onChange={change} 
                    />
                    <HorizontalSelect 
                        id="slotType" 
                        label="Slot" 
                        options={SLOT_TYPE_OPTIONS} 
                        value={options.slotType} 
                        onChange={change} 
                    />
                    <HorizontalSelect 
                        id="characterClass" 
                        label="Class" 
                        options={CLASS_OPTIONS} 
                        value={options.characterClass} 
                        onChange={change} 
                    />
                    <HorizontalInput
                        id="name"
                        label="Name" 
                        value={options.name} 
                        onChange={change} 
                    />
                    <HorizontalInput 
                        id="code" 
                        label="Code" 
                        value={options.code} 
                        onChange={change} 
                    />
                </Col>
            </Row>
            {/* <Row style={{ marginTop: 20, marginBottom: 20 }}>
                <Col md={3}>
                    <Button size="sm" style={{ marginRight: 10 }} variant="primary" type="submit">Search</Button>
                    <Button size="sm" variant="warning" type="reset" onClick={reset}>Reset</Button>
                </Col>
            </Row> */}
            <Row>
                <Col className="ag-theme-quartz" style={{ height: 575 }}>
                    <AgGridReact<Item>
                        rowData={results}
                        defaultColDef={defaultColDef}
                        columnDefs={colDefs}
                        suppressMovableColumns={true}
                        pagination={true}
                        paginationPageSize={20}
                        rowSelection='single'
                        suppressCellFocus={true}
                        onRowSelected={selectItem}
                    />
                </Col>
            </Row>
        </Form>
    );
}