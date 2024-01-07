import { useState, useCallback } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useAppDispatch } from '../../redux/hooks.ts';
import { changeItem } from '../../redux/inventoryReducer.ts';
import {
    changeCategory,
    changeSlotType,
    changeCharacterClass
} from '../../redux/inventorySearchReducer.ts';
import { Character } from '../../types/Character.ts';
import { Inventory, Slot, GetSlotType } from '../../types/Inventory.ts';
import { Category } from '../../types/ItemCatalog.ts';
import { Item } from '../../types/Item.ts';
import ItemSearch from './InventorySearch.tsx';
import renderItemProperties from '../shared/renderItemProperties.tsx';

interface ItemDisplayProps {
    item: Item;
}

const ItemDisplay = ({ item }: ItemDisplayProps ) => (
    <div id={item.code} style={{ textAlign: 'center' }}>
        <p>Item Level: {item.qualityLevel}</p>
        {item.defenseMax ? <p>Defense: {item.defenseMax}</p> : null}
        {item.chanceToBlock ? <p>Chance to Block: {item.chanceToBlock}%</p> : null}
        {item.damageMax ? <p>Damage: {item.damageMin}-{item.damageMax}</p> : null}
        {!item.isIndestructible && item.durability ? <p>Durability: {item.durability} of {item.durability}</p> : null}
        {item.requiredDexterity ? <p>Required Dexterity: {item.requiredDexterity}</p> : null}
        {item.requiredStrength ? <p>Required Strength: {item.requiredStrength}</p> : null}
        {item.requiredLevel ? <p>Required Level: {item.requiredLevel}</p> : null}
        {renderItemProperties(item.properties, item.code)}
    </div>
);

interface InventorySlotProps {
    slot: Slot;
    category: Category;
    item: Item | null;
    onClick: (category: Category, slot: Slot) => void;
}

const InventorySlot = ({ category, slot, item, onClick }: InventorySlotProps) => {
    const search = useCallback(() => {
        onClick(category, slot);
    }, [category, slot, onClick]);

    return (
        <Card style={{ width: 250, height: 400, textAlign: 'center', verticalAlign: 'center' }}>
            <Card.Header ><Card.Title>{item ? item.name : slot}</Card.Title></Card.Header>
            <Card.Body style={{ overflow: 'auto' }}>
                {item ? <ItemDisplay item={item} /> : null}
            </Card.Body>
            <Card.Footer>
                <Button size="sm" onClick={search}>Search</Button>
            </Card.Footer>
        </Card>
    );
}

interface CharacterInventoryProps {
    character: Character;
    inventory: Inventory;
}

export default function CharacterInventory({ character, inventory }: CharacterInventoryProps) {
    const dispatch = useAppDispatch();

    const [showModal, setShowModal] = useState(false);
    const [searchingForSlot, setSearchingForSlot] = useState(Slot.Empty);

    function showSearchModal(category: Category, slot: Slot) {
        setSearchingForSlot(slot);
        dispatch(changeCategory(category));
        dispatch(changeSlotType(GetSlotType(slot)));
        dispatch(changeCharacterClass(character.characterClass));
        setShowModal(true);
    }

    function hideSearchModal() {
        setSearchingForSlot(Slot.Empty);
        setShowModal(false);
    }

    function selectItem(item: Item) {
        console.log(item);
        dispatch(changeItem({ slot: searchingForSlot, item}));
        hideSearchModal();
    }

    return (
        <div id="CharacterInventory">
            <Modal size="xl" centered show={showModal} onHide={hideSearchModal}>
                <Modal.Header closeButton />
                <Modal.Body>
                    <ItemSearch calledFromInventory onItemSelected={selectItem} />
                </Modal.Body>
            </Modal>
            <Row style={{ marginBottom: 50 }}>
                <Col><InventorySlot slot={Slot.Primary1} category={Category.Weapons} item={inventory[Slot.Primary1]} onClick={showSearchModal}/></Col>
                <Col><InventorySlot slot={Slot.Secondary1} category={Category.Armor} item={inventory[Slot.Secondary1]} onClick={showSearchModal} /></Col>
                <Col><InventorySlot slot={Slot.Body} category={Category.Armor} item={inventory[Slot.Body]} onClick={showSearchModal} /></Col>
                <Col><InventorySlot slot={Slot.Helm} category={Category.Armor} item={inventory[Slot.Helm]} onClick={showSearchModal} /></Col>
                <Col><InventorySlot slot={Slot.Gloves} category={Category.Armor} item={inventory[Slot.Gloves]} onClick={showSearchModal} /></Col>
                <Col><InventorySlot slot={Slot.Belt} category={Category.Armor} item={inventory[Slot.Belt]} onClick={showSearchModal} /></Col>
            </Row>
            <Row>
                <Col><InventorySlot slot={Slot.Primary2} category={Category.Weapons} item={inventory[Slot.Primary2]} onClick={showSearchModal} /></Col>
                <Col><InventorySlot slot={Slot.Secondary2} category={Category.Armor} item={inventory[Slot.Secondary2]} onClick={showSearchModal} /></Col>
                <Col><InventorySlot slot={Slot.Boots} category={Category.Armor} item={inventory[Slot.Boots]} onClick={showSearchModal} /></Col>
                <Col><InventorySlot slot={Slot.Amulet} category={Category.Armor} item={inventory[Slot.Amulet]} onClick={showSearchModal} /></Col>
                <Col><InventorySlot slot={Slot.LeftRing} category={Category.Armor} item={inventory[Slot.LeftRing]} onClick={showSearchModal} /></Col>
                <Col><InventorySlot slot={Slot.RightRing} category={Category.Armor} item={inventory[Slot.RightRing]} onClick={showSearchModal} /></Col>
            </Row>
        </div>
    );
}