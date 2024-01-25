import { PropsWithChildren } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { CalculatedStats } from './calculateStats.ts';

interface StatDisplayProps extends PropsWithChildren {label: string;}

const StatDisplay = ({ label, children }: StatDisplayProps) => <tr><td>{label}</td><td>{children}</td></tr>

interface CalculatedStatsDisplayProps {
    stats: CalculatedStats;
}

export default function CalculatedStatsDisplay({ stats }: CalculatedStatsDisplayProps) {
    return (
        <fieldset id="CalculatedStats" style={{ marginBottom: 10, height: '100%' }}>
        <legend>Stats</legend>
            <table style={{ width: '100%' }}>
                <tbody>
                    <tr>
                        <td colSpan={2}><ProgressBar variant="danger" label={`Life: ${stats.life}`} min={0} now={stats.life} max={stats.life} /></td>
                        <td colSpan={2}><ProgressBar variant="primary" label={`Mana: ${stats.mana}`} min={0} now={stats.mana} max={stats.mana} /></td>
                    </tr>
                    <tr>
                        <td colSpan={4}><ProgressBar variant="warning" label={`Stamina: ${stats.stamina}`} min={0} now={stats.stamina} max={stats.stamina} /></td>
                    </tr>
                    <StatDisplay label="Attack Damage:">{stats.attackDamageMin}-{stats.attackDamageMax}</StatDisplay>
                    <StatDisplay label="Attack Rating:">{stats.attackRating}</StatDisplay>
                    <StatDisplay label="Chance to Hit:">{stats.chanceToHit}%</StatDisplay>
                    <StatDisplay label="Defense:">{stats.defense}</StatDisplay>
                    <StatDisplay label="Chance to be Hit:">{stats.chanceToBeHit}</StatDisplay>
                    <StatDisplay label="Chance to Block:">{stats.chanceToBlock}</StatDisplay>
                    <StatDisplay label="Fire Resistance:">{stats.resistanceFire}</StatDisplay>
                    <StatDisplay label="Cold Resistance:">{stats.resistanceCold}</StatDisplay>
                    <StatDisplay label="Lightning Resistance:">{stats.resistanceLightning}</StatDisplay>
                    <StatDisplay label="Poison Resistance:">{stats.resistancePoison}</StatDisplay>
                </tbody>
            </table>
        </fieldset>
    )
}