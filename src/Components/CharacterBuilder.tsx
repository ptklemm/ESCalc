import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { HorizontalInput, HorizontalSelect, StatDisplay } from './FormComponents';
import { Character, CharacterClass, CLASSES, DIFFICULTIES, Difficulty } from '../types/Character';
import { CharacterStats } from '../types/CharacterStats';

export default function CharacterBuilder() {
    const [character, setCharacter] = useState(new Character());

    function handleClassSelect(event: React.ChangeEvent<HTMLSelectElement>) {
        const value = event.target.value;

        if (!value || value == character.Class)
            return;

        switch (value) {
            case CharacterClass.Amazon:
                setCharacter(new Character(CharacterClass.Amazon));
                break;
            case CharacterClass.Assassin:
                setCharacter(new Character(CharacterClass.Assassin));
                break;
            case CharacterClass.Barbarian:
                setCharacter(new Character(CharacterClass.Barbarian));
                break;
            case CharacterClass.Druid:
                setCharacter(new Character(CharacterClass.Druid));
                break;
            case CharacterClass.Necromancer:
                setCharacter(new Character(CharacterClass.Necromancer));
                break;
            case CharacterClass.Paladin:
                setCharacter(new Character(CharacterClass.Paladin));
                break;
            case CharacterClass.Sorceress:
                setCharacter(new Character(CharacterClass.Sorceress));
                break;
            default:
                setCharacter(new Character());
        }
    }

    function handleLevelChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.valueAsNumber;

        if (!value || value == character.Level)
            return;

        setCharacter({ ...character, Level: value});
    }

    function handleDifficultyChange(event: React.ChangeEvent<HTMLSelectElement>) {
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
            default:
                setCharacter({ ...character, Difficulty: Difficulty.Normal});
        }
    }

    function handleAttributeChange(event: React.ChangeEvent<HTMLInputElement>) {
        const attribute = event.target.id;
        const value = event.target.valueAsNumber;

        if (!value || value == character[attribute as keyof Character])
            return;

        switch (attribute) {
            case "Strength":
                setCharacter({ ...character, Strength: value });
                break;
            case "Dexterity":
                setCharacter({ ...character, Dexterity: value });
                break;
            case "Vitality":
                setCharacter({ ...character, Vitality: value });
                break;
            case "Energy":
                setCharacter({ ...character, Energy: value });
                break;
        }
    }

    // Calculate new modified stats before render
    const stats = new CharacterStats(character);
    console.log(stats);

    return (
        <Row id="CharacterBuilder">
            <Col md={2}>
                <Form id="Character">
                    <HorizontalSelect id="Class" label="Class" options={CLASSES} value={character.Class} onChange={handleClassSelect} />
                    <HorizontalInput id="Level" label="Level" type="number" min={1} max={99} value={character.Level} onChange={handleLevelChange} />
                    <HorizontalSelect id="Difficulty" label="Difficulty" options={DIFFICULTIES} value={character.Difficulty} onChange={handleDifficultyChange} />
                    <HorizontalInput id="Strength" label="Strength" type="number" min={character.BaseStrength} value={character.Strength} onChange={handleAttributeChange} />
                    <HorizontalInput id="Dexterity" label="Dexterity" type="number" min={character.BaseDexterity} value={character.Dexterity} onChange={handleAttributeChange} />
                    <HorizontalInput id="Vitality" label="Vitality" type="number" min={character.BaseVitality} value={character.Vitality} onChange={handleAttributeChange} />
                    <HorizontalInput id="Energy" label="Energy" type="number" min={character.BaseEnergy} value={character.Energy} onChange={handleAttributeChange} />
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