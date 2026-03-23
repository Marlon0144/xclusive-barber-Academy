import { redirect } from 'next/navigation'
import { Users, KeyRound, ShieldCheck } from 'lucide-react'
import DashboardPageHeader from '@/components/headers/DashboardPageHeader'
import { DashboardFooter } from '@/components/dashboard/DashboardFooter'
import { createAdminClient, createClient } from '@/utils/supabase/server'
import {
  createInviteCodeAction,
  deleteInvitationAction,
  deleteUserAction,
  toggleInviteStatusAction,
  updateUserRoleAction,
} from './actions'
import { ActionLockProvider, LockedActionForm } from './action-lock'
import CopyInviteButton from './CopyInviteButton'

type UserRole = 'admin' | 'instructor' | 'student'

type InvitationRow = {
  id: string
  code: string
  is_active: boolean
  used_count: number
  max_uses: number
  role_to_assign: UserRole
}

type ProfileRow = {
  id: string
  full_name: string | null
  role: UserRole
  created_at: string
}

const ROLE_OPTIONS: UserRole[] = ['student', 'instructor', 'admin']

function formatDate(dateValue: string) {
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return '-'

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed)
}

export default async function GestionUsersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-10 text-center bg-black">
        <div className="max-w-md space-y-4">
          <div className="text-red-500 text-6xl">!</div>
          <h1 className="text-3xl font-serif text-white">Acceso Restringido</h1>
          <p className="text-zinc-500">
            Esta zona esta reservada exclusivamente para administradores.
          </p>
          <a href="/dashboard" className="text-gold-500 hover:underline block mt-4 text-sm uppercase tracking-widest">
            Volver al Dashboard
          </a>
        </div>
      </div>
    )
  }

  const supabaseAdmin = createAdminClient()

  const [invitationsResult, usersResult, authUsersResult] = await Promise.all([
    supabaseAdmin
      .from('invitations')
      .select('id, code, is_active, used_count, max_uses, role_to_assign')
      .order('id', { ascending: false }),
    supabaseAdmin
      .from('profiles')
      .select('id, full_name, role, created_at')
      .order('created_at', { ascending: false }),
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ])

  const invitations = (invitationsResult.data ?? []) as InvitationRow[]
  const users = (usersResult.data ?? []) as ProfileRow[]
  const authUsers = authUsersResult.data.users ?? []
  const emailById = new Map(authUsers.map((authUser) => [authUser.id, authUser.email ?? '-']))

  return (
    <ActionLockProvider>
      <DashboardPageHeader title="Gestion de Usuarios" />
      <div className="min-h-screen px-4 py-6 md:p-8 max-w-6xl mx-auto space-y-8 md:space-y-12">
        <header className="relative border-b border-white/10 pb-6 md:pb-8">
          <div className="relative z-10">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
              <h2 className="text-red-500 text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold">
                Panel de Administracion
              </h2>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-white mb-3 md:mb-4">
              Gestion de usuarios e invitaciones
            </h1>
            <p className="text-zinc-400 max-w-2xl text-sm md:text-lg font-light">
              Genera codigos de invitacion aleatorios de un solo uso y administra los roles de los usuarios de la academia.
            </p>
          </div>
        </header>

        <section className="border border-white/10 bg-[#121212]/90 rounded-sm p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#d3cbba] uppercase tracking-[0.18em] text-xs md:text-sm">
            <KeyRound className="w-4 h-4 text-gold-500" />
            Crear codigo de invitacion
          </div>
          <LockedActionForm action={createInviteCodeAction} className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4">
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.14em] text-zinc-400">
              Rol a asignar
              <select
                name="role_to_assign"
                defaultValue="student"
                className="h-10 rounded-sm border border-white/15 bg-black px-3 text-sm text-zinc-100"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.14em] text-zinc-400">
              Cantidad de usos
              <input
                name="max_uses"
                type="number"
                min={1}
                max={50}
                step={1}
                defaultValue={1}
                className="h-10 w-[150px] rounded-sm border border-white/15 bg-black px-3 text-sm text-zinc-100"
              />
            </label>

            <button
              type="submit"
              className="h-10 px-4 md:px-6 rounded-sm bg-gold-500 text-black font-bold uppercase tracking-[0.14em] text-xs hover:bg-gold-300 transition-colors"
            >
              Generar codigo unico
            </button>
          </LockedActionForm>
          <p className="text-xs text-zinc-500">
            Define cuantos usos tendra cada codigo (minimo 1, maximo 50).
          </p>
        </section>

        <section className="border border-white/10 bg-[#121212]/90 rounded-sm p-4 md:p-6 space-y-4 overflow-x-auto">
          <div className="flex items-center gap-2 text-[#d3cbba] uppercase tracking-[0.18em] text-xs md:text-sm">
            <KeyRound className="w-4 h-4 text-gold-500" />
            Inventario de invitaciones
          </div>
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-[0.12em] text-xs">
                <th className="py-3 pr-3">Codigo</th>
                <th className="py-3 pr-3">Rol</th>
                <th className="py-3 pr-3">Uso</th>
                <th className="py-3 pr-3">Estado</th>
                <th className="py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invitations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500">
                    Aun no hay invitaciones creadas.
                  </td>
                </tr>
              ) : (
                invitations.map((invite) => {
                  const exhausted = invite.used_count >= invite.max_uses

                  return (
                    <tr key={invite.id} className="border-b border-white/5 align-top">
                      <td className="py-3 pr-3 font-mono text-gold-300">{invite.code}</td>
                      <td className="py-3 pr-3 uppercase text-zinc-300">{invite.role_to_assign}</td>
                      <td className="py-3 pr-3 text-zinc-300">
                        {invite.used_count}/{invite.max_uses}
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs uppercase tracking-[0.08em] border ${
                            exhausted
                              ? 'text-zinc-300 border-zinc-600 bg-zinc-800/50'
                              : invite.is_active
                                ? 'text-green-300 border-green-700/50 bg-green-900/20'
                                : 'text-yellow-300 border-yellow-700/50 bg-yellow-900/20'
                          }`}
                        >
                          {exhausted ? 'usado' : invite.is_active ? 'activo' : 'inactivo'}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <CopyInviteButton code={invite.code} />
                          {!exhausted && (
                            <LockedActionForm action={toggleInviteStatusAction}>
                              <input type="hidden" name="invite_id" value={invite.id} />
                              <input type="hidden" name="next_active" value={String(!invite.is_active)} />
                              <button
                                type="submit"
                                className="h-8 px-3 rounded-sm border border-white/15 text-xs uppercase tracking-[0.12em] text-zinc-200 hover:bg-white/5"
                              >
                                {invite.is_active ? 'Desactivar' : 'Activar'}
                              </button>
                            </LockedActionForm>
                          )}
                          <LockedActionForm action={deleteInvitationAction}>
                            <input type="hidden" name="invite_id" value={invite.id} />
                            <button
                              type="submit"
                              className="h-8 px-3 rounded-sm border border-red-700/60 text-xs uppercase tracking-[0.12em] text-red-200 hover:bg-red-950/40"
                            >
                              Eliminar
                            </button>
                          </LockedActionForm>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </section>

        <section className="border border-white/10 bg-[#121212]/90 rounded-sm p-4 md:p-6 space-y-4 overflow-x-auto">
          <div className="flex items-center gap-2 text-[#d3cbba] uppercase tracking-[0.18em] text-xs md:text-sm">
            <Users className="w-4 h-4 text-gold-500" />
            Usuarios y roles
          </div>
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-[0.12em] text-xs">
                <th className="py-3 pr-3">Nombre</th>
                <th className="py-3 pr-3">Email</th>
                <th className="py-3 pr-3">Rol actual</th>
                <th className="py-3 pr-3">Creado</th>
                <th className="py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500">
                    No hay perfiles registrados.
                  </td>
                </tr>
              ) : (
                users.map((platformUser) => (
                  <tr key={platformUser.id} className="border-b border-white/5 align-top">
                    <td className="py-3 pr-3 text-zinc-200">{platformUser.full_name ?? 'Sin nombre'}</td>
                    <td className="py-3 pr-3 text-zinc-400">{emailById.get(platformUser.id) ?? '-'}</td>
                    <td className="py-3 pr-3 uppercase text-zinc-200">{platformUser.role}</td>
                    <td className="py-3 pr-3 text-zinc-400">{formatDate(platformUser.created_at)}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <LockedActionForm
                          action={updateUserRoleAction}
                          className="flex items-center gap-2"
                        >
                          <input type="hidden" name="user_id" value={platformUser.id} />
                          <select
                            name="role"
                            defaultValue={platformUser.role}
                            className="h-9 rounded-sm border border-white/15 bg-black px-2 text-xs uppercase tracking-[0.08em] text-zinc-100"
                          >
                            {ROLE_OPTIONS.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            className="h-9 px-3 rounded-sm bg-[#1f3b2f] text-zinc-100 border border-[#2d5b45] text-xs uppercase tracking-[0.12em] hover:bg-[#28513d]"
                          >
                            Guardar
                          </button>
                        </LockedActionForm>
                        <LockedActionForm action={deleteUserAction}>
                          <input type="hidden" name="user_id" value={platformUser.id} />
                          <button
                            type="submit"
                            className="h-9 px-3 rounded-sm border border-red-700/60 text-red-200 text-xs uppercase tracking-[0.12em] hover:bg-red-950/40"
                          >
                            Eliminar
                          </button>
                        </LockedActionForm>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>
      <DashboardFooter tagline="Control de acceso y roles del sistema." />
    </ActionLockProvider>
  )
}
