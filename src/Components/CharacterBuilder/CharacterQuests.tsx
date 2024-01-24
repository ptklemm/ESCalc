import Check from 'react-bootstrap/FormCheck';
import { Difficulty, Quest, QuestCompletionMatrix, QuestStatusChange } from '../../types/Character';

interface CharacterQuestsProps {
    quests: QuestCompletionMatrix;
    onChange: (status: QuestStatusChange) => void;
}

export default function CharacterQuests({ quests, onChange }: CharacterQuestsProps) {
    return (
        <fieldset id="CharacterQuests">
        <legend>Quests</legend>
            <table style={{ width: '100%' }}>
                <thead style={{ textAlign: 'center' }}>
                    <tr>
                        <td></td>
                        {Object.values(Difficulty).map(difficulty => <td key={difficulty}>{difficulty}</td>)}
                    </tr>
                </thead>
                <tbody>
                    {Object.values(Quest).map(quest =>
                        <tr key={quest}>
                            <td style={{ textAlign: 'left' }}>{quest}</td>
                            {Object.values(Difficulty).map(difficulty => 
                                <td key={`${difficulty}-${quest}`} style={{ textAlign: 'center' }}>
                                    <Check checked={quests[difficulty][quest]} onChange={e => {onChange({difficulty, quest, isCompleted: e.target.checked})}} />
                                </td>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
        </fieldset>
    );
}