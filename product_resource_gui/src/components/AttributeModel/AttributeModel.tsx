interface Rule {
    required: boolean;
    min?: any;
    max?: any;
}

interface ItenModel {
    id: string;
    label: string;
    value: string;
    valid: boolean;
    message: string;
    touched: boolean;
    rules: Rule;
}

export default ItenModel;

export interface ItenModelBoolean {
    id: string;
    label: string;
    value: boolean;
}