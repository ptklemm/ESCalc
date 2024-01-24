import { useState, useMemo, ChangeEvent, FocusEvent } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '../../redux/hooks.ts';
import { 
    changeCharacter,
    changeName,
    changeLevel,
    changeDifficulty,
    changeStrength,
    changeDexterity,
    changeVitality,
    changeEnergy,
    changeQuestStatus
 } from '../../redux/characterReducer.ts';
import { HorizontalInput, HorizontalSelect, AttributeInputGroup } from '../shared/FormComponents.tsx';
import { 
    Character, 
    NewCharacter, 
    CharacterClass, 
    CLASS_OPTIONS_MINIMAL, 
    DIFFICULTY_OPTIONS, 
    Difficulty, 
    Attribute,
    QuestStatusChange
} from '../../types/Character.ts';
import { calculateStats } from './calculateStats.ts';
import CharacterQuests from './CharacterQuests.tsx';
import CalculatedStatsDisplay from './CalculatedStatsDisplay.tsx';
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

        if (!value || value === character.characterClass)
            return;

        let newCharacter: Character;

        switch (value) {
            case CharacterClass.Amazon:
                newCharacter = NewCharacter(CharacterClass.Amazon, character.name);
                break;
            case CharacterClass.Assassin:
                newCharacter = NewCharacter(CharacterClass.Assassin, character.name);
                break;
            case CharacterClass.Barbarian:
                newCharacter = NewCharacter(CharacterClass.Barbarian, character.name);
                break;
            case CharacterClass.Druid:
                newCharacter = NewCharacter(CharacterClass.Druid, character.name);
                break;
            case CharacterClass.Necromancer:
                newCharacter = NewCharacter(CharacterClass.Necromancer, character.name);
                break;
            case CharacterClass.Paladin:
                newCharacter = NewCharacter(CharacterClass.Paladin, character.name);
                break;
            case CharacterClass.Sorceress:
                newCharacter = NewCharacter(CharacterClass.Sorceress, character.name);
                break;
            default:
                newCharacter = NewCharacter(undefined, character.name);
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

    const handleQuestChange = (status: QuestStatusChange) => {
        dispatch(changeQuestStatus(status));
    }

    return (
        <Row id="CharacterBuilder">
            <Col md={3}>
                <Row>
                    <Col>
                        <Form id="CharacterStats">
                            <fieldset>
                            <legend>Character</legend>
                                <HorizontalInput id="Name" label="Name" value={character.name} onChange={e => {dispatch(changeName(e.target.value))}} />
                                <HorizontalSelect id="Class" label="Class" options={CLASS_OPTIONS_MINIMAL} value={character.characterClass} onChange={handleClassSelect} />
                                <HorizontalInput id="Level" label="Level" type="number" value={level} onChange={e => setLevel(e.target.value)} onBlur={handleLevelBlur} />
                                <HorizontalSelect id="Difficulty" label="Difficulty" options={DIFFICULTY_OPTIONS} value={character.difficultyLevel} onChange={handleDifficultyChange} />
                                <AttributeInputGroup id={Attribute.Strength} label={Attribute.Strength} value={attributes.strength} displayValue={stats.strength} onChange={handleAttributeChange} onBlur={handleAttributeBlur} />
                                <AttributeInputGroup id={Attribute.Dexterity} label={Attribute.Dexterity} value={attributes.dexterity} displayValue={stats.dexterity} onChange={handleAttributeChange} onBlur={handleAttributeBlur} />
                                <AttributeInputGroup id={Attribute.Vitality} label={Attribute.Vitality} value={attributes.vitality} displayValue={stats.vitality} onChange={handleAttributeChange} onBlur={handleAttributeBlur} />
                                <AttributeInputGroup id={Attribute.Energy} label={Attribute.Energy} value={attributes.energy} displayValue={stats.energy} onChange={handleAttributeChange} onBlur={handleAttributeBlur} />
                                <Form.Text>Points Remaining: {stats.statPointsRemaining}</Form.Text>
                            </fieldset>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <CharacterQuests quests={character.quests} onChange={handleQuestChange} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <CalculatedStatsDisplay stats={stats} />
                    </Col>
                </Row>
            </Col>
            <Col>
                <CharacterInventory character={character} inventory={inventory} />
            </Col>
        </Row>
    );
}