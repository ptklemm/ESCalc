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
import calculateStats from './calculateStats.ts';
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

    const [level, setLevel] = useState(String(character.level));
    const [attributes, setAttributes] = useState<AttributeInputs>({
        strength: String(character.strength),
        dexterity: String(character.dexterity),
        vitality: String(character.vitality),
        energy: String(character.energy)
    });

    // Calculate new modified stats before render, memoize
    const stats = useMemo(() => calculateStats(character, inventory), [character, inventory]);

    const handleClassSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;

        if (!value || value == character.characterClass)
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

        setLevel(String(newCharacter.level));
        setAttributes({
            strength: String(newCharacter.strength),
            dexterity: String(newCharacter.dexterity),
            vitality: String(newCharacter.vitality),
            energy: String(newCharacter.energy)
        });
        dispatch(changeCharacter(newCharacter));
    }

    const handleLevelBlur = (event: FocusEvent<HTMLInputElement>) => {
        let value = Number(event.target.value);

        if (!value) {
            value = character.level;
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

        if (value && value !== character.difficultyLevel) {
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
        const baseValue = character[`base${attribute}` as keyof Character] as number;

        if (!value || value < baseValue) {
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
            <Col md={3}>
                <Row>
                    <Form id="CharacterStats">
                        <Row>
                            <HorizontalSelect id="Class" label="Class" options={CLASS_OPTIONS_MINIMAL} value={character.characterClass} onChange={handleClassSelect} />
                            <HorizontalInput id="Level" label="Level" value={level} onChange={e => setLevel(e.target.value)} onBlur={handleLevelBlur} />
                            <HorizontalSelect id="Difficulty" label="Difficulty" options={DIFFICULTY_OPTIONS} value={character.difficultyLevel} onChange={handleDifficultyChange} />
                        </Row>
                        <Row>
                            <HorizontalInput id={Attribute.Strength} label={Attribute.Strength} value={attributes.strength} onChange={handleAttributeChange} onBlur={handleAttributeBlur} />
                            <HorizontalInput id={Attribute.Dexterity} label={Attribute.Dexterity} value={attributes.dexterity} onChange={handleAttributeChange} onBlur={handleAttributeBlur} />
                            <HorizontalInput id={Attribute.Vitality} label={Attribute.Vitality} value={attributes.vitality} onChange={handleAttributeChange} onBlur={handleAttributeBlur} />
                            <HorizontalInput id={Attribute.Energy} label={Attribute.Energy} value={attributes.energy} onChange={handleAttributeChange} onBlur={handleAttributeBlur} />
                        </Row>
                    </Form>
                </Row>
                <Row>
                    <div id="CalculatedStats">
                        <StatDisplay>Points Remaining: {stats.statPointsRemaining}</StatDisplay>
                        <StatDisplay>Modified Strength: {stats.strength}</StatDisplay>
                        <StatDisplay>Modified Dexterity: {stats.dexterity}</StatDisplay>
                        <StatDisplay>Modified Vitality: {stats.vitality}</StatDisplay>
                        <StatDisplay>Modified Energy: {stats.energy}</StatDisplay>
                        <StatDisplay>Life: {stats.life}</StatDisplay>
                        <StatDisplay>Mana: {stats.mana}</StatDisplay>
                        <StatDisplay>Stamina: {stats.stamina}</StatDisplay>
                        <StatDisplay>Attack Damage: {stats.attackDamageMin}-{stats.attackDamageMax}</StatDisplay>
                        <StatDisplay>Attack Rating: {stats.attackRating}</StatDisplay>
                        <StatDisplay>Chance to Hit: {stats.chanceToHit}</StatDisplay>
                        <StatDisplay>Defense: {stats.defense}</StatDisplay>
                        <StatDisplay>Chance to Be Hit: {stats.chanceToBeHit}</StatDisplay>
                        <StatDisplay>Chance to Block: {stats.chanceToBlock}%</StatDisplay>
                        <StatDisplay>Fire Resistance: {stats.resistanceFire}</StatDisplay>
                        <StatDisplay>Cold Resistance: {stats.resistanceCold}</StatDisplay>
                        <StatDisplay>Lightning Resistance: {stats.resistanceLightning}</StatDisplay>
                        <StatDisplay>Poison Resistance: {stats.resistancePoison}</StatDisplay>
                    </div>
                </Row>
            </Col>
            <Col>
                <CharacterInventory character={character} inventory={inventory} />
            </Col>
        </Row>
    );
}