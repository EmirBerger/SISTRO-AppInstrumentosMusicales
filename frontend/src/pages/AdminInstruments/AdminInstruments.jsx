import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, X, ArrowUp, ArrowDown } from 'lucide-react'
import BackButton from '../../components/BackButton/BackButton'
import api from '../../services/api'
import styles from './AdminInstruments.module.css'

// ── Block type config ──────────────────────────────────────────────
const BLOCK_TYPES = {
  text:         { label: 'Texto',     color: '#60a5fa' },
  tip:          { label: 'Consejo',   color: '#33AB1B' },
  image:        { label: 'Imagen',    color: '#f59e0b' },
  key_concepts: { label: 'Conceptos', color: '#a78bfa' },
}

function defaultContent(type) {
  if (type === 'image') return { url: '', alt: '', caption: '' }
  if (type === 'key_concepts') return []
  return ''
}

// ── Concepts tag input ─────────────────────────────────────────────
function ConceptsInput({ concepts, onChange }) {
  const [input, setInput] = useState('')

  function add() {
    const val = input.trim()
    if (!val || concepts.includes(val)) return
    onChange([...concepts, val])
    setInput('')
  }

  function remove(i) {
    onChange(concepts.filter((_, idx) => idx !== i))
  }

  return (
    <div className={styles.conceptsEditor}>
      <div className={styles.conceptsChips}>
        {concepts.map((c, i) => (
          <span key={i} className={styles.conceptChipEdit}>
            {c}
            <button type="button" className={styles.chipRemove} onClick={() => remove(i)}>×</button>
          </span>
        ))}
        {concepts.length === 0 && (
          <span className={styles.conceptsEmpty}>Sin conceptos todavía</span>
        )}
      </div>
      <div className={styles.conceptInputRow}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          placeholder="Escribí un concepto y presioná Enter"
        />
        <button type="button" className={styles.btnSecondary} onClick={add}>Agregar</button>
      </div>
    </div>
  )
}

// ── Individual block card ──────────────────────────────────────────
function BlockCard({ block, index, total, onChange, onRemove, onMoveUp, onMoveDown }) {
  const cfg = BLOCK_TYPES[block.type]

  function updateImageField(field, value) {
    onChange({ ...block.content, [field]: value })
  }

  return (
    <div className={styles.blockCard}>
      <div className={styles.blockCardHeader}>
        <span
          className={styles.blockTypeBadge}
          style={{ background: cfg.color + '20', color: cfg.color, borderColor: cfg.color + '40' }}
        >
          {cfg.label}
        </span>
        <div className={styles.blockCardActions}>
          <button type="button" className={styles.iconBtn} onClick={onMoveUp} disabled={!onMoveUp} title="Subir">
            <ArrowUp size={13} />
          </button>
          <button type="button" className={styles.iconBtn} onClick={onMoveDown} disabled={!onMoveDown} title="Bajar">
            <ArrowDown size={13} />
          </button>
          <button type="button" className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={onRemove} title="Eliminar bloque">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className={styles.blockCardBody}>
        {block.type === 'text' && (
          <textarea
            className={styles.textarea}
            value={block.content}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            placeholder="Escribí el contenido del bloque de texto..."
          />
        )}

        {block.type === 'tip' && (
          <textarea
            className={styles.textarea}
            value={block.content}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            placeholder="Escribí el consejo o dato importante..."
          />
        )}

        {block.type === 'image' && (
          <div className={styles.imageFields}>
            <input
              className={styles.input}
              value={block.content.url || ''}
              onChange={(e) => updateImageField('url', e.target.value)}
              placeholder="URL de la imagen (podés dejarlo vacío por ahora)"
            />
            <input
              className={styles.input}
              value={block.content.alt || ''}
              onChange={(e) => updateImageField('alt', e.target.value)}
              placeholder="Descripción de la imagen"
            />
            <input
              className={styles.input}
              value={block.content.caption || ''}
              onChange={(e) => updateImageField('caption', e.target.value)}
              placeholder="Pie de imagen (caption)"
            />
          </div>
        )}

        {block.type === 'key_concepts' && (
          <ConceptsInput concepts={block.content} onChange={onChange} />
        )}
      </div>
    </div>
  )
}

// ── Block editor ───────────────────────────────────────────────────
function BlockEditor({ blocks, onChange }) {
  function addBlock(type) {
    const newBlock = { _tempId: Date.now(), type, content: defaultContent(type), order: blocks.length + 1 }
    onChange([...blocks, newBlock])
  }

  function updateBlock(index, content) {
    const updated = [...blocks]
    updated[index] = { ...updated[index], content }
    onChange(updated)
  }

  function removeBlock(index) {
    onChange(
      blocks
        .filter((_, i) => i !== index)
        .map((b, i) => ({ ...b, order: i + 1 }))
    )
  }

  function moveBlock(index, dir) {
    const updated = [...blocks]
    const target = index + dir
    ;[updated[index], updated[target]] = [updated[target], updated[index]]
    onChange(updated.map((b, i) => ({ ...b, order: i + 1 })))
  }

  return (
    <div className={styles.blockEditor}>
      <p className={styles.blockEditorLabel}>Bloques de contenido</p>

      {blocks.length === 0 && (
        <p className={styles.blockEditorEmpty}>Sin bloques todavía. Agregá uno abajo.</p>
      )}

      {blocks.map((block, i) => (
        <BlockCard
          key={block._tempId ?? block.block_id ?? i}
          block={block}
          index={i}
          total={blocks.length}
          onChange={(content) => updateBlock(i, content)}
          onRemove={() => removeBlock(i)}
          onMoveUp={i > 0 ? () => moveBlock(i, -1) : null}
          onMoveDown={i < blocks.length - 1 ? () => moveBlock(i, 1) : null}
        />
      ))}

      <div className={styles.addBlockBar}>
        <span className={styles.addBlockLabel}>Agregar:</span>
        {Object.entries(BLOCK_TYPES).map(([type, cfg]) => (
          <button
            key={type}
            type="button"
            className={styles.addBlockBtn}
            style={{ '--block-color': cfg.color }}
            onClick={() => addBlock(type)}
          >
            + {cfg.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Shared components ──────────────────────────────────────────────
function Field({ label, name, value, onChange, type = 'text', required, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}{required && ' *'}</label>
      {children ?? (
        type === 'textarea'
          ? <textarea className={styles.textarea} name={name} value={value} onChange={onChange} rows={5} />
          : <input className={styles.input} type={type} name={name} value={value} onChange={onChange} />
      )}
    </div>
  )
}

function Modal({ title, onClose, wide, children }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} ${wide ? styles.modalWide : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

function ConfirmModal({ message, onConfirm, onClose }) {
  return (
    <Modal title="Confirmar eliminación" onClose={onClose}>
      <p className={styles.confirmText}>{message}</p>
      <div className={styles.modalActions}>
        <button className={styles.btnSecondary} onClick={onClose}>Cancelar</button>
        <button className={styles.btnDanger} onClick={onConfirm}>Eliminar</button>
      </div>
    </Modal>
  )
}

// ── Lesson modal (with block editor) ──────────────────────────────
function LessonModal({ moduleId, lesson, onClose, onSaved }) {
  const editing = !!lesson
  const [form, setForm] = useState({
    title: lesson?.title ?? '',
    order: lesson?.order ?? '',
  })
  const [blocks, setBlocks] = useState([])
  const [loadingBlocks, setLoadingBlocks] = useState(editing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!editing) return
    api.get(`/modulo/${lesson.lesson_id}`)
      .then((res) => {
        const existing = (res.data.data.blocks ?? []).map((b) => ({ ...b, _tempId: b.block_id }))
        setBlocks(existing)
      })
      .catch(() => setError('No se pudieron cargar los bloques existentes'))
      .finally(() => setLoadingBlocks(false))
  }, [])

  function handle(e) { setForm((f) => ({ ...f, [e.target.name]: e.target.value })) }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      let lessonId = lesson?.lesson_id

      if (editing) {
        await api.post(`/admin/modulo/${lessonId}/editar`, { ...form, module_id: moduleId })
      } else {
        const res = await api.post('/admin/modulo/nuevo', { ...form, module_id: moduleId })
        lessonId = res.data.lesson_id
      }

      await api.post(`/admin/modulo/${lessonId}/bloques`, {
        blocks: blocks.map((b, i) => ({
          type:    b.type,
          content: b.content,
          order:   i + 1,
        })),
      })

      onSaved()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al guardar la clase')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={editing ? 'Editar módulo' : 'Nuevo módulo'} onClose={onClose} wide>
      <form onSubmit={submit}>
        <div className={styles.formRow}>
          <Field label="Título" name="title" value={form.title} onChange={handle} required />
          <Field label="Orden" name="order" type="number" value={form.order} onChange={handle} required />
        </div>

        {loadingBlocks
          ? <p className={styles.loadingText}>Cargando bloques...</p>
          : <BlockEditor blocks={blocks} onChange={setBlocks} />
        }

        {error && <p className={styles.formError}>{error}</p>}
        <div className={styles.modalActions}>
          <button type="button" className={styles.btnSecondary} onClick={onClose}>Cancelar</button>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>
            {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear módulo'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ── Module modal ───────────────────────────────────────────────────
function ModuleModal({ instrumentId, module, onClose, onSaved }) {
  const editing = !!module
  const [form, setForm] = useState({
    title: module?.title ?? '',
    level: module?.level ?? 'principiante',
    order: module?.order ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handle(e) { setForm((f) => ({ ...f, [e.target.name]: e.target.value })) }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing) {
        await api.post(`/admin/clase/${module.module_id}/editar`, { ...form, instrument_id: instrumentId })
      } else {
        await api.post('/admin/clase/nuevo', { ...form, instrument_id: instrumentId })
      }
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al guardar el módulo')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={editing ? 'Editar clase' : 'Nueva clase'} onClose={onClose}>
      <form onSubmit={submit}>
        <Field label="Título" name="title" value={form.title} onChange={handle} required />
        <Field label="Nivel" name="level" value={form.level} onChange={handle} required>
          <select className={styles.input} name="level" value={form.level} onChange={handle}>
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </Field>
        <Field label="Orden" name="order" type="number" value={form.order} onChange={handle} required />
        {error && <p className={styles.formError}>{error}</p>}
        <div className={styles.modalActions}>
          <button type="button" className={styles.btnSecondary} onClick={onClose}>Cancelar</button>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>
            {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear clase'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ── Instrument modal ───────────────────────────────────────────────
function InstrumentModal({ instrument, onClose, onSaved }) {
  const editing = !!instrument
  const [form, setForm] = useState({
    name: instrument?.name ?? '',
    image_description: instrument?.image_description ?? '',
    is_active: instrument?.is_active ?? true,
  })
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handle(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const data = new FormData()
      data.append('name', form.name)
      data.append('image_description', form.image_description)
      data.append('is_active', form.is_active ? '1' : '0')
      if (imageFile) data.append('image', imageFile)

      if (editing) {
        await api.post(`/admin/instrumento/${instrument.instrument_id}/editar`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } else {
        await api.post('/admin/instrumento/nuevo', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      }
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al guardar el instrumento')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={editing ? 'Editar instrumento' : 'Nuevo instrumento'} onClose={onClose}>
      <form onSubmit={submit}>
        <Field label="Nombre" name="name" value={form.name} onChange={handle} required />
        <Field label="Descripción de imagen" name="image_description" value={form.image_description} onChange={handle} />
        <div className={styles.field}>
          <label className={styles.label}>Imagen{!editing && ' *'}</label>
          <input type="file" accept="image/*" className={styles.fileInput}
            onChange={(e) => setImageFile(e.target.files[0])} />
        </div>
        <div className={styles.checkboxField}>
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={handle} id="is_active" />
          <label htmlFor="is_active">Activo</label>
        </div>
        {error && <p className={styles.formError}>{error}</p>}
        <div className={styles.modalActions}>
          <button type="button" className={styles.btnSecondary} onClick={onClose}>Cancelar</button>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>
            {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear instrumento'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ── Lesson row ─────────────────────────────────────────────────────
function LessonRow({ lesson, moduleId, onEdit, onDelete }) {
  return (
    <div className={styles.lessonRow}>
      <span className={styles.lessonOrder}>{lesson.order}</span>
      <span className={styles.lessonTitle}>{lesson.title}</span>
      <div className={styles.rowActions}>
        <button className={styles.iconBtn} onClick={() => onEdit(lesson)} title="Editar"><Pencil size={14} /></button>
        <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={() => onDelete(lesson)} title="Eliminar"><Trash2 size={14} /></button>
      </div>
    </div>
  )
}

// ── Module row ─────────────────────────────────────────────────────
function ModuleRow({ module, instrumentId, onReload }) {
  const [open, setOpen] = useState(false)
  const [lessonModal, setLessonModal] = useState(null)
  const [moduleModal, setModuleModal] = useState(false)
  const [confirm, setConfirm] = useState(null)

  async function deleteLesson(lesson) {
    await api.post(`/admin/modulo/${lesson.lesson_id}/eliminar`)
    onReload()
  }

  async function deleteModule() {
    await api.post(`/admin/clase/${module.module_id}/eliminar`)
    onReload()
  }

  return (
    <>
      <div className={styles.moduleRow}>
        <button className={styles.moduleToggle} onClick={() => setOpen((o) => !o)}>
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className={styles.moduleOrder}>{module.order}.</span>
          <span className={styles.moduleTitle}>{module.title}</span>
          <span className={styles.lessonCount}>{module.lessons?.length ?? 0} módulos</span>
        </button>
        <div className={styles.rowActions}>
          <button className={styles.iconBtn} onClick={() => setModuleModal(true)} title="Editar clase"><Pencil size={14} /></button>
          <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={() => setConfirm({ type: 'module' })} title="Eliminar clase"><Trash2 size={14} /></button>
        </div>
      </div>

      {open && (
        <div className={styles.lessonsArea}>
          {(module.lessons ?? []).map((lesson) => (
            <LessonRow
              key={lesson.lesson_id}
              lesson={lesson}
              moduleId={module.module_id}
              onEdit={(l) => setLessonModal(l)}
              onDelete={(l) => setConfirm({ type: 'lesson', item: l })}
            />
          ))}
          <button className={styles.addLessonBtn} onClick={() => setLessonModal('new')}>
            <Plus size={14} /> Agregar módulo
          </button>
        </div>
      )}

      {lessonModal && (
        <LessonModal
          moduleId={module.module_id}
          lesson={lessonModal === 'new' ? null : lessonModal}
          onClose={() => setLessonModal(null)}
          onSaved={() => { setLessonModal(null); onReload() }}
        />
      )}

      {moduleModal && (
        <ModuleModal
          instrumentId={instrumentId}
          module={module}
          onClose={() => setModuleModal(false)}
          onSaved={() => { setModuleModal(false); onReload() }}
        />
      )}

      {confirm?.type === 'lesson' && (
        <ConfirmModal
          message={`¿Eliminar el módulo "${confirm.item.title}"? Esta acción no se puede deshacer.`}
          onConfirm={() => { deleteLesson(confirm.item); setConfirm(null) }}
          onClose={() => setConfirm(null)}
        />
      )}

      {confirm?.type === 'module' && (
        <ConfirmModal
          message={`¿Eliminar la clase "${module.title}" y todos sus módulos? Esta acción no se puede deshacer.`}
          onConfirm={() => { deleteModule(); setConfirm(null) }}
          onClose={() => setConfirm(null)}
        />
      )}
    </>
  )
}

// ── Instrument row ─────────────────────────────────────────────────
function InstrumentRow({ instrument, onEdit, onDelete, onReload }) {
  const [open, setOpen] = useState(false)
  const [map, setMap] = useState(null)
  const [loadingMap, setLoadingMap] = useState(false)
  const [moduleModal, setModuleModal] = useState(false)

  useEffect(() => {
    if (!open || map || loadingMap) return
    setLoadingMap(true)
    api.get(`/instrumentos/${instrument.instrument_id}`)
      .then((res) => setMap(res.data.data))
      .finally(() => setLoadingMap(false))
  }, [open, map])

  function toggle() { setOpen((o) => !o) }

  function reloadMap() { setMap(null) }

  return (
    <div className={styles.instrumentBlock}>
      <div className={styles.instrumentRow}>
        <button className={styles.instrumentToggle} onClick={toggle}>
          {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <span className={`${styles.statusDot} ${instrument.is_active ? styles.dotActive : styles.dotInactive}`} />
          <span className={styles.instrumentName}>{instrument.name}</span>
        </button>
        <div className={styles.rowActions}>
          <button className={styles.iconBtn} onClick={() => onEdit(instrument)} title="Editar"><Pencil size={15} /></button>
          <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={() => onDelete(instrument)} title="Eliminar"><Trash2 size={15} /></button>
        </div>
      </div>

      {open && (
        <div className={styles.modulesArea}>
          {loadingMap && <p className={styles.loadingText}>Cargando clases...</p>}
          {map && (
            <>
              {map.map.map((mod) => (
                <ModuleRow
                  key={mod.module_id}
                  module={mod}
                  instrumentId={instrument.instrument_id}
                  onReload={reloadMap}
                />
              ))}
              {map.map.length === 0 && <p className={styles.emptyText}>Sin clases todavía.</p>}
              <button className={styles.addModuleBtn} onClick={() => setModuleModal(true)}>
                <Plus size={14} /> Agregar clase
              </button>
            </>
          )}
        </div>
      )}

      {moduleModal && (
        <ModuleModal
          instrumentId={instrument.instrument_id}
          module={null}
          onClose={() => setModuleModal(false)}
          onSaved={() => { setModuleModal(false); reloadMap() }}
        />
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────
function AdminInstruments() {
  const [instruments, setInstruments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [instrModal, setInstrModal] = useState(null)
  const [confirm, setConfirm] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const res = await api.get('/instrumentos')
      setInstruments(res.data.data)
    } catch {
      setError('No se pudieron cargar los instrumentos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function deleteInstrument(instrument) {
    try {
      await api.post(`/admin/instrumento/${instrument.instrument_id}/eliminar`)
      load()
    } catch {
      setError('No se pudo eliminar el instrumento')
    }
  }

  return (
    <div className={styles.page}>
      <BackButton />
      <h1 className={styles.title}>Admin — Instrumentos</h1>
      <p className={styles.subtitle}>Gestioná instrumentos, clases y módulos</p>

      <div className={styles.topBar}>
        <button className={styles.btnPrimary} onClick={() => setInstrModal('new')}>
          <Plus size={16} /> Nuevo instrumento
        </button>
      </div>

      {loading && <p className={styles.status}>Cargando...</p>}
      {error && <p className={`${styles.status} ${styles.errorText}`}>{error}</p>}

      <div className={styles.list}>
        {instruments.map((inst) => (
          <InstrumentRow
            key={inst.instrument_id}
            instrument={inst}
            onEdit={(i) => setInstrModal(i)}
            onDelete={(i) => setConfirm(i)}
            onReload={load}
          />
        ))}
        {!loading && instruments.length === 0 && (
          <p className={styles.emptyText}>No hay instrumentos todavía.</p>
        )}
      </div>

      {instrModal && (
        <InstrumentModal
          instrument={instrModal === 'new' ? null : instrModal}
          onClose={() => setInstrModal(null)}
          onSaved={() => { setInstrModal(null); load() }}
        />
      )}

      {confirm && (
        <ConfirmModal
          message={`¿Eliminar "${confirm.name}" y todo su contenido? Esta acción no se puede deshacer.`}
          onConfirm={() => { deleteInstrument(confirm); setConfirm(null) }}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  )
}

export default AdminInstruments
