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

const SECTIONS = [
  { key: 'statuses', label: 'ESTATS', service: statusService, fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'color', label: 'Color', type: 'color', required: false },
    { name: 'is_closed', label: 'Tancat', type: 'checkbox', required: false }
  ]},
  { key: 'priorities', label: 'PRIORITATS', service: priorityService, fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'color', label: 'Color', type: 'color', required: false }
  ]},
  { key: 'issueTypes', label: 'TIPUS', service: issueTypeService, fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'color', label: 'Color', type: 'color', required: false }
  ]},
  { key: 'severities', label: 'SEVERITATS', service: severityService, fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'color', label: 'Color', type: 'color', required: false }
  ]},
  { key: 'tags', label: 'ETIQUETES', service: tagService, fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'color', label: 'Color', type: 'color', required: false }
  ]},
  { key: 'deadlineShortcuts', label: 'DRECERES DEADLINE', service: deadlineShortcutService, fields: [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'offset_days', label: 'Dies', type: 'number', required: true }
  ]}
];

const buildInitialForm = (fields, item = null) =>
  fields.reduce((acc, f) => {
    if (f.type === 'checkbox') acc[f.name] = item ? !!item[f.name] : false;
    else if (f.type === 'color') acc[f.name] = item?.[f.name] || '#4c8bf5';
    else acc[f.name] = item?.[f.name] ?? '';
    return acc;
  }, {});

function ItemForm({ fields, initial, loading, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const handleChange = (name, value) => setForm(prev => ({ ...prev, [name]: value }));

  const handleSubmit = () => {
    const missing = fields.find(f => f.required && !String(form[f.name] ?? '').trim());
    if (missing) return;
    const payload = { ...form };
    fields.forEach(f => { if (f.type === 'number' && payload[f.name] !== undefined) payload[f.name] = parseInt(payload[f.name], 10) || 0; });
    onSave(payload);
  };

  return (
    <div className="flex flex-wrap gap-4 items-end bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
      {fields.map(f => (
        <div key={f.name} className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{f.label}</label>
          {f.type === 'checkbox' ? (
            <input type="checkbox" checked={!!form[f.name]} onChange={e => handleChange(f.name, e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
          ) : (
            <input 
              type={f.type} value={form[f.name] ?? ''} onChange={e => handleChange(f.name, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              style={{ width: f.type === 'color' ? '50px' : f.type === 'number' ? '80px' : '160px' }}
            />
          )}
        </div>
      ))}
      <div className="flex gap-2 ml-auto">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel·lar</button>
        <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 shadow-sm">
          {loading ? 'Guardant...' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}

function SettingsSection({ section, items, refresh, apiKey, onShowNotification }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData) => {
    setLoading(true);
    try { await section.service.create(apiKey, formData); await refresh(); setShowCreateForm(false); onShowNotification('Creat correctament', 'success'); }
    catch { onShowNotification('Error en crear', 'error'); }
    finally { setLoading(false); }
  };

  const handleUpdate = async (id, formData) => {
    setLoading(true);
    try { await section.service.update(apiKey, id, formData); await refresh(); setEditingId(null); onShowNotification('Actualitzat', 'success'); }
    catch { onShowNotification('Error en actualitzar', 'error'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Segur que vols eliminar "${name}"?`)) return;
    setLoading(true);
    try { await section.service.delete(apiKey, id); await refresh(); onShowNotification('Eliminat', 'success'); }
    catch { onShowNotification('Error en eliminar', 'error'); }
    finally { setLoading(false); }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 tracking-wide">
          {section.label} <span className="text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full text-xs font-medium">{items.length}</span>
        </h3>
        {!showCreateForm && (
          <button onClick={() => setShowCreateForm(true)} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-emerald-600 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[16px]">add</span> Afegir
          </button>
        )}
      </div>
      
      {showCreateForm && (
        <div className="px-6 py-4">
          <ItemForm fields={section.fields} initial={buildInitialForm(section.fields)} loading={loading} onSave={handleCreate} onCancel={() => setShowCreateForm(false)} />
        </div>
      )}

      <ul className="divide-y divide-gray-100">
        {items.map(item => (
          <li key={item.id} className="px-6 py-4 hover:bg-gray-50 transition-colors group">
            {editingId === item.id ? (
              <ItemForm fields={section.fields} initial={buildInitialForm(section.fields, item)} loading={loading} onSave={(data) => handleUpdate(item.id, data)} onCancel={() => setEditingId(null)} />
            ) : (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {item.color && <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />}
                  <span className="text-sm font-medium text-gray-800">{item.name}</span>
                  {(item.offset_days != null || item.days != null) && <span className="text-xs text-gray-400">{item.offset_days ?? item.days} dies</span>}
                  {item.is_closed && <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-semibold uppercase">Tancat</span>}
                </div>
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingId(item.id)} className="text-xs font-bold text-gray-400 hover:text-emerald-600 uppercase">Editar</button>
                  <button onClick={() => handleDelete(item.id, item.name)} className="text-xs font-bold text-gray-400 hover:text-red-600 uppercase">Eliminar</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function SettingsPanel({ onBack, onShowNotification }) {
  const { currentUser, statuses, refreshStatuses, issueTypes, refreshIssueTypes, priorities, refreshPriorities, severities, refreshSeverities, tags, refreshTags, deadlineShortcuts, refreshDeadlineShortcuts } = useContext(UserContext);

  const dataMap = {
    statuses: { items: statuses, refresh: refreshStatuses },
    priorities: { items: priorities, refresh: refreshPriorities },
    issueTypes: { items: issueTypes, refresh: refreshIssueTypes },
    severities: { items: severities, refresh: refreshSeverities },
    tags: { items: tags, refresh: refreshTags },
    deadlineShortcuts: { items: deadlineShortcuts, refresh: refreshDeadlineShortcuts }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configuració</h2>
          <p className="text-sm text-gray-500 mt-1">Gestiona els paràmetres del sistema i taxonomies globals.</p>
        </div>
        <button onClick={onBack} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Tornar</button>
      </div>
      
      {SECTIONS.map(section => (
        <SettingsSection key={section.key} section={section} items={dataMap[section.key]?.items || []} refresh={dataMap[section.key]?.refresh} apiKey={currentUser.apiKey} onShowNotification={onShowNotification} />
      ))}
    </div>
  );
}