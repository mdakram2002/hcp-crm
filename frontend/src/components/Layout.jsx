import { Outlet } from 'react-router-dom'
import AppLayout from './layout/AppLayout'

export default function Layout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}