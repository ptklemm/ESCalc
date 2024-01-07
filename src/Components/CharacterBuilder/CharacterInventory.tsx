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
import { Item, UniqueItem } from '../../types/Item.ts';
import ItemSearch from './InventorySearch.tsx';

interface ItemDisplayProps {
    item: Item | UniqueItem;
}

const ItemDisplay = ({ item }: ItemDisplayProps ) => (
    <div id={item.Code} style={{ textAlign: 'center' }}>
        <p>Item Level: {item.QualityLevel}</p>
        {item.DefenseMax ? <p>Defense: {item.DefenseMax}</p> : null}
        {item.ChanceToBlock ? <p>Chance to Block: {item.ChanceToBlock}%</p> : null}
        {item.DamageMax ? <p>Damage: {item.DamageMin}-{item.DamageMax}</p> : null}
        {!item.IsIndestructible && item.Durability ? <p>Durability: {item.Durability} of {item.Durability}</p> : null}
        {item.RequiredDexterity ? <p>Required Dexterity: {item.RequiredDexterity}</p> : null}
        {item.RequiredStrength ? <p>Required Strength: {item.RequiredStrength}</p> : null}
        {item.RequiredLevel ? <p>Required Level: {item.RequiredLevel}</p> : null}
    </div>
);

interface InventorySlotProps {
    slot: Slot;
    category: Category;
    item: Item | UniqueItem | null;
    onClick: (category: Category, slot: Slot) => void;
}

const InventorySlot = ({ category, slot, item, onClick }: InventorySlotProps) => {
    const search = useCallback(() => {
        onClick(category, slot);
    }, [category, slot, onClick]);

    return (
        <Card style={{ width: 250, height: 400 }}>
            <Card.Body>
                <Card.Title style={{ textAlign: 'center' }}>{item ? item.DisplayName : slot}</Card.Title>
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
        dispatch(changeCharacterClass(character.Class));
        setShowModal(true);
    }

    function hideSearchModal() {
        setSearchingForSlot(Slot.Empty);
        setShowModal(false);
    }

    function selectItem(item: Item | UniqueItem) {
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
                <Col><InventorySlot slot={Slot.Primary1} category={Category.Weapons} item={inventory.Primary1} onClick={showSearchModal}/></Col>
                <Col><InventorySlot slot={Slot.Secondary1} category={Category.Armor} item={inventory.Secondary1} onClick={showSearchModal} /></Col>
                <Col><InventorySlot slot={Slot.Body} category={Category.Armor} item={inventory.Body} onClick={showSearchModal} /></Col>
                <Col><InventorySlot slot={Slot.Helm} category={Category.Armor} item={inventory.Helm} onClick={showSearchModal} /></Col>
                <Col><InventorySlot slot={Slot.Gloves} category={Category.Armor} item={inventory.Gloves} onClick={showSearchModal} /></Col>
                <Col><InventorySlot slot={Slot.Belt} category={Category.Armor} item={inventory.Belt} onClick={showSearchModal} /></Col>
            </Row>
            <Row>
                <Col><InventorySlot slot={Slot.Primary2} category={Category.Weapons} item={inventory.Primary2} onClick={showSearchModal} /></Col>
                <Col><InventorySlot slot={Slot.Secondary2} category={Category.Armor} item={inventory.Secondary2} onClick={showSearchModal} /></Col>
                <Col><InventorySlot slot={Slot.Boots} category={Category.Armor} item={inventory.Boots} onClick={showSearchModal} /></Col>
                <Col><InventorySlot slot={Slot.Amulet} category={Category.Armor} item={inventory.Amulet} onClick={showSearchModal} /></Col>
                <Col><InventorySlot slot={Slot.LeftRing} category={Category.Armor} item={inventory.LeftRing} onClick={showSearchModal} /></Col>
                <Col><InventorySlot slot={Slot.RightRing} category={Category.Armor} item={inventory.RightRing} onClick={showSearchModal} /></Col>
            </Row>
        </div>
    );
}