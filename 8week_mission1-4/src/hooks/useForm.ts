import { useState, useEffect } from 'react';

interface UseFormProps<T> {
    initialValues: T;
    validate: (values: T) => Record<keyof T, string>;
}

function useForm<T extends Record<string, any>>({ initialValues, validate }: UseFormProps<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as any);
    const [errors, setErrors] = useState<Record<keyof T, string>>({} as any);

    const handleChange = (name: keyof T, value: string) => {
        setValues({
            ...values,
            [name]: value,
        });
    };

    const handleBlur = (name: keyof T) => {
        setTouched({
            ...touched,
            [name]: true,
        });
    };

    const getInputProps = (name: keyof T) => {
        const value = values[name];
        const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            handleChange(name, e.target.value);
        const onBlur = () => handleBlur(name);

        return { value, onChange, onBlur };
    };

    useEffect(() => {
        const newErrors = validate(values);
        setErrors(newErrors);
    }, [values, validate]);

    return { values, errors, touched, getInputProps };
}

export default useForm;