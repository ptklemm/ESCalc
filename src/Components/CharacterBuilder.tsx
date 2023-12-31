import { useState, ChangeEvent, FocusEvent } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { HorizontalInput, HorizontalSelect, StatDisplay } from './FormComponents';
import { Character, CharacterClass, CLASSES, DIFFICULTIES, Difficulty, Attribute } from '../types/Character';
import { CharacterStats } from '../types/CharacterStats';

export default function CharacterBuilder() {
    const [character, setCharacter] = useState(new Character());
    const [level, setLevel] = useState(String(character.Level));
    const [attributes, setAttributes] = useState({
        strength: String(character.Strength),
        dexterity: String(character.Dexterity),
        vitality: String(character.Vitality),
        energy: String(character.Energy)
    });

    function handleClassSelect(event: ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value;

        if (!value || value == character.Class)
            return;

        let newCharacter: Character;

        switch (value) {
            case CharacterClass.Amazon:
                newCharacter = new Character(CharacterClass.Amazon);
                break;
            case CharacterClass.Assassin:
                newCharacter = new Character(CharacterClass.Assassin);
                break;
            case CharacterClass.Barbarian:
                newCharacter = new Character(CharacterClass.Barbarian);
                break;
            case CharacterClass.Druid:
                newCharacter = new Character(CharacterClass.Druid);
                break;
            case CharacterClass.Necromancer:
                newCharacter = new Character(CharacterClass.Necromancer);
                break;
            case CharacterClass.Paladin:
                newCharacter = new Character(CharacterClass.Paladin);
                break;
            case CharacterClass.Sorceress:
                newCharacter = new Character(CharacterClass.Sorceress);
                break;
            default:
                newCharacter = new Character();
        }

        setCharacter(newCharacter);
        setLevel(String(newCharacter.Level));
        setAttributes({
            strength: String(newCharacter.Strength),
            dexterity: String(newCharacter.Dexterity),
            vitality: String(newCharacter.Vitality),
            energy: String(newCharacter.Energy)
        });
    }

    function handleLevelBlur(event: FocusEvent<HTMLInputElement>) {
        let value = Number(event.target.value);

        if (!value) {
            value = character.Level;
        } else if (value < 1) {
            value = 1;
        } else if (value > 99) {
            value = 99;
        }

        setLevel(String(value));
        setCharacter({ ...character, Level: value });
    }

    function handleDifficultyChange(event: ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value;

        if (!value || value == character.Difficulty)
            return;

        switch (value) {
            case Difficulty.Normal:
                setCharacter({ ...character, Difficulty: Difficulty.Normal});
                break;
            case Difficulty.Nightmare:
                setCharacter({ ...character, Difficulty: Difficulty.Nightmare});
                break;
            case Difficulty.Hell:
                setCharacter({ ...character, Difficulty: Difficulty.Hell});
                break;
        }
    }

    function handleAttributeChange(event: ChangeEvent<HTMLInputElement>) {
        const attribute = event.target.id;
        const value = event.target.value;
        switch (attribute) {
            case Attribute.Strength:
                setAttributes({ ...attributes, strength: value});
                break;
            case Attribute.Dexterity:
                setAttributes({ ...attributes, dexterity: value});
                break;
            case Attribute.Vitality:
                setAttributes({ ...attributes, vitality: value});
                break;
            case Attribute.Energy:
                setAttributes({ ...attributes, energy: value});
                break;
        }
    }

    function handleAttributeBlur(event: FocusEvent<HTMLInputElement>) {
        const attribute = event.target.id;
        let value = Number(event.target.value);
        const currentValue = character[attribute as keyof Character] as number;
        const baseValue = character[`Base${attribute}` as keyof Character] as number;

        if (!value) {
            value = currentValue;
        } else if (value < currentValue) {
            value = baseValue;
        } else if ( value > 1023) {
            value = 1023; // max display value for attributes
        }

        switch (attribute) {
            case Attribute.Strength:
                setAttributes({ ...attributes, strength: String(value)});
                setCharacter({ ...character, Strength: value });
                break;
            case Attribute.Dexterity:
                setAttributes({ ...attributes, dexterity: String(value)});
                setCharacter({ ...character, Dexterity: value });
                break;
            case Attribute.Vitality:
                setAttributes({ ...attributes, vitality: String(value)});
                setCharacter({ ...character, Vitality: value });
                break;
            case Attribute.Energy:
                setAttributes({ ...attributes, energy: String(value)});
                setCharacter({ ...character, Energy: value });
                break;
        }
    }

    // Calculate new modified stats before render
    const stats = new CharacterStats(character);

    return (
        <Row id="CharacterBuilder">
            <Col md={2}>
                <Form id="Character">
                    <HorizontalSelect id="Class" label="Class" options={CLASSES} value={character.Class} onChange={handleClassSelect} />
                    <HorizontalInput id="Level" label="Level" value={level} onChange={e => setLevel(e.target.value)} onBlur={handleLevelBlur} />
                    <HorizontalSelect id="Difficulty" label="Difficulty" options={DIFFICULTIES} value={character.Difficulty} onChange={handleDifficultyChange} />
                    <HorizontalInput id={Attribute.Strength} label={Attribute.Strength} value={attributes.strength} onChange={handleAttributeChange} onBlur={handleAttributeBlur} />
                    <HorizontalInput id={Attribute.Dexterity} label={Attribute.Dexterity} value={attributes.dexterity} onChange={handleAttributeChange} onBlur={handleAttributeBlur} />
                    <HorizontalInput id={Attribute.Vitality} label={Attribute.Vitality} value={attributes.vitality} onChange={handleAttributeChange} onBlur={handleAttributeBlur} />
                    <HorizontalInput id={Attribute.Energy} label={Attribute.Energy} value={attributes.energy} onChange={handleAttributeChange} onBlur={handleAttributeBlur} />
                    <StatDisplay>Points Remaining: {stats.StatPointsRemaining}</StatDisplay>
                    <StatDisplay>Modified Strength: {stats.Strength}</StatDisplay>
                    <StatDisplay>Modified Dexterity: {stats.Dexterity}</StatDisplay>
                    <StatDisplay>Modified Vitality: {stats.Vitality}</StatDisplay>
                    <StatDisplay>Modified Energy: {stats.Energy}</StatDisplay>
                    <StatDisplay>Life: {stats.Life}</StatDisplay>
                    <StatDisplay>Mana: {stats.Mana}</StatDisplay>
                    <StatDisplay>Stamina: {stats.Stamina}</StatDisplay>
                    <StatDisplay>Attack Damage: {stats.AttackDamageMin}-{stats.AttackDamageMax}</StatDisplay>
                    <StatDisplay>Attack Rating: {stats.AttackRating}</StatDisplay>
                    <StatDisplay>Chance to Hit: {stats.ChanceToHit}</StatDisplay>
                    <StatDisplay>Defense: {stats.Defense}</StatDisplay>
                    <StatDisplay>Chance to Be Hit: {stats.ChanceToBeHit}</StatDisplay>
                    <StatDisplay>Chance to Block: {stats.ChanceToBlock}</StatDisplay>
                    <StatDisplay>Fire Resistance: {stats.ResistanceFire}</StatDisplay>
                    <StatDisplay>Cold Resistance: {stats.ResistanceCold}</StatDisplay>
                    <StatDisplay>Lightning Resistance: {stats.ResistanceLightning}</StatDisplay>
                    <StatDisplay>Poison Resistance: {stats.ResistancePoison}</StatDisplay>
                </Form>
            </Col>
            <Col><Form id="Inventory">Inventory</Form></Col>
        </Row>
    );
}