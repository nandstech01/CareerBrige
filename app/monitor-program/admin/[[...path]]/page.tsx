import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ path?: string[] }>
}

export default async function MonitorAdminRedirect({ params }: Props) {
  const { path } = await params

  const subpath = path?.join('/') || ''

  // Map old monitor-program/admin paths to new admin paths
  const pathMap: Record<string, string> = {
    '': '/admin/dashboard',
    'dashboard': '/admin/dashboard',
    'logs': '/admin/logs',
  }

  const destination = pathMap[subpath] || `/admin/monitor/${subpath}`
  redirect(destination)
}
