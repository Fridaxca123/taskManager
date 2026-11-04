import { useState } from 'react';
import { Button } from './Button';

export interface FormField {
  name: string;
  label: string;
  type?: 'text' | 'date' | 'textarea' | 'email' | 'password' | 'select';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface CreateModalProps {
  title: string;
  fields: FormField[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
}

export function CreateModal({
  title,
  fields,
  isOpen,
  onClose,
  onSubmit,
}: CreateModalProps) {
  const initialValues = Object.fromEntries(fields.map((f) => [f.name, '']));
  const [values, setValues] = useState<Record<string, string>>(initialValues);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
    setValues(initialValues);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal--open" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span
          className="close"
          onClick={onClose}
          role="button"
          aria-label="Close"
        >
          &times;
        </span>
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => {
            if (field.type === 'textarea') {
              return (
                <textarea
                  key={field.name}
                  placeholder={field.placeholder || field.label}
                  value={values[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                  rows={4}
                />
              );
            }

            if (field.type === 'select') {
              return (
                <select
                  key={field.name}
                  value={values[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                >
                  <option value="">-- Select {field.label} --</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              );
            }

            return (
              <input
                key={field.name}
                type={field.type || 'text'}
                placeholder={field.placeholder || field.label}
                value={values[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
                autoComplete={
                  field.type === 'password'
                    ? 'new-password'
                    : field.type === 'email'
                      ? 'off'
                      : undefined
                }
              />
            );
          })}
          <Button text="Create" type="submit" size="medium" />
        </form>
      </div>
    </div>
  );
}
