import React, { useState, useEffect, useRef } from 'react';
import { useBoardStore } from '@/store/useBoardStore';

interface ListMenuProps {
    listId: string;
}

type MenuView = 'MAIN' | 'CONFIRM_DELETE_LIST' | 'CONFIRM_DELETE_CARDS';

export const ListMenu: React.FC<ListMenuProps> = ({ listId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<MenuView>('MAIN');
    const menuRef = useRef<HTMLDivElement>(null);

    const deleteList = useBoardStore((state) => state.deleteList);
    const clearList = useBoardStore((state) => state.clearList);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) setView('MAIN');
    }, [isOpen]);

    const handleDeleteList = () => {
        deleteList(listId);
    };

    const handleClearList = () => {
        clearList(listId);
        setIsOpen(false);
    };

    return (
        <div className="list-menu-container" ref={menuRef}>
            <button className="list-menu-button" onClick={() => setIsOpen(!isOpen)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                </svg>
            </button>

            {isOpen && (
                <div className="popover">

                    <div className="popover-header">
                        <div className="popover-header-btn">
                            {view !== 'MAIN' && (
                                <span onClick={() => setView('MAIN')} style={{ cursor: 'pointer' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </span>
                            )}
                        </div>

                        <div className="popover-header-title">
                            {view === 'MAIN' ? 'List Actions' :
                                view === 'CONFIRM_DELETE_LIST' ? 'Delete List' : 'Delete All Cards'}
                        </div>

                        <button className="popover-header-btn" onClick={() => setIsOpen(false)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    <div className="popover-content">

                        {view === 'MAIN' && (
                            <>
                                <button
                                    className="menu-item"
                                    onClick={() => setView('CONFIRM_DELETE_CARDS')}
                                >
                                    Delete All Cards…
                                </button>
                                <button
                                    className="menu-item"
                                    onClick={() => setView('CONFIRM_DELETE_LIST')}
                                >
                                    Delete List…
                                </button>
                            </>
                        )}

                        {view === 'CONFIRM_DELETE_LIST' && (
                            <div>
                                <p className="confirm-text">
                                    All actions will be removed from the activity feed and you won’t be able to re-open the list. There is no undo.
                                </p>
                                <button className="btn-danger" onClick={handleDeleteList}>
                                    Delete list
                                </button>
                            </div>
                        )}

                        {view === 'CONFIRM_DELETE_CARDS' && (
                            <div>
                                <p className="confirm-text">
                                    This will remove all the cards in this list from the board.
                                </p>
                                <button className="btn-danger" onClick={handleClearList}>
                                    Delete all
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};