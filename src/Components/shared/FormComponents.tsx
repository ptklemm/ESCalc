import { PropsWithChildren } from 'react';
import { Form, FormControlProps, FormSelectProps } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface HorizontalInputProps extends FormControlProps {
    label: string;
}

export const HorizontalInput = ({ label, ...props}: HorizontalInputProps) => (
        <Form.Group style={{ marginBottom: 5 }} as={Row} className={props.className}>
            <Form.Label column="sm" md={5}>{label}</Form.Label>
            <Col md={6}>
                <Form.Control size="sm" {...props} />
            </Col>
            <Col />
        </Form.Group>
);

interface AttributeInputGroupProps extends HorizontalInputProps {
    displayValue: string | number;
}

export const AttributeInputGroup = ({ label, displayValue, ...props}: AttributeInputGroupProps) => {
    return (
        <Form.Group style={{ marginBottom: 5 }} as={Row}>
            <Form.Label column="sm" md={5}>{label}</Form.Label>
            <Col md={3}><Form.Control size="sm" type="number" {...props} /></Col>
            <Col md={3}><Form.Control size="sm" plaintext readOnly value={displayValue} onChange={()=>{}}/></Col>
            <Col />
        </Form.Group>
    );
}


interface SelectElementOption {
    [index: string]: string | number;

    label: string | number;
    value: string | number;
}

interface HorizontalSelectProps extends FormSelectProps {
    label: string;
    options: SelectElementOption[];
}

export const HorizontalSelect = ({ label, options, ...props}: HorizontalSelectProps) => (
    <Form.Group style={{ marginBottom: 5 }} as={Row} className={props.className}>
        <Form.Label column="sm" md={5}>{label}</Form.Label>
        <Col md={6}>
            <Form.Select size="sm" {...props}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</Form.Select>
        </Col>
        <Col />
    </Form.Group>
);

export function StatDisplay(props: PropsWithChildren) {
    return <p>{props.children}</p>
}