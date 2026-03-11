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

const ROLE_CONFIG: Record<Role, { label: string; colorVar: string; bgClass: string; defaultPerms: Permission[] }> = {
  admin: {
    label: "Admin",
    colorVar: "var(--color-danger, #f87171)",
    bgClass: "role-admin",
    defaultPerms: ["users:read","users:write","users:delete","content:read","content:write","content:delete","settings:read","settings:write","reports:read","reports:export"],
  },
  moderator: {
    label: "Moderador",
    colorVar: "var(--color-warning, #fbbf24)",
    bgClass: "role-moderator",
    defaultPerms: ["users:read","content:read","content:write","content:delete","reports:read"],
  },
  editor: {
    label: "Editor",
    colorVar: "var(--color-primary)",
    bgClass: "role-editor",
    defaultPerms: ["content:read","content:write","reports:read"],
  },
  viewer: {
    label: "Visualizador",
    colorVar: "var(--color-text-muted)",
    bgClass: "role-viewer",
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
  if (pwd.length >= 8)              s++
  if (pwd.length >= 12)             s++
  if (/[A-Z]/.test(pwd))            s++
  if (/[0-9]/.test(pwd))            s++
  if (/[^A-Za-z0-9]/.test(pwd))    s++
  if (s <= 1) return { score: s, label: "Muito fraca",  color: "var(--color-danger, #f87171)" }
  if (s <= 2) return { score: s, label: "Fraca",        color: "var(--color-warning, #fb923c)" }
  if (s <= 3) return { score: s, label: "Média",        color: "var(--color-accent)" }
  if (s <= 4) return { score: s, label: "Forte",        color: "var(--color-primary)" }
  return         { score: s, label: "Muito forte",  color: "var(--color-success, #34d399)" }
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
  const palettes = [
    "var(--color-primary)",
    "var(--color-secondary)",
    "var(--color-accent)",
    "#e11d48",
    "#d97706",
    "#0891b2",
  ]
  const bg = palettes[name.charCodeAt(0) % palettes.length]
  const sz = size === "sm" ? { width: 28, height: 28, fontSize: 11 } : { width: 36, height: 36, fontSize: 13 }
  return (
    <div style={{
      ...sz,
      background: bg,
      borderRadius: "var(--border-radius)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      color: "var(--color-text-inverse)",
      flexShrink: 0,
      fontFamily: "var(--font-body)",
    }}>
      {initials}
    </div>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        position: "relative",
        borderRadius: 999,
        width: 40,
        height: 22,
        background: value ? "var(--color-primary)" : "rgba(255,255,255,0.12)",
        border: "none",
        cursor: "pointer",
        transition: "background 0.2s",
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span style={{
        position: "absolute",
        top: 2,
        left: 2,
        width: 18,
        height: 18,
        background: "var(--color-text-inverse)",
        borderRadius: "50%",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        transition: "transform 0.2s",
        transform: value ? "translateX(18px)" : "translateX(0)",
        display: "block",
      }} />
    </button>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        color: "var(--color-text-muted)",
        fontSize: 11,
        fontWeight: 500,
        marginBottom: 6,
        display: "block",
        fontFamily: "var(--font-body)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}>
        {label}
      </label>
      {children}
      {error && (
        <p style={{ color: "var(--color-danger, #f87171)", fontSize: 11, marginTop: 4 }}>
          {error}
        </p>
      )}
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
      if (!form.password)               e.password = "Senha obrigatória"
      else if (form.password.length < 8) e.password = "Mínimo 8 caracteres"
      else if (strength.score < 2)      e.password = "Senha muito fraca"
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

  const inputStyle = (hasError?: string): React.CSSProperties => ({
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${hasError ? "var(--color-danger, #f87171)" : "var(--color-border)"}`,
    borderRadius: "var(--border-radius)",
    padding: "8px 12px",
    color: "var(--color-text)",
    fontSize: "var(--font-size-base)",
    fontFamily: "var(--font-body)",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
  })

  const tabs = [
    { key: "info",  label: "📋 Informações" },
    { key: "senha", label: "🔑 Senha" },
    { key: "perms", label: "🔐 Permissões" },
  ] as const

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }} onClick={onClose} />
      <div style={{
        position: "relative",
        background: "var(--color-surface)",
        border: `1px solid var(--color-border)`,
        borderRadius: `calc(var(--border-radius) * 2)`,
        width: "100%",
        maxWidth: 520,
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        overflow: "hidden",
        fontFamily: "var(--font-body)",
      }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: `1px solid var(--color-border)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {form.name
              ? <Avatar name={form.name} />
              : <div style={{ width: 36, height: 36, borderRadius: "var(--border-radius)", background: "rgba(255,255,255,0.04)", border: `1px solid var(--color-border)`, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", fontSize: 18 }}>?</div>
            }
            <div>
              <h2 style={{ color: "var(--color-text)", fontWeight: 600, fontSize: "var(--font-size-base)", margin: 0, fontFamily: "var(--font-heading)" }}>
                {isNew ? "Novo usuário" : "Editar usuário"}
              </h2>
              <p style={{ color: "var(--color-text-muted)", fontSize: 11, margin: 0 }}>
                {isNew ? "Preencha os dados abaixo" : form.email}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "var(--color-text-muted)", background: "none", border: "none", fontSize: 22, cursor: "pointer", lineHeight: 1, padding: 4, transition: "color 0.2s" }}>×</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid var(--color-border)` }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1,
              padding: "10px 0",
              fontSize: 11,
              fontWeight: 500,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: tab === t.key ? "var(--color-text)" : "var(--color-text-muted)",
              position: "relative",
              transition: "color 0.2s",
              fontFamily: "var(--font-body)",
            }}>
              {t.label}
              {tab === t.key && (
                <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "var(--color-primary)", borderRadius: "2px 2px 0 0" }} />
              )}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, maxHeight: "58vh", overflowY: "auto" }}>

          {tab === "info" && <>
            <Field label="Nome completo" error={errors.name}>
              <input type="text" value={form.name ?? ""} onChange={e => set("name", e.target.value)}
                placeholder="Ex: João Silva" style={inputStyle(errors.name)} />
            </Field>

            <Field label="E-mail" error={errors.email}>
              <input type="email" value={form.email ?? ""} onChange={e => set("email", e.target.value)}
                placeholder="joao@empresa.com" style={inputStyle(errors.email)} />
            </Field>

            <Field label="Função">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {(Object.keys(ROLE_CONFIG) as Role[]).map(role => {
                  const cfg = ROLE_CONFIG[role]
                  const selected = form.role === role
                  return (
                    <button key={role} onClick={() => setRole(role)} style={{
                      padding: "8px 12px",
                      borderRadius: "var(--border-radius)",
                      border: `1px solid ${selected ? cfg.colorVar : "var(--color-border)"}`,
                      background: selected ? `color-mix(in srgb, ${cfg.colorVar} 12%, transparent)` : "rgba(255,255,255,0.02)",
                      color: selected ? cfg.colorVar : "var(--color-text-muted)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                      fontFamily: "var(--font-body)",
                    }}>
                      <div style={{ fontWeight: 600, fontSize: 12 }}>{cfg.label}</div>
                      <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>{cfg.defaultPerms.length} permissões padrão</div>
                    </button>
                  )
                })}
              </div>
            </Field>

            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(255,255,255,0.02)",
              border: `1px solid var(--color-border)`,
              borderRadius: "var(--border-radius)",
              padding: "12px 16px",
            }}>
              <div>
                <p style={{ color: "var(--color-text)", fontSize: 13, fontWeight: 500, margin: 0 }}>Conta ativa</p>
                <p style={{ color: "var(--color-text-muted)", fontSize: 11, margin: 0 }}>Usuário pode fazer login</p>
              </div>
              <Toggle value={form.active ?? true} onChange={() => set("active", !form.active)} />
            </div>
          </>}

          {tab === "senha" && <>
            {!isNew && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "rgba(255,255,255,0.02)",
                border: `1px solid var(--color-border)`,
                borderRadius: "var(--border-radius)",
                padding: "12px 16px",
              }}>
                <div>
                  <p style={{ color: "var(--color-text)", fontSize: 13, fontWeight: 500, margin: 0 }}>Alterar senha</p>
                  <p style={{ color: "var(--color-text-muted)", fontSize: 11, margin: 0 }}>
                    {user?.hasPassword ? "Possui senha — deseja redefinir?" : "Sem senha (somente OAuth)"}
                  </p>
                </div>
                <Toggle value={form.changePassword ?? false} onChange={() => set("changePassword", !form.changePassword)} />
              </div>
            )}

            {needsPwd ? <>
              <Field label={isNew ? "Senha" : "Nova senha"} error={errors.password}>
                <div style={{ position: "relative" }}>
                  <input type={showPwd ? "text" : "password"} value={form.password ?? ""}
                    onChange={e => set("password", e.target.value)} placeholder="Mínimo 8 caracteres"
                    style={{ ...inputStyle(errors.password), paddingRight: 40 }} />
                  <button onClick={() => setShowPwd(!showPwd)} style={{
                    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--color-text-muted)", fontSize: 13, padding: 0,
                  }}>
                    {showPwd ? "🙈" : "👁"}
                  </button>
                </div>

                {form.password && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                      {[1,2,3,4,5].map(i => (
                        <div key={i} style={{
                          height: 3,
                          flex: 1,
                          borderRadius: 999,
                          transition: "background 0.3s",
                          background: i <= strength.score ? strength.color : "rgba(255,255,255,0.08)",
                        }} />
                      ))}
                    </div>
                    <p style={{ fontSize: 11, color: strength.color, margin: 0 }}>{strength.label}</p>
                  </div>
                )}
              </Field>

              <Field label="Confirmar senha" error={errors.confirmPassword}>
                <div style={{ position: "relative" }}>
                  <input type={showCfm ? "text" : "password"} value={form.confirmPassword ?? ""}
                    onChange={e => set("confirmPassword", e.target.value)} placeholder="Repita a senha"
                    style={{ ...inputStyle(errors.confirmPassword), paddingRight: 40 }} />
                  <button onClick={() => setShowCfm(!showCfm)} style={{
                    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--color-text-muted)", fontSize: 13, padding: 0,
                  }}>
                    {showCfm ? "🙈" : "👁"}
                  </button>
                </div>
                {form.confirmPassword && form.password === form.confirmPassword && !errors.confirmPassword && (
                  <p style={{ color: "var(--color-success, #34d399)", fontSize: 11, marginTop: 4 }}>✓ Senhas coincidem</p>
                )}
              </Field>

              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid var(--color-border)`,
                borderRadius: "var(--border-radius)",
                padding: 12,
              }}>
                <p style={{ color: "var(--color-text-muted)", fontSize: 11, fontWeight: 600, marginBottom: 8, margin: "0 0 8px 0" }}>Requisitos:</p>
                {[
                  { label: "Mínimo 8 caracteres",      ok: (form.password?.length ?? 0) >= 8 },
                  { label: "Letra maiúscula (A-Z)",     ok: /[A-Z]/.test(form.password ?? "") },
                  { label: "Número (0-9)",              ok: /[0-9]/.test(form.password ?? "") },
                  { label: "Caractere especial (!@#$)", ok: /[^A-Za-z0-9]/.test(form.password ?? "") },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: r.ok ? "var(--color-success, #34d399)" : "rgba(255,255,255,0.2)" }}>{r.ok ? "✓" : "○"}</span>
                    <span style={{ fontSize: 11, color: r.ok ? "var(--color-text)" : "var(--color-text-muted)" }}>{r.label}</span>
                  </div>
                ))}
              </div>
            </> : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", color: "var(--color-text-muted)" }}>
                <span style={{ fontSize: 40, marginBottom: 12 }}>🔒</span>
                <p style={{ fontSize: 13, margin: 0 }}>Ative "Alterar senha" para redefinir</p>
              </div>
            )}
          </>}

          {tab === "perms" && <>
            <p style={{ color: "var(--color-text-muted)", fontSize: 11, margin: "0 0 4px 0" }}>
              Permissões de <span style={{ color: "var(--color-text)" }}>{form.name || "este usuário"}</span>.
              Trocar a função redefine para o padrão.
            </p>
            {PERMISSION_GROUPS.map(group => (
              <div key={group.group} style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid var(--color-border)`,
                borderRadius: "var(--border-radius)",
                padding: 12,
              }}>
                <p style={{ color: "var(--color-text-muted)", fontSize: 11, fontWeight: 600, margin: "0 0 8px 0" }}>{group.icon} {group.group}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                  {group.perms.map(({ key, label }) => {
                    const on = form.permissions?.includes(key) ?? false
                    return (
                      <button key={key} onClick={() => togglePerm(key)} style={{
                        padding: "6px 8px",
                        borderRadius: "var(--border-radius)",
                        border: `1px solid ${on ? "var(--color-primary)" : "var(--color-border)"}`,
                        background: on ? `color-mix(in srgb, var(--color-primary) 15%, transparent)` : "rgba(255,255,255,0.02)",
                        color: on ? "var(--color-primary)" : "var(--color-text-muted)",
                        cursor: "pointer",
                        fontSize: 11,
                        fontWeight: 500,
                        transition: "all 0.2s",
                        fontFamily: "var(--font-body)",
                      }}>
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
        <div style={{ display: "flex", gap: 8, padding: "16px 24px", borderTop: `1px solid var(--color-border)` }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "8px 0", fontSize: 13,
            color: "var(--color-text-muted)",
            background: "none",
            border: `1px solid var(--color-border)`,
            borderRadius: "var(--border-radius)",
            cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: "var(--font-body)",
          }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 1, padding: "8px 0", fontSize: 13, fontWeight: 600,
            background: saving ? "rgba(255,255,255,0.08)" : "var(--color-primary)",
            color: saving ? "var(--color-text-muted)" : "var(--color-text-inverse)",
            border: "none",
            borderRadius: "var(--border-radius)",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontFamily: "var(--font-body)",
          }}>
            {saving
              ? <><span className="theme-spinner" />Salvando…</>
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
    <tr className="users-table-row" style={{ borderBottom: `1px solid var(--color-border)` }}>
      <td style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={user.name} size="sm" />
          <div>
            <p style={{ color: "var(--color-text)", fontSize: 13, fontWeight: 500, margin: 0, fontFamily: "var(--font-body)" }}>{user.name}</p>
            <p style={{ color: "var(--color-text-muted)", fontSize: 11, margin: 0 }}>{user.email}</p>
          </div>
        </div>
      </td>
      <td style={{ padding: "12px 16px" }}>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "2px 8px",
          borderRadius: "var(--border-radius)",
          border: `1px solid ${role.colorVar}`,
          background: `color-mix(in srgb, ${role.colorVar} 12%, transparent)`,
          color: role.colorVar,
          fontSize: 11,
          fontWeight: 500,
          fontFamily: "var(--font-body)",
        }}>
          {role.label}
        </span>
      </td>
      <td style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {user.permissions.slice(0, 3).map(p => (
            <span key={p} style={{
              padding: "2px 6px",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid var(--color-border)`,
              color: "var(--color-text-muted)",
              fontSize: 10,
              borderRadius: "calc(var(--border-radius) / 2)",
              fontFamily: "var(--font-body)",
            }}>{p}</span>
          ))}
          {user.permissions.length > 3 && (
            <span style={{
              padding: "2px 6px",
              background: "rgba(255,255,255,0.04)",
              border: `1px solid var(--color-border)`,
              color: "var(--color-text-muted)",
              fontSize: 10,
              borderRadius: "calc(var(--border-radius) / 2)",
            }}>+{user.permissions.length - 3}</span>
          )}
        </div>
      </td>
      <td style={{ padding: "12px 16px" }}>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 11,
          fontWeight: 500,
          color: user.active ? "var(--color-success, #34d399)" : "var(--color-text-muted)",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: user.active ? "var(--color-success, #34d399)" : "rgba(255,255,255,0.2)",
          }} />
          {user.active ? "Ativo" : "Inativo"}
        </span>
      </td>
      <td style={{ padding: "12px 16px", fontSize: 11 }}>
        {user.emailVerified
          ? <span style={{ color: "var(--color-success, #34d399)" }}>✓ Verificado</span>
          : <span style={{ color: "var(--color-warning, #fbbf24)" }}>⚠ Pendente</span>}
      </td>
      <td style={{ padding: "12px 16px", textAlign: "center" }}>
        <span style={{ fontSize: 16, opacity: user.hasPassword ? 0.7 : 0.2 }} title={user.hasPassword ? "Tem senha" : "Sem senha"}>🔑</span>
      </td>
      <td style={{ padding: "12px 16px" }}>
        <div style={{ position: "relative", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => setMenu(!menu)}
            className="users-row-menu-btn"
            style={{
              width: 28, height: 28,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--color-text-muted)",
              background: "none",
              border: "none",
              borderRadius: "var(--border-radius)",
              cursor: "pointer",
              fontSize: 18,
              transition: "all 0.2s",
            }}>
            ⋯
          </button>
          {menu && <>
            <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setMenu(false)} />
            <div style={{
              position: "absolute", right: 0, top: 32, zIndex: 20,
              background: "var(--color-surface)",
              border: `1px solid var(--color-border)`,
              borderRadius: `calc(var(--border-radius) * 1.5)`,
              boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
              padding: "4px 0",
              minWidth: 160,
              fontFamily: "var(--font-body)",
            }}>
              {[
                { icon: "✏️", label: "Editar",     action: () => { onEdit(user); setMenu(false) }, danger: false },
                { icon: user.active ? "🚫" : "✅", label: user.active ? "Desativar" : "Ativar", action: () => { onToggle(user.id); setMenu(false) }, danger: false },
              ].map(item => (
                <button key={item.label} onClick={item.action} style={{
                  width: "100%", padding: "8px 12px", textAlign: "left",
                  fontSize: 13,
                  color: "var(--color-text-muted)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "var(--font-body)",
                }}>
                  {item.icon} {item.label}
                </button>
              ))}
              <div style={{ margin: "4px 0", borderTop: `1px solid var(--color-border)` }} />
              <button onClick={() => { onDelete(user.id); setMenu(false) }} style={{
                width: "100%", padding: "8px 12px", textAlign: "left",
                fontSize: 13,
                color: "var(--color-danger, #f87171)",
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "var(--font-body)",
              }}>
                🗑 Excluir
              </button>
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
    <div style={{
      minHeight: "100vh",
      background: "var(--color-background)",
      color: "var(--color-text)",
      fontFamily: "var(--font-body)",
    }}>
      {/*
        ─────────────────────────────────────────────────────────
        Scoped styles: apenas animações e hover states que não
        podem ser feitos inline. Todas as cores vêm das CSS vars
        geradas por generateCSSVariables() no theme-repository.
        ─────────────────────────────────────────────────────────
      */}
      <style>{`
        @keyframes theme-spin { to { transform: rotate(360deg); } }

        .theme-spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: var(--color-text-inverse);
          border-radius: 50%;
          animation: theme-spin 0.7s linear infinite;
        }

        .users-table-row {
          transition: background 0.15s;
        }
        .users-table-row:hover {
          background: rgba(255,255,255,0.015);
        }
        .users-table-row:hover .users-row-menu-btn {
          opacity: 1 !important;
        }
        .users-row-menu-btn {
          opacity: 0;
        }
        .users-row-menu-btn:hover {
          background: rgba(255,255,255,0.06) !important;
          color: var(--color-text) !important;
        }

        input:focus {
          border-color: var(--color-primary) !important;
        }
        input::placeholder {
          color: var(--color-text-muted);
          opacity: 0.5;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb {
          background: var(--color-border);
          border-radius: 2px;
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 16, right: 16, zIndex: 60,
          border: `1px solid ${toast.type === "ok" ? "var(--color-border)" : "rgba(248,113,113,0.35)"}`,
          background: toast.type === "ok" ? "var(--color-surface)" : "rgba(127,29,29,0.8)",
          color: toast.type === "ok" ? "var(--color-text)" : "#fca5a5",
          fontSize: 13,
          padding: "10px 16px",
          borderRadius: "var(--border-radius)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--font-body)",
        }}>
          <span>{toast.type === "ok" ? "✓" : "✕"}</span> {toast.msg}
        </div>
      )}

      {modal.open && (
        <UserModal user={modal.user} onClose={() => setModal({ open: false, user: null })} onSave={handleSave} saving={saving} />
      )}

      <div style={{ maxWidth: "var(--container-width)", margin: "0 auto", padding: "40px 24px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <p style={{
              color: "var(--color-text-muted)",
              fontSize: 10,
              fontFamily: "var(--font-body)",
              marginBottom: 4,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              margin: "0 0 4px 0",
            }}>
              Auth.js · Neon DB
            </p>
            <h1 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--font-size-h2)",
              fontWeight: "var(--heading-weight)" as React.CSSProperties["fontWeight"],
              color: "var(--color-text)",
              margin: "0 0 4px 0",
              letterSpacing: "var(--letter-spacing)",
              lineHeight: "var(--line-height)",
            }}>
              Gerenciamento de Usuários
            </h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: 13, margin: 0 }}>
              Cadastre, edite e gerencie permissões do sistema
            </p>
          </div>
          <button
            onClick={() => setModal({ open: true, user: null })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "var(--color-primary)",
              color: "var(--color-text-inverse)",
              fontSize: 13,
              fontWeight: 600,
              padding: "9px 18px",
              borderRadius: "var(--border-radius)",
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.2s, transform 0.15s",
              fontFamily: "var(--font-body)",
              boxShadow: `0 4px 16px color-mix(in srgb, var(--color-primary) 35%, transparent)`,
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Novo usuário
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total",           value: stats.total,      icon: "👥", color: "var(--color-text)" },
            { label: "Ativos",          value: stats.active,     icon: "✅", color: "var(--color-success, #34d399)" },
            { label: "Admins",          value: stats.admins,     icon: "🛡",  color: "var(--color-danger, #f87171)" },
            { label: "Não verificados", value: stats.unverified, icon: "⚠️", color: "var(--color-warning, #fbbf24)" },
          ].map(s => (
            <div key={s.label} style={{
              background: "var(--color-surface)",
              border: `1px solid var(--color-border)`,
              borderRadius: "var(--border-radius)",
              padding: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <p style={{ color: "var(--color-text-muted)", fontSize: 11, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                <span style={{ fontSize: 14 }}>{s.icon}</span>
              </div>
              <p style={{ fontSize: 26, fontWeight: 700, color: s.color, margin: 0, fontFamily: "var(--font-heading)", lineHeight: 1 }}>
                {loading ? "—" : s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", fontSize: 13 }}>🔍</span>
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%",
                background: "var(--color-surface)",
                border: `1px solid var(--color-border)`,
                borderRadius: "var(--border-radius)",
                padding: "8px 16px 8px 36px",
                fontSize: 13,
                color: "var(--color-text)",
                outline: "none",
                transition: "border-color 0.2s",
                fontFamily: "var(--font-body)",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["all", ...Object.keys(ROLE_CONFIG)] as (Role | "all")[]).map(r => {
              const isActive = filterRole === r
              return (
                <button key={r} onClick={() => setFilterRole(r)} style={{
                  padding: "7px 14px",
                  borderRadius: "var(--border-radius)",
                  border: `1px solid ${isActive ? "var(--color-primary)" : "var(--color-border)"}`,
                  background: isActive ? "var(--color-primary)" : "var(--color-surface)",
                  color: isActive ? "var(--color-text-inverse)" : "var(--color-text-muted)",
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "var(--font-body)",
                }}>
                  {r === "all" ? "Todos" : ROLE_CONFIG[r].label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Table */}
        <div style={{
          background: "var(--color-surface)",
          border: `1px solid var(--color-border)`,
          borderRadius: `calc(var(--border-radius) * 2)`,
          overflow: "hidden",
        }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 0", gap: 10, color: "var(--color-text-muted)", fontSize: 13 }}>
              <span className="theme-spinner" />
              Carregando usuários…
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid var(--color-border)` }}>
                  {["Usuário","Função","Permissões","Status","E-mail","Senha",""].map(h => (
                    <th key={h} style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 10,
                      fontWeight: 600,
                      color: "var(--color-text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontFamily: "var(--font-body)",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} style={{ padding: "48px 16px", textAlign: "center", color: "var(--color-text-muted)", fontSize: 13 }}>
                        Nenhum usuário encontrado
                      </td>
                    </tr>
                  )
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
          <div style={{
            padding: "12px 16px",
            borderTop: `1px solid var(--color-border)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <p style={{ color: "var(--color-text-muted)", fontSize: 11, margin: 0 }}>
              Mostrando {filtered.length} de {users.length} usuários
            </p>
            <p style={{ color: "var(--color-text-muted)", fontSize: 11, margin: 0, opacity: 0.5, fontFamily: "var(--font-body)" }}>
              users · accounts · sessions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}