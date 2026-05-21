import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import {
  statusService,
  issueTypeService,
  priorityService,
  severityService,
  tagService,
  deadlineShortcutService
} from '../services/issueService';

// mapa de cada secció: clau, label, servei i camps del formulari
const SECTIONS = [
  {
    key: 'statuses',
    label: 'Estats',
    service: statusService,
    fields: [
      { name: 'name',     label: 'Nom',   type: 'text',     required: true },
      { name: 'color',    label: 'Color', type: 'color',    required: false },
      { name: 'is_closed', label: 'Tancat', type: 'checkbox', required: false }
    ]
  },
  {
    key: 'priorities',
    label: 'Prioritats',
    service: priorityService,
    fields: [
      { name: 'name',  label: 'Nom',   type: 'text',  required: true },
      { name: 'color', label: 'Color', type: 'color', required: false }
    ]
  },
  {
    key: 'issueTypes',
    label: 'Tipus',
    service: issueTypeService,
    fields: [
      { name: 'name',  label: 'Nom',   type: 'text',  required: true },
      { name: 'color', label: 'Color', type: 'color', required: false }
    ]
  },
  {
    key: 'severities',
    label: 'Severitats',
    service: severityService,
    fields: [
      { name: 'name',  label: 'Nom',   type: 'text',  required: true },
      { name: 'color', label: 'Color', type: 'color', required: false }
    ]
  },
  {
    key: 'tags',
    label: 'Etiquetes',
    service: tagService,
    fields: [
      { name: 'name',  label: 'Nom',   type: 'text',  required: true },
      { name: 'color', label: 'Color', type: 'color', required: false }
    ]
  },
  {
    key: 'deadlineShortcuts',
    label: 'Dreceres de Deadline',
    service: deadlineShortcutService,
    fields: [
      { name: 'name', label: 'Nom',      type: 'text',   required: true },
      { name: 'days', label: 'Dies',     type: 'number', required: true }
    ]
  }
];

// construeix l'estat inicial del formulari per a una secció
const buildInitialForm = (fields, item = null) =>
  fields.reduce((acc, f) => {
    if (f.type === 'checkbox') {
      acc[f.name] = item ? !!item[f.name] : false;
    } else if (f.type === 'color') {
      acc[f.name] = item?.[f.name] || '#4c8bf5';
    } else {
      acc[f.name] = item?.[f.name] ?? '';
    }
    return acc;
  }, {});

// component de formulari inline per crear o editar un element
function ItemForm({ fields, initial, loading, onSave, onCancel }) {
  const [form, setForm] = useState(initial);

  const handleChange = (name, value) =>
    setForm(prev => ({ ...prev, [name]: value }));

  const handleSubmit = () => {
    const missing = fields.find(f => f.required && !String(form[f.name] ?? '').trim());
    if (missing) return;
    onSave(form);
  };

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: '10px',
      alignItems: 'flex-end', background: '#f0f4ff',
      border: '1px solid #d0d9f5', borderRadius: '6px',
      padding: '14px', marginBottom: '10px'
    }}>
      {fields.map(f => (
        <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#888', fontWeight: '600' }}>
            {f.label}{f.required ? ' *' : ''}
          </label>
          {f.type === 'checkbox' ? (
            <input
              type="checkbox"
              checked={!!form[f.name]}
              onChange={e => handleChange(f.name, e.target.checked)}
              style={{ width: '18px', height: '18px', marginTop: '4px' }}
            />
          ) : (
            <input
              type={f.type}
              value={form[f.name] ?? ''}
              onChange={e => handleChange(f.name, e.target.value)}
              style={{
                padding: f.type === 'color' ? '3px 6px' : '8px 10px',
                border: '1px solid #d0d9f5', borderRadius: '4px',
                fontSize: '14px', width: f.type === 'color' ? '50px' : f.type === 'number' ? '80px' : '180px',
                height: f.type === 'color' ? '34px' : 'auto'
              }}
            />
          )}
        </div>
      ))}
      <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
        <button
          onClick={onCancel}
          style={{
            background: 'transparent', border: '1px solid #bbb', color: '#555',
            borderRadius: '5px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px'
          }}
        >
          Cancel·lar
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: 'var(--primary, #0052cc)', color: '#fff', border: 'none',
            borderRadius: '5px', padding: '8px 16px', cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '13px', opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Guardant...' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}

// component per a una sola secció de configuració (un recurs)
function SettingsSection({ section, items, refresh, apiKey, onShowNotification }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId]           = useState(null);
  const [loading, setLoading]               = useState(false);

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      await section.service.create(apiKey, formData);
      await refresh();
      setShowCreateForm(false);
      onShowNotification(`${section.label}: element creat correctament.`, 'success');
    } catch (err) {
      console.error(err);
      onShowNotification(`Error creant l'element a ${section.label}.`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      setLoading(true);
      await section.service.update(apiKey, id, formData);
      await refresh();
      setEditingId(null);
      onShowNotification(`${section.label}: element actualitzat.`, 'success');
    } catch (err) {
      console.error(err);
      onShowNotification(`Error actualitzant l'element a ${section.label}.`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Segur que vols eliminar "${name}"?`)) return;
    try {
      setLoading(true);
      await section.service.delete(apiKey, id);
      await refresh();
      onShowNotification(`${section.label}: element eliminat.`, 'success');
    } catch (err) {
      console.error(err);
      onShowNotification(`Error eliminant l'element a ${section.label}.`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#fff', border: '1px solid #eee',
      borderRadius: '6px', padding: '20px', marginBottom: '20px'
    }}>
      {/* capçalera de secció */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', textTransform: 'uppercase', color: 'var(--primary, #0052cc)', letterSpacing: '0.05em' }}>
          {section.label}
          <span style={{ marginLeft: '8px', fontWeight: '400', color: '#aaa', fontSize: '12px' }}>
            ({items.length})
          </span>
        </h3>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              background: 'var(--primary, #0052cc)', color: '#fff', border: 'none',
              borderRadius: '5px', padding: '7px 14px', cursor: 'pointer', fontSize: '13px'
            }}
          >
            + Afegir
          </button>
        )}
      </div>

      {/* formulari de creació */}
      {showCreateForm && (
        <ItemForm
          fields={section.fields}
          initial={buildInitialForm(section.fields)}
          loading={loading}
          onSave={handleCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* llista d'elements */}
      {items.length === 0 ? (
        <p style={{ fontSize: '14px', color: '#aaa', margin: 0 }}>Sense elements.</p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {items.map(item => (
            <li key={item.id}>
              {editingId === item.id ? (
                <ItemForm
                  fields={section.fields}
                  initial={buildInitialForm(section.fields, item)}
                  loading={loading}
                  onSave={(data) => handleUpdate(item.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', background: '#f8f9fa',
                  border: '1px solid #eee', borderRadius: '5px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* pastilla de color si el recurs en té */}
                    {item.color && (
                      <span style={{
                        display: 'inline-block', width: '14px', height: '14px',
                        borderRadius: '3px', background: item.color,
                        border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0
                      }} />
                    )}
                    <span style={{ fontSize: '14px', color: '#2f4359', fontWeight: '500' }}>
                      {item.name}
                    </span>
                    {/* camps addicionals com dies o is_closed */}
                    {item.days != null && (
                      <span style={{ fontSize: '12px', color: '#888' }}>{item.days} dies</span>
                    )}
                    {item.is_closed && (
                      <span style={{
                        fontSize: '11px', background: '#fce4e4', color: '#c0392b',
                        borderRadius: '10px', padding: '2px 8px'
                      }}>
                        Tancat
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setEditingId(item.id)}
                      style={{
                        background: 'transparent', border: '1px solid #4c8bf5',
                        color: '#4c8bf5', borderRadius: '5px', padding: '5px 10px',
                        cursor: 'pointer', fontSize: '12px'
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      disabled={loading}
                      style={{
                        background: 'transparent', border: '1px solid #e34935',
                        color: '#e34935', borderRadius: '5px', padding: '5px 10px',
                        cursor: loading ? 'not-allowed' : 'pointer', fontSize: '12px'
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// component principal del panell de configuració
export default function SettingsPanel({ onBack, onShowNotification }) {
  const {
    currentUser,
    statuses,          refreshStatuses,
    issueTypes,        refreshIssueTypes,
    priorities,        refreshPriorities,
    severities,        refreshSeverities,
    tags,              refreshTags,
    deadlineShortcuts, refreshDeadlineShortcuts
  } = useContext(UserContext);

  // mapa de dades per secció, associat per key
  const dataMap = {
    statuses:          { items: statuses,          refresh: refreshStatuses },
    priorities:        { items: priorities,        refresh: refreshPriorities },
    issueTypes:        { items: issueTypes,         refresh: refreshIssueTypes },
    severities:        { items: severities,        refresh: refreshSeverities },
    tags:              { items: tags,              refresh: refreshTags },
    deadlineShortcuts: { items: deadlineShortcuts, refresh: refreshDeadlineShortcuts }
  };

  return (
    <div className="panel" style={{ maxWidth: '860px', margin: '0 auto', padding: '30px' }}>
      {/* capçalera */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '20px'
      }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', color: '#2f4359' }}>
            Configuració
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>
            Gestiona les llistes d'atributs de les incidències
          </p>
        </div>
        <button onClick={onBack} className="btn btn-secondary">
          Tornar
        </button>
      </div>

      {/* seccions */}
      {SECTIONS.map(section => {
        const { items, refresh } = dataMap[section.key] ?? { items: [], refresh: () => {} };
        return (
          <SettingsSection
            key={section.key}
            section={section}
            items={items}
            refresh={refresh}
            apiKey={currentUser.apiKey}
            onShowNotification={onShowNotification}
          />
        );
      })}
    </div>
  );
}
