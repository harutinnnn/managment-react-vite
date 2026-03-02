// components/AddColumn.tsx
import React, {useState} from 'react';
import './Modal.css';

interface AddColumnProps {
    onClose: () => void;
    onAdd: (title: string) => void;
    projectId: number;
}

export const AddColumn: React.FC<AddColumnProps> = ({onClose, onAdd}) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onAdd(title);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content small" onClick={e => e.stopPropagation()}>
                <h2>Add New Column</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Column Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g., In Progress"
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" className="submit-btn">
                            Add Column
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};