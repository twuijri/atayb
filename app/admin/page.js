import { redirect } from 'next/navigation';

export default function AdminPage() {
    // Middleware handles protection now. 
    // If we reached here, we are authorized (or it's unprotected layout).
    // But usually /admin/dashboard is the goal.
    redirect('/admin/dashboard');
}
