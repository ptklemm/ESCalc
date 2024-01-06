import { useState, useMemo, ChangeEvent, FocusEvent } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '../../redux/hooks.ts';
import { 
    changeCharacter,
    changeLevel,
    changeDifficulty,
    changeStrength,
    changeDexterity,
    changeVitality,
    changeEnergy
 } from '../../redux/characterReducer.ts';
import { HorizontalInput, HorizontalSelect, StatDisplay } from '../shared/FormComponents.tsx';
import { 
    Character, 
    NewCharacter, 
    CharacterClass, 
    CLASS_OPTIONS_MINIMAL, 
    DIFFICULTY_OPTIONS, 
    Difficulty, 
    Attribute 
} from '../../types/Character.ts';
import CalculateStats from './CalculateStats.ts';
import CharacterInventory from './CharacterInventory.tsx';

interface AttributeInputs {
    [index: string]: string;
    strength: string;
    dexterity: string;
    vitality: string;
    energy: string;
}

export default function CharacterBuilder() {
    const dispatch = useAppDispatch();
   
    const character = useAppSelector(state => state.character);
    const inventory = useAppSelector(state => state.inventory);

    const [level, setLevel] = useState(String(character.Level));
    const [attributes, setAttributes] = useState<AttributeInputs>({
        strength: String(character.Strength),
        dexterity: String(character.Dexterity),
        vitality: String(character.Vitality),
        energy: String(character.Energy)
    });

    // Calculate new modified stats before render, memoize
    const stats = useMemo(() => CalculateStats(character, inventory), [character, inventory]);

    const handleClassSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;

        if (!value || value == character.Class)
            return;

        let newCharacter: Character;

        switch (value) {
            case CharacterClass.Amazon:
                newCharacter = NewCharacter(CharacterClass.Amazon);
                break;
            case CharacterClass.Assassin:
                newCharacter = NewCharacter(CharacterClass.Assassin);
                break;
            case CharacterClass.Barbarian:
                newCharacter = NewCharacter(CharacterClass.Barbarian);
                break;
            case CharacterClass.Druid:
                newCharacter = NewCharacter(CharacterClass.Druid);
                break;
            case CharacterClass.Necromancer:
                newCharacter = NewCharacter(CharacterClass.Necromancer);
                break;
            case CharacterClass.Paladin:
                newCharacter = NewCharacter(CharacterClass.Paladin);
                break;
            case CharacterClass.Sorceress:
                newCharacter = NewCharacter(CharacterClass.Sorceress);
                break;
            default:
                newCharacter = NewCharacter();
        }

        setLevel(String(newCharacter.Level));
        setAttributes({
            strength: String(newCharacter.Strength),
            dexterity: String(newCharacter.Dexterity),
            vitality: String(newCharacter.Vitality),
            energy: String(newCharacter.Energy)
        });
        dispatch(changeCharacter(newCharacter));
    }

    const handleLevelBlur = (event: FocusEvent<HTMLInputElement>) => {
        let value = Number(event.target.value);

        if (!value) {
            value = character.Level;
        } else if (value < 1) {
            value = 1;
        } else if (value > 99) {
            value = 99;
        }

        setLevel(String(value));
        dispatch(changeLevel(value));
    }

    const handleDifficultyChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;

        if (value && value !== character.DifficultyLevel) {
            dispatch(changeDifficulty(Difficulty[value as keyof typeof Difficulty]))
        }
    }

    const handleAttributeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const attribute = event.target.id;
        const value = event.target.value;

        if (value !== attributes[attribute]) {
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
    }

    const handleAttributeBlur = (event: FocusEvent<HTMLInputElement>) => {
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
                dispatch(changeStrength(value));
                break;
            case Attribute.Dexterity:
                setAttributes({ ...attributes, dexterity: String(value)});
                dispatch(changeDexterity(value));
                break;
            case Attribute.Vitality:
                setAttributes({ ...attributes, vitality: String(value)});
                dispatch(changeVitality(value));
                break;
            case Attribute.Energy:
                setAttributes({ ...attributes, energy: String(value)});
                dispatch(changeEnergy(value));
                break;
        }
    }

    return (
        <Row id="CharacterBuilder">
            <Col md={2}>
                <Row>
                    <Form id="CharacterStats">
                        <HorizontalSelect id="Class" label="Class" options={CLASS_OPTIONS_MINIMAL} value={character.Class} onChange={handleClassSelect} />
                        <HorizontalInput id="Level" label="Level" value={level} onChange={e => setLevel(e.target.value)} onBlur={handleLevelBlur} />
                        <HorizontalSelect id="Difficulty" label="Difficulty" options={DIFFICULTY_OPTIONS} value={character.DifficultyLevel} onChange={handleDifficultyChange} />
                        <HorizontalInput id={Attribute.Strength} label={Attribute.Strength} value={attributes.strength} onChange={handleAttributeChange} onBlur={handleAttributeBlur} />
                        <HorizontalInput id={Attribute.Dexterity} label={Attribute.Dexterity} value={attributes.dexterity} onChange={handleAttributeChange} onBlur={handleAttributeBlur} />
                        <HorizontalInput id={Attribute.Vitality} label={Attribute.Vitality} value={attributes.vitality} onChange={handleAttributeChange} onBlur={handleAttributeBlur} />
                        <HorizontalInput id={Attribute.Energy} label={Attribute.Energy} value={attributes.energy} onChange={handleAttributeChange} onBlur={handleAttributeBlur} />
                    </Form>
                </Row>
                <Row>
                    <div id="CalculatedStats">
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
                        <StatDisplay>Chance to Block: {stats.ChanceToBlock}%</StatDisplay>
                        <StatDisplay>Fire Resistance: {stats.ResistanceFire}</StatDisplay>
                        <StatDisplay>Cold Resistance: {stats.ResistanceCold}</StatDisplay>
                        <StatDisplay>Lightning Resistance: {stats.ResistanceLightning}</StatDisplay>
                        <StatDisplay>Poison Resistance: {stats.ResistancePoison}</StatDisplay>
                    </div>
                </Row>
            </Col>
            <Col>
                <CharacterInventory character={character} inventory={inventory} />
            </Col>
        </Row>
    );
}