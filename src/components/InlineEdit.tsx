import React, { useState, useRef, useEffect } from 'react';

interface InlineEditProps {
    text: string;
    onSave: (text: string) => void;
    isTextArea?: boolean;
    placeholder?: string;
    buttonText?: string;
    editing?: boolean;
    setEditing?: (editing: boolean) => void;
    className?: string;
    autoSave?: boolean;
}

export const InlineEdit: React.FC<InlineEditProps> = ({
    text,
    onSave,
    isTextArea = false,
    placeholder = 'Enter text...',
    buttonText = 'Save',
    editing: externalEditing,
    setEditing: setExternalEditing,
    className,
    autoSave = false
}) => {
    const [internalEditing, setInternalEditing] = useState(false);
    const [inputValue, setInputValue] = useState(text);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const isEditing = externalEditing !== undefined ? externalEditing : internalEditing;
    const setIsEditing = setExternalEditing || setInternalEditing;

    useEffect(() => {
        setInputValue(text);
    }, [text]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (inputValue.trim()) {
            onSave(inputValue);
        } else {
            setInputValue(text);
        }
        setIsEditing(false);
    };

    const handleBlur = () => {
        if (autoSave) {
            handleSubmit();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
            if(autoSave) {
                (e.target as HTMLElement).blur();
            }
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
            setInputValue(text);
            if(autoSave && inputRef.current) inputRef.current.blur();
        }
    };

    if (isEditing) {
        return (
            <form onSubmit={handleSubmit} className={className} style={{ width: '100%' }}>
                {isTextArea ? (
                    <textarea
                        className="inline-textarea"
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                    />
                ) : (
                    <input
                        className="inline-input"
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                    />
                )}

                {!autoSave && (
                    <div
                        className="inline-buttons"
                    >
                        <button
                            type="submit"
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            {buttonText}
                        </button>
                        <span
                            onClick={() => {
                                setIsEditing(false);
                                setInputValue(text);
                            }}
                        >
                    &times;
                </span>
                    </div>
                )}
            </form>
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className={`${className} inline-text`}
        >
            {text || placeholder}
        </div>
    );
};