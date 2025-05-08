import { getServerSession } from 'next-auth/next'
import { buildAuthOptions } from '@/lib/auth/options'
import SignOutButton from '@/components/auth/SignOutButton'

export default async function DashboardPage() {
    const session = await getServerSession(buildAuthOptions())
    return (
        <div>
            <h1>Dashboard</h1>
            <p>This is the dashboard page.</p>
            {session && <SignOutButton />}
        </div>
    );
}
