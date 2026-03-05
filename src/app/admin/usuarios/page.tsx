"use client"

import { useState, useEffect, useCallback } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "admin" | "editor" | "viewer" | "moderator"

type Permission =
  | "users:read" | "users:write" | "users:delete"
  | "content:read" | "content:write" | "content:delete"
  | "settings:read" | "settings:write"
  | "reports:read" | "reports:export"

type User = {
  id: number
  name: string
  email: string
  emailVerified: string | null
  image: string | null
  role: Role
  permissions: Permission[]
  createdAt: string
  active: boolean
  hasPassword: boolean
}

type FormData = Partial<User> & {
  password?: string
  confirmPassword?: string
  changePassword?: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<Role, { label: string; color: string; bg: string; defaultPerms: Permission[] }> = {
  admin: {
    label: "Admin", color: "text-red-400", bg: "bg-red-400/10 border-red-400/30",
    defaultPerms: ["users:read","users:write","users:delete","content:read","content:write","content:delete","settings:read","settings:write","reports:read","reports:export"],
  },
  moderator: {
    label: "Moderador", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/30",
    defaultPerms: ["users:read","content:read","content:write","content:delete","reports:read"],
  },
  editor: {
    label: "Editor", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30",
    defaultPerms: ["content:read","content:write","reports:read"],
  },
  viewer: {
    label: "Visualizador", color: "text-slate-400", bg: "bg-slate-400/10 border-slate-400/30",
    defaultPerms: ["content:read","reports:read"],
  },
}

const PERMISSION_GROUPS = [
  { group: "Usuários",      icon: "👥", perms: [{ key: "users:read" as Permission, label: "Visualizar" }, { key: "users:write" as Permission, label: "Editar" }, { key: "users:delete" as Permission, label: "Excluir" }] },
  { group: "Conteúdo",      icon: "📄", perms: [{ key: "content:read" as Permission, label: "Visualizar" }, { key: "content:write" as Permission, label: "Editar" }, { key: "content:delete" as Permission, label: "Excluir" }] },
  { group: "Configurações", icon: "⚙️", perms: [{ key: "settings:read" as Permission, label: "Visualizar" }, { key: "settings:write" as Permission, label: "Editar" }] },
  { group: "Relatórios",    icon: "📊", perms: [{ key: "reports:read" as Permission, label: "Visualizar" }, { key: "reports:export" as Permission, label: "Exportar" }] },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPasswordStrength(pwd: string) {
  if (!pwd) return { score: 0, label: "", color: "" }
  let s = 0
  if (pwd.length >= 8)        s++
  if (pwd.length >= 12)       s++
  if (/[A-Z]/.test(pwd))      s++
  if (/[0-9]/.test(pwd))      s++
  if (/[^A-Za-z0-9]/.test(pwd)) s++
  if (s <= 1) return { score: s, label: "Muito fraca",  color: "bg-red-500" }
  if (s <= 2) return { score: s, label: "Fraca",        color: "bg-orange-500" }
  if (s <= 3) return { score: s, label: "Média",        color: "bg-yellow-500" }
  if (s <= 4) return { score: s, label: "Forte",        color: "bg-blue-500" }
  return         { score: s, label: "Muito forte",  color: "bg-emerald-500" }
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
  const colors = ["bg-violet-500","bg-blue-500","bg-emerald-500","bg-rose-500","bg-amber-500","bg-cyan-500"]
  const color = colors[name.charCodeAt(0) % colors.length]
  const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm"
  return <div className={`${sz} ${color} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}>{initials}</div>
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`relative rounded-full transition-colors flex-shrink-0 ${value ? "bg-violet-500" : "bg-white/15"}`} style={{ width: 40, height: 22 }}>
      <span className="absolute top-0.5 bg-white rounded-full shadow transition-transform" style={{ width: 18, height: 18, left: 2, transform: value ? "translateX(18px)" : "translateX(0)" }} />
    </button>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-white/50 text-xs font-medium mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function UserModal({ user, onClose, onSave, saving }: {
  user: Partial<User> | null
  onClose: () => void
  onSave: (data: FormData) => Promise<void>
  saving: boolean
}) {
  const isNew = !user?.id
  const [tab, setTab] = useState<"info" | "senha" | "perms">("info")
  const [showPwd, setShowPwd] = useState(false)
  const [showCfm, setShowCfm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState<FormData>({
    name: "", email: "", role: "viewer",
    permissions: ROLE_CONFIG.viewer.defaultPerms,
    active: true, password: "", confirmPassword: "", changePassword: false,
    ...user,
  })

  const set = (k: keyof FormData, v: unknown) => setForm(f => ({ ...f, [k]: v }))
  const setRole = (role: Role) => setForm(f => ({ ...f, role, permissions: ROLE_CONFIG[role].defaultPerms }))
  const togglePerm = (perm: Permission) => setForm(f => {
    const p = f.permissions ?? []
    return { ...f, permissions: p.includes(perm) ? p.filter(x => x !== perm) : [...p, perm] }
  })

  const strength = getPasswordStrength(form.password ?? "")
  const needsPwd = isNew || form.changePassword

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name?.trim())  e.name = "Nome obrigatório"
    if (!form.email?.trim()) e.email = "E-mail obrigatório"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-mail inválido"
    if (needsPwd) {
      if (!form.password)             e.password = "Senha obrigatória"
      else if (form.password.length < 8) e.password = "Mínimo 8 caracteres"
      else if (strength.score < 2)    e.password = "Senha muito fraca"
      if (form.password !== form.confirmPassword) e.confirmPassword = "Senhas não coincidem"
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) {
      if (errors.name || errors.email) setTab("info")
      else setTab("senha")
      return
    }
    await onSave(form)
  }

  const inputCls = (err?: string) =>
    `w-full bg-white/5 border rounded-lg px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none transition-colors ${err ? "border-red-500/60" : "border-white/10 focus:border-violet-500/60"}`

  const tabs = [
    { key: "info",  label: "📋 Informações" },
    { key: "senha", label: "🔑 Senha" },
    { key: "perms", label: "🔐 Permissões" },
  ] as const

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0f1117] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            {form.name
              ? <Avatar name={form.name} />
              : <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30">?</div>
            }
            <div>
              <h2 className="text-white font-semibold text-sm">{isNew ? "Novo usuário" : "Editar usuário"}</h2>
              <p className="text-white/40 text-xs">{isNew ? "Preencha os dados abaixo" : form.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 text-xl leading-none transition-colors">×</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.08]">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 text-xs font-medium transition-colors relative ${tab === t.key ? "text-white" : "text-white/40 hover:text-white/60"}`}>
              {t.label}
              {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-t" />}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[58vh] overflow-y-auto">

          {tab === "info" && <>
            <Field label="Nome completo" error={errors.name}>
              <input type="text" value={form.name ?? ""} onChange={e => set("name", e.target.value)}
                placeholder="Ex: João Silva" className={inputCls(errors.name)} />
            </Field>

            <Field label="E-mail" error={errors.email}>
              <input type="email" value={form.email ?? ""} onChange={e => set("email", e.target.value)}
                placeholder="joao@empresa.com" className={inputCls(errors.email)} />
            </Field>

            <Field label="Função">
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(ROLE_CONFIG) as Role[]).map(role => {
                  const cfg = ROLE_CONFIG[role]
                  const selected = form.role === role
                  return (
                    <button key={role} onClick={() => setRole(role)}
                      className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all text-left ${
                        selected ? `${cfg.bg} ${cfg.color} border-current` : "bg-white/3 border-white/8 text-white/40 hover:bg-white/6"
                      }`}>
                      <div className="font-semibold">{cfg.label}</div>
                      <div className="opacity-60 text-[10px] mt-0.5">{cfg.defaultPerms.length} permissões padrão</div>
                    </button>
                  )
                })}
              </div>
            </Field>

            <div className="flex items-center justify-between bg-white/3 border border-white/[0.08] rounded-xl px-4 py-3">
              <div>
                <p className="text-white/70 text-sm font-medium">Conta ativa</p>
                <p className="text-white/30 text-xs">Usuário pode fazer login</p>
              </div>
              <Toggle value={form.active ?? true} onChange={() => set("active", !form.active)} />
            </div>
          </>}

          {tab === "senha" && <>
            {!isNew && (
              <div className="flex items-center justify-between bg-white/3 border border-white/[0.08] rounded-xl px-4 py-3">
                <div>
                  <p className="text-white/70 text-sm font-medium">Alterar senha</p>
                  <p className="text-white/30 text-xs">
                    {user?.hasPassword ? "Possui senha — deseja redefinir?" : "Sem senha (somente OAuth)"}
                  </p>
                </div>
                <Toggle value={form.changePassword ?? false} onChange={() => set("changePassword", !form.changePassword)} />
              </div>
            )}

            {needsPwd ? <>
              <Field label={isNew ? "Senha" : "Nova senha"} error={errors.password}>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} value={form.password ?? ""}
                    onChange={e => set("password", e.target.value)} placeholder="Mínimo 8 caracteres"
                    className={inputCls(errors.password) + " pr-10"} />
                  <button onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs transition-colors">
                    {showPwd ? "🙈" : "👁"}
                  </button>
                </div>

                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength.score ? strength.color : "bg-white/10"}`} />
                      ))}
                    </div>
                    <p className={`text-xs ${strength.score <= 2 ? "text-red-400" : strength.score <= 3 ? "text-yellow-400" : "text-emerald-400"}`}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </Field>

              <Field label="Confirmar senha" error={errors.confirmPassword}>
                <div className="relative">
                  <input type={showCfm ? "text" : "password"} value={form.confirmPassword ?? ""}
                    onChange={e => set("confirmPassword", e.target.value)} placeholder="Repita a senha"
                    className={inputCls(errors.confirmPassword) + " pr-10"} />
                  <button onClick={() => setShowCfm(!showCfm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs transition-colors">
                    {showCfm ? "🙈" : "👁"}
                  </button>
                </div>
                {form.confirmPassword && form.password === form.confirmPassword && !errors.confirmPassword && (
                  <p className="text-emerald-400 text-xs mt-1">✓ Senhas coincidem</p>
                )}
              </Field>

              <div className="bg-white/3 border border-white/[0.08] rounded-xl p-3">
                <p className="text-white/40 text-xs font-semibold mb-2">Requisitos:</p>
                {[
                  { label: "Mínimo 8 caracteres",      ok: (form.password?.length ?? 0) >= 8 },
                  { label: "Letra maiúscula (A-Z)",     ok: /[A-Z]/.test(form.password ?? "") },
                  { label: "Número (0-9)",              ok: /[0-9]/.test(form.password ?? "") },
                  { label: "Caractere especial (!@#$)", ok: /[^A-Za-z0-9]/.test(form.password ?? "") },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-2 mb-1">
                    <span className={`text-xs ${r.ok ? "text-emerald-400" : "text-white/20"}`}>{r.ok ? "✓" : "○"}</span>
                    <span className={`text-xs ${r.ok ? "text-white/60" : "text-white/25"}`}>{r.label}</span>
                  </div>
                ))}
              </div>
            </> : (
              <div className="flex flex-col items-center justify-center py-10 text-white/25">
                <span className="text-4xl mb-3">🔒</span>
                <p className="text-sm">Ative "Alterar senha" para redefinir</p>
              </div>
            )}
          </>}

          {tab === "perms" && <>
            <p className="text-white/40 text-xs mb-3">
              Permissões de <span className="text-white/70">{form.name || "este usuário"}</span>.
              Trocar a função redefine para o padrão.
            </p>
            {PERMISSION_GROUPS.map(group => (
              <div key={group.group} className="bg-white/3 border border-white/[0.08] rounded-xl p-3">
                <p className="text-white/60 text-xs font-semibold mb-2">{group.icon} {group.group}</p>
                <div className="grid grid-cols-3 gap-2">
                  {group.perms.map(({ key, label }) => {
                    const on = form.permissions?.includes(key) ?? false
                    return (
                      <button key={key} onClick={() => togglePerm(key)}
                        className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          on ? "bg-violet-500/20 border-violet-500/40 text-violet-300" : "bg-white/3 border-white/8 text-white/30 hover:bg-white/6"
                        }`}>
                        {on ? "✓ " : ""}{label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </>}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-white/[0.08]">
          <button onClick={onClose} className="flex-1 py-2 text-sm text-white/50 hover:text-white/70 border border-white/10 rounded-lg transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2">
            {saving
              ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Salvando…</>
              : isNew ? "Criar usuário" : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Table Row ────────────────────────────────────────────────────────────────

function UserRow({ user, onEdit, onDelete, onToggle }: {
  user: User
  onEdit: (u: User) => void
  onDelete: (id: number) => void
  onToggle: (id: number) => void
}) {
  const role = ROLE_CONFIG[user.role]
  const [menu, setMenu] = useState(false)

  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="sm" />
          <div>
            <p className="text-white/90 text-sm font-medium">{user.name}</p>
            <p className="text-white/35 text-xs">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium ${role.bg} ${role.color}`}>
          {role.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {user.permissions.slice(0, 3).map(p => (
            <span key={p} className="px-1.5 py-0.5 bg-white/5 border border-white/8 text-white/40 text-[10px] rounded">{p}</span>
          ))}
          {user.permissions.length > 3 && (
            <span className="px-1.5 py-0.5 bg-white/5 border border-white/8 text-white/40 text-[10px] rounded">+{user.permissions.length - 3}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1 text-xs font-medium ${user.active ? "text-emerald-400" : "text-white/30"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${user.active ? "bg-emerald-400" : "bg-white/20"}`} />
          {user.active ? "Ativo" : "Inativo"}
        </span>
      </td>
      <td className="px-4 py-3 text-xs">
        {user.emailVerified
          ? <span className="text-emerald-400/70">✓ Verificado</span>
          : <span className="text-amber-400/60">⚠ Pendente</span>}
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`text-sm ${user.hasPassword ? "opacity-70" : "opacity-20"}`} title={user.hasPassword ? "Tem senha" : "Sem senha"}>
          🔑
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="relative flex justify-end">
          <button onClick={() => setMenu(!menu)}
            className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/8 rounded-lg transition-all text-lg">
            ⋯
          </button>
          {menu && <>
            <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
            <div className="absolute right-0 top-8 z-20 bg-[#1a1d27] border border-white/10 rounded-xl shadow-2xl py-1 min-w-[160px]">
              <button onClick={() => { onEdit(user); setMenu(false) }} className="w-full px-3 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">✏️ Editar</button>
              <button onClick={() => { onToggle(user.id); setMenu(false) }} className="w-full px-3 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                {user.active ? "🚫 Desativar" : "✅ Ativar"}
              </button>
              <div className="my-1 border-t border-white/8" />
              <button onClick={() => { onDelete(user.id); setMenu(false) }} className="w-full px-3 py-2 text-left text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/5 transition-colors">🗑 Excluir</button>
            </div>
          </>}
        </div>
      </td>
    </tr>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterRole, setFilterRole] = useState<Role | "all">("all")
  const [modal, setModal] = useState<{ open: boolean; user: Partial<User> | null }>({ open: false, user: null })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null)

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/usuarios")
      if (!res.ok) throw new Error()
      setUsers(await res.json())
    } catch {
      showToast("Erro ao carregar usuários", "err")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleSave = async (form: FormData) => {
    setSaving(true)
    try {
      const isNew = !form.id
      const res = await fetch(
        isNew ? "/api/admin/usuarios" : `/api/admin/usuarios/${form.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            role: form.role,
            permissions: form.permissions,
            active: form.active,
            ...(form.password && (isNew || form.changePassword) ? { password: form.password } : {}),
          }),
        }
      )
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message ?? "Erro ao salvar")
      }
      await fetchUsers()
      setModal({ open: false, user: null })
      showToast(isNew ? "Usuário criado com sucesso!" : "Usuário atualizado!")
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Erro ao salvar", "err")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir este usuário? Ação irreversível.")) return
    try {
      const res = await fetch(`/api/admin/usuarios/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setUsers(prev => prev.filter(u => u.id !== id))
      showToast("Usuário excluído.")
    } catch {
      showToast("Erro ao excluir", "err")
    }
  }

  const handleToggle = async (id: number) => {
    const user = users.find(u => u.id === id)
    if (!user) return
    try {
      const res = await fetch(`/api/admin/usuarios/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !user.active }),
      })
      if (!res.ok) throw new Error()
      setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u))
    } catch {
      showToast("Erro ao alterar status", "err")
    }
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (filterRole === "all" || u.role === filterRole)
  })

  const stats = {
    total:      users.length,
    active:     users.filter(u => u.active).length,
    admins:     users.filter(u => u.role === "admin").length,
    unverified: users.filter(u => !u.emailVerified).length,
  }

  return (
    <div className="min-h-screen bg-[#080a0f] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.7s linear infinite; }
      `}</style>

      {toast && (
        <div className={`fixed top-4 right-4 z-50 border text-sm px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 ${
          toast.type === "ok" ? "bg-[#1a1d27] border-white/10 text-white/80" : "bg-red-950/80 border-red-500/30 text-red-300"
        }`}>
          <span>{toast.type === "ok" ? "✓" : "✕"}</span> {toast.msg}
        </div>
      )}

      {modal.open && (
        <UserModal user={modal.user} onClose={() => setModal({ open: false, user: null })} onSave={handleSave} saving={saving} />
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-white/30 text-xs mono mb-1 tracking-widest uppercase">Auth.js · Neon DB</p>
            <h1 className="text-2xl font-bold text-white">Gerenciamento de Usuários</h1>
            <p className="text-white/40 text-sm mt-1">Cadastre, edite e gerencie permissões do sistema</p>
          </div>
          <button onClick={() => setModal({ open: true, user: null })}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-violet-500/20">
            <span className="text-base leading-none">+</span> Novo usuário
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total",           value: stats.total,      icon: "👥", color: "text-white/80" },
            { label: "Ativos",          value: stats.active,     icon: "✅", color: "text-emerald-400" },
            { label: "Admins",          value: stats.admins,     icon: "🛡", color: "text-red-400" },
            { label: "Não verificados", value: stats.unverified, icon: "⚠️", color: "text-amber-400" },
          ].map(s => (
            <div key={s.label} className="bg-white/3 border border-white/[0.08] rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-white/40 text-xs">{s.label}</p>
                <span className="text-sm">{s.icon}</span>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{loading ? "—" : s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-sm">🔍</span>
            <input type="text" placeholder="Buscar por nome ou e-mail…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/60 transition-colors" />
          </div>
          <div className="flex gap-1.5">
            {(["all", ...Object.keys(ROLE_CONFIG)] as (Role | "all")[]).map(r => (
              <button key={r} onClick={() => setFilterRole(r)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  filterRole === r ? "bg-violet-600 border-violet-500 text-white" : "bg-white/3 border-white/8 text-white/40 hover:bg-white/6"
                }`}>
                {r === "all" ? "Todos" : ROLE_CONFIG[r].label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/2 border border-white/[0.08] rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-white/30 text-sm">
              <span className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
              Carregando usuários…
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  {["Usuário","Função","Permissões","Status","E-mail","Senha",""].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={7} className="px-4 py-12 text-center text-white/25 text-sm">Nenhum usuário encontrado</td></tr>
                  : filtered.map(user => (
                    <UserRow key={user.id} user={user}
                      onEdit={u => setModal({ open: true, user: u })}
                      onDelete={handleDelete}
                      onToggle={handleToggle}
                    />
                  ))
                }
              </tbody>
            </table>
          )}
          <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
            <p className="text-white/25 text-xs">Mostrando {filtered.length} de {users.length} usuários</p>
            <p className="text-white/20 text-xs mono">users · accounts · sessions</p>
          </div>
        </div>
      </div>
    </div>
  )
}