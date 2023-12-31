import { PropsWithChildren } from 'react'
import { Form, FormControlProps, FormSelectProps } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { CharacterClass, Difficulty } from '../types/Character';

interface HorizontalInputProps extends FormControlProps {
    label: string;
    min?: number;
    max?: number;
}

export function HorizontalInput(props: HorizontalInputProps) {
    return (
        <Form.Group as={Row} className={props.className}>
            <Form.Label column="sm" md={6}>{props.label}</Form.Label>
            <Col md={6}>
                <Form.Control size="sm" {...props} />
            </Col>
        </Form.Group>
    );
}

interface HorizontalSelectProps extends FormSelectProps {
    label: string;
    options: CharacterClass[] | Difficulty[];
}

export function HorizontalSelect(props: HorizontalSelectProps) {
    return (
        <Form.Group as={Row} className={props.className}>
            <Form.Label column="sm" md={6}>{props.label}</Form.Label>
            <Col md={6}>
                <Form.Select size="sm" {...props}>{props.options.map((option: string) => <option key={option} value={option}>{option}</option>)}</Form.Select>
            </Col>
        </Form.Group>
    );
}

export function StatDisplay(props: PropsWithChildren) {
    return <Row><Col><small>{props.children}</small></Col></Row>
}