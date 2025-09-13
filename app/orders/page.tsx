import CreateOrderForm from '@/components/Order/CreateOrderForm';
import OrderList from '@/components/Order/OrderList';

export default function OrdersPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#ffd215]">Orders</h1>
      <CreateOrderForm />
      <OrderList />
    </div>
  );
}