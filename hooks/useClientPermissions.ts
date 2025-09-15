import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface ClientPermission {
	id: string;
	user_id: string;
	can_order_without_payment: boolean;
	credit_limit: number;
	granted_by: string;
	granted_at: string;
	expires_at?: string;
	is_active: boolean;
	notes?: string;
}

export const useClientPermissions = () => {
	const { user } = useAuth();
	const [permissions, setPermissions] = useState<ClientPermission | null>(null);
	const [canOrderWithoutPayment, setCanOrderWithoutPayment] = useState(false);
	const [loading, setLoading] = useState(true);

		const checkPermissions = async () => {
			// Mock permissions logic only
			await new Promise(res => setTimeout(res, 300));
			setCanOrderWithoutPayment(true);
			setPermissions({
				id: 'mock-perm',
				user_id: user?.id || 'mock-user',
				can_order_without_payment: true,
				credit_limit: 1000,
				granted_by: 'admin',
				granted_at: new Date().toISOString(),
				is_active: true,
				notes: 'Mock permission',
			});
			setLoading(false);
		};

	useEffect(() => {
		checkPermissions();
	}, [user]);

	return {
		permissions,
		canOrderWithoutPayment,
		loading,
		refreshPermissions: checkPermissions
	};
};