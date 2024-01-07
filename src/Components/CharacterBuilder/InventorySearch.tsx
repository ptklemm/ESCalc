import { useContext, useState, useCallback, useEffect, ChangeEvent } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { ColDef, RowSelectedEvent, ICellRendererParams } from 'ag-grid-community';
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
import { ItemCatalogContext, Category, CATEGORY_OPTIONS } from '../../types/ItemCatalog.ts';
import { Item, UniqueItem } from '../../types/Item.ts';
import { ItemProperty } from '../../types/Property.ts';
import { CharacterClass, CLASS_OPTIONS } from '../../types/Character.ts';
import { SLOT_TYPE_OPTIONS, SlotType } from '../../types/Inventory.ts';
import { HorizontalInput, HorizontalSelect } from '../shared/FormComponents.tsx';

const UniqueItemPropertiesCell = (props: ICellRendererParams<UniqueItem, ItemProperty[]>) => {
    return (
        <div>
            {props.value?.sort((a, b) => b.DescriptionPriority - a.DescriptionPriority).map((property, index) => <p key={`${index}-${property.Stat}`}>{property.FormattedDescription}</p>)}
        </div>
    );
}

interface InventorySearchProps {
    calledFromInventory?: boolean;
    onItemSelected?: (item: Item | UniqueItem) => void;
}

export default function InventorySearch({ calledFromInventory, onItemSelected }: InventorySearchProps) {
    const dispatch = useAppDispatch();

    const catalog = useContext(ItemCatalogContext);

    const options = useAppSelector(state => state.inventorySearch);
    const searchingForUniques = options.category === Category.UniqueArmor || options.category === Category.UniqueWeapons;

    const [itemResults, setItemResults] = useState<Item[]>([]);
    const [uniqueItemResults, setUniqueItemResults] = useState<UniqueItem[]>([]);

    const defaultColDefItem: ColDef<Item> = { cellStyle: { textAlign: 'center' }};
    const defaultColDefUnique: ColDef<UniqueItem> = { cellStyle: { textAlign: 'center' }};

    const [colDefsItem] = useState<ColDef<Item>[]>([
        { field: "Code", width: 70 },
        { field: "DisplayName", headerName: "Item", width: 200, cellStyle: {textAlign: 'left'} },
        { field: "QualityLevel", headerName: "QLvl", width: 70 },
        { field: "MagicLevel", headerName: "Magic Lvl", width: 100 },
        { field: "RequiredLevel", headerName: "Req Lvl", width: 100 },
        { field: "RequiredStrength", headerName: "Req Str", width: 100 },
        { field: "DefenseMin", headerName: "DefMin", width: 100 },
        { field: "DefenseMax", headerName: "DefMax", width: 100 },
        { field: "DamageMin", headerName: "DmgMin", width: 100 },
        { field: "DamageMax", headerName: "DmgMax", width: 100 }
    ]);

    const [colDefsUnique] = useState<ColDef<UniqueItem>[]>([
        { field: "Name", headerName: "Item", width: 200, cellStyle: {textAlign: 'left'} },
        { field: "QualityLevelUnique", headerName: "QLvl", width: 70 },
        { field: "RequiredLevelUnique", headerName: "Req Lvl", width: 100 },
        { field: "BaseItem.RequiredStrength", headerName: "Req Str", width: 100 },
        { field: "BaseItem.RequiredDexterity", headerName: "Req Dex", width: 100 },
        { field: "Properties", cellRenderer: UniqueItemPropertiesCell }
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
            console.log(event.data);
            // onItemSelected(event.data);
        }
    }, [onItemSelected]);

    const selectUnique = useCallback((event: RowSelectedEvent<UniqueItem>) => {
        if (onItemSelected && event.data) {
            console.log(event.data);
            // onItemSelected(event.data);
        }
    }, [onItemSelected]);

    useEffect(() => {
        if (calledFromInventory) {
            const res = catalog.SearchForItems(options);

            if (searchingForUniques) {
                setUniqueItemResults(res as UniqueItem[]);
            } else {
                setItemResults(res as Item[]);
            }
        }
    }, [calledFromInventory, options, searchingForUniques, catalog]);

    return (
        <Form id="InventorySearch">
            <Row style={{ marginBottom: 20 }}>
                <Col md={3}>
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
                    {
                        searchingForUniques
                            ?   <AgGridReact<UniqueItem>
                                    rowData={uniqueItemResults}
                                    defaultColDef={defaultColDefUnique}
                                    columnDefs={colDefsUnique}
                                    suppressMovableColumns={true}
                                    pagination={true}
                                    paginationPageSize={20}
                                    rowSelection='single'
                                    suppressCellFocus={true}
                                    onRowSelected={selectUnique} />
                            :   <AgGridReact<Item>
                                    rowData={itemResults}
                                    defaultColDef={defaultColDefItem}
                                    columnDefs={colDefsItem}
                                    suppressMovableColumns={true}
                                    pagination={true}
                                    paginationPageSize={20}
                                    rowSelection='single'
                                    suppressCellFocus={true}
                                    onRowSelected={selectItem} />
                    }
                </Col>
            </Row>
        </Form>
    );
}