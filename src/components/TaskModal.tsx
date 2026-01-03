import React, { useState } from 'react';
import { useBoardStore } from '@/store/useBoardStore';
import { InlineEdit } from './InlineEdit';

export const TaskModal: React.FC = () => {
    const activeTaskId = useBoardStore((state) => state.activeTaskId);
    const board = useBoardStore((state) => state.board);
    const setActiveTask = useBoardStore((state) => state.setActiveTask);
    const addComment = useBoardStore((state) => state.addComment);
    const updateTaskTitle = useBoardStore((state) => state.updateTaskTitle);

    const [newComment, setNewComment] = useState('');

    if (!activeTaskId) return null;

    const task = board.tasks[activeTaskId];
    if (!task) return null;

    const column = Object.values(board.columns).find(col => col.taskIds.includes(task.id));

    const handleClose = () => setActiveTask(null);

    const handleAddComment = () => {
        if (newComment.trim()) {
            addComment(task.id, newComment);
            setNewComment('');
        }
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleClose}>&times;</button>

                <div className="modal-header">
                    in list <strong>{column?.title}</strong>
                </div>

                <h2>
                    <InlineEdit
                        text={task.content}
                        onSave={(val) => updateTaskTitle(task.id, val)}
                        isTextArea
                        autoSave={true}
                        className="modal-title-edit"
                    />
                </h2>

                <div className="comment-section">
                    <h3>Activity</h3>

                    <div style={{ marginBottom: 20 }} className="comments-input">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                        />
                        <button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            style={{
                                backgroundColor: newComment.trim() ? '#0079bf' : '#ccc',
                                cursor: newComment.trim() ? 'pointer' : 'default'
                            }}
                        >
                            Save
                        </button>
                    </div>

                    <div className="comments-list">
                        {task.comments.length === 0 && (
                            <div style={{ color: '#aaa' }}>No comments yet.</div>
                        )}

                        {task.comments.map((comment) => (
                            <div key={comment.id} className="comment-item">
                                <div className="comment-date">
                                    {"You"}, {new Date(comment.createdAt).toLocaleString()}
                                </div>
                                <div className="comment-text">{comment.text}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};