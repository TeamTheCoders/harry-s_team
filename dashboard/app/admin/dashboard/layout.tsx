'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '🏠' },
    { name: 'Hero Images', href: '/admin/hero-images', icon: '🖼️' },
    { name: 'Team Members', href: '/admin/team-members', icon: '👥' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    window.location.href = '/admin/login';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-white shadow-md min-h-screen">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <div
                        className={`flex items-center p-3 rounded-md ${
                          pathname === item.href
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="mr-3 text-lg">{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="absolute bottom-0 w-64 p-4 border-t">
              <Button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <header className="bg-white shadow">
              <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {pathname.includes('dashboard') && 'Dashboard'}
                    {pathname.includes('hero-images') && 'Hero Images Management'}
                    {pathname.includes('team-members') && 'Team Members Management'}
                  </h1>
                  <nav className="text-sm mt-1 text-gray-500">
                    <ol className="list-none p-0 inline-flex">
                      <li className="after:content-['/'] after:ml-2 after:text-gray-400">
                        <Link href="/admin/dashboard" className="text-blue-500 hover:underline">
                          Home
                        </Link>
                      </li>
                      {pathname.includes('hero-images') && (
                        <li className="after:content-['/'] after:ml-2 after:text-gray-400">
                          <span>Hero Images</span>
                        </li>
                      )}
                      {pathname.includes('team-members') && (
                        <li className="after:content-['/'] after:ml-2 after:text-gray-400">
                          <span>Team Members</span>
                        </li>
                      )}
                    </ol>
                  </nav>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Admin User</span>
                </div>
              </div>
            </header>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <Card>
                <CardContent className="p-6">
                  {children}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}