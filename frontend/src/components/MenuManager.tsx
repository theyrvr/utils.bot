'use client';

import { useState, useEffect } from 'react';
import { menusAPI } from '@/lib/api';
import { Menu, MenuButton } from '@/types';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

interface MenuManagerProps {
  guildId: string;
}

export default function MenuManager({ guildId }: MenuManagerProps) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMenu, setEditingMenu] = useState<Partial<Menu> | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadMenus();
  }, [guildId]);

  const loadMenus = async () => {
    try {
      const response = await menusAPI.getAll(guildId);
      setMenus(response.data);
    } catch (error) {
      console.error('Failed to load menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMenu = () => {
    setEditingMenu({
      name: '',
      description: '',
      enabled: true,
      buttons: [],
    });
  };

  const handleSaveMenu = async () => {
    if (!editingMenu) return;

    try {
      if (editingMenu.id) {
        await menusAPI.update(guildId, editingMenu.id, editingMenu);
      } else {
        await menusAPI.create(guildId, editingMenu);
      }
      setMessage('Menu saved successfully!');
      setEditingMenu(null);
      await loadMenus();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save menu:', error);
      setMessage('Failed to save menu');
    }
  };

  const handleDeleteMenu = async (menuId: string) => {
    if (!confirm('Are you sure you want to delete this menu?')) return;

    try {
      await menusAPI.delete(guildId, menuId);
      setMessage('Menu deleted successfully!');
      await loadMenus();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to delete menu:', error);
      setMessage('Failed to delete menu');
    }
  };

  const addButton = () => {
    if (!editingMenu) return;
    setEditingMenu({
      ...editingMenu,
      buttons: [
        ...(editingMenu.buttons || []),
        {
          label: 'New Button',
          style: 'Primary',
          order: (editingMenu.buttons?.length || 0),
        } as MenuButton,
      ],
    });
  };

  const removeButton = (index: number) => {
    if (!editingMenu || !editingMenu.buttons) return;
    const newButtons = [...editingMenu.buttons];
    newButtons.splice(index, 1);
    setEditingMenu({ ...editingMenu, buttons: newButtons });
  };

  const updateButton = (index: number, field: keyof MenuButton, value: any) => {
    if (!editingMenu || !editingMenu.buttons) return;
    const newButtons = [...editingMenu.buttons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    setEditingMenu({ ...editingMenu, buttons: newButtons });
  };

  if (loading) {
    return <div className="loading">Loading menus...</div>;
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="card-header" style={{ margin: 0 }}>Menu Manager</h2>
        <button className="button button-primary" onClick={handleCreateMenu}>
          <FaPlus /> Create Menu
        </button>
      </div>

      {message && (
        <div className={message.includes('success') ? 'success' : 'error'}>
          {message}
        </div>
      )}

      {editingMenu && (
        <div className="card" style={{ backgroundColor: 'var(--background-tertiary)', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>
            {editingMenu.id ? 'Edit Menu' : 'Create Menu'}
          </h3>

          <div className="form-group">
            <label className="label">Menu Name</label>
            <input
              type="text"
              className="input"
              value={editingMenu.name || ''}
              onChange={(e) => setEditingMenu({ ...editingMenu, name: e.target.value })}
              placeholder="Enter menu name"
            />
          </div>

          <div className="form-group">
            <label className="label">Description</label>
            <textarea
              className="textarea"
              value={editingMenu.description || ''}
              onChange={(e) => setEditingMenu({ ...editingMenu, description: e.target.value })}
              placeholder="Enter menu description"
            />
          </div>

          <div className="form-group">
            <label className="label">
              <input
                type="checkbox"
                checked={editingMenu.enabled ?? true}
                onChange={(e) => setEditingMenu({ ...editingMenu, enabled: e.target.checked })}
                style={{ marginRight: '8px' }}
              />
              Enabled
            </label>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label className="label" style={{ margin: 0 }}>Buttons</label>
              <button type="button" className="button button-secondary" onClick={addButton}>
                <FaPlus /> Add Button
              </button>
            </div>

            {editingMenu.buttons?.map((button, index) => (
              <div key={index} className="card" style={{ marginBottom: '10px', padding: '15px' }}>
                <div className="grid grid-2" style={{ gap: '10px' }}>
                  <input
                    type="text"
                    className="input"
                    value={button.label}
                    onChange={(e) => updateButton(index, 'label', e.target.value)}
                    placeholder="Button label"
                  />
                  <input
                    type="text"
                    className="input"
                    value={button.emoji || ''}
                    onChange={(e) => updateButton(index, 'emoji', e.target.value)}
                    placeholder="Emoji (optional)"
                  />
                  <select
                    className="select"
                    value={button.style}
                    onChange={(e) => updateButton(index, 'style', e.target.value)}
                  >
                    <option value="Primary">Primary</option>
                    <option value="Secondary">Secondary</option>
                    <option value="Success">Success</option>
                    <option value="Danger">Danger</option>
                  </select>
                  <input
                    type="text"
                    className="input"
                    value={button.categoryId || ''}
                    onChange={(e) => updateButton(index, 'categoryId', e.target.value)}
                    placeholder="Category ID (optional)"
                  />
                </div>
                <button
                  type="button"
                  className="button button-danger"
                  onClick={() => removeButton(index)}
                  style={{ marginTop: '10px' }}
                >
                  <FaTrash /> Remove
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="button button-primary" onClick={handleSaveMenu}>
              Save Menu
            </button>
            <button className="button button-secondary" onClick={() => setEditingMenu(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-2">
        {menus.map((menu) => (
          <div key={menu.id} className="card" style={{ backgroundColor: 'var(--background-tertiary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
              <div>
                <h3 style={{ marginBottom: '5px' }}>{menu.name}</h3>
                <span className={`badge ${menu.enabled ? 'badge-success' : 'badge-danger'}`}>
                  {menu.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="button button-secondary"
                  onClick={() => setEditingMenu(menu)}
                  style={{ padding: '8px' }}
                >
                  <FaEdit />
                </button>
                <button
                  className="button button-danger"
                  onClick={() => handleDeleteMenu(menu.id)}
                  style={{ padding: '8px' }}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            {menu.description && (
              <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>
                {menu.description}
              </p>
            )}
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {menu.buttons.length} button(s)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
