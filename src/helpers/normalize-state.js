export function normalizeState(state, profile = {}) {
  const base = state || {};
  return {
    workshop: {
      id: base.workshop?.id || 'ws-001',
      name: base.workshop?.name || 'Mi Taller Pro',
      phone: base.workshop?.phone || profile.phoneNumber || '+50255554444',
      logoUrl: base.workshop?.logoUrl || null,
      currency: ['GTQ', 'USD'].includes(base.workshop?.currency) ? base.workshop.currency : 'GTQ'
    },
    customers: Array.isArray(base.customers) ? base.customers.map((customer) => ({ id: customer.id, name: customer.name || '', phone: customer.phone || '' })) : [],
    orders: Array.isArray(base.orders) ? base.orders.map((order) => ({
      id: order.id,
      vehiclePlate: order.vehiclePlate || '',
      brandAndModel: order.brandAndModel || '',
      customerId: order.customerId || '',
      customerName: order.customerName || '',
      customerPhone: order.customerPhone || '',
      status: order.status || 'RECEIVED',
      paymentStatus: order.paymentStatus || 'PENDING',
      entryReason: order.entryReason || '',
      items: Array.isArray(order.items) ? order.items.map((item) => ({ id: item.id, description: item.description || '', price: Number(item.price || 0), cost: Number(item.cost || 0) })) : [],
      photos: Array.isArray(order.photos) ? order.photos.filter(Boolean) : [],
      total: Number(order.total || 0),
      amountPaid: Number(order.amountPaid || 0),
      receivedAt: Number(order.receivedAt || Date.now()),
      completedAt: order.completedAt ? Number(order.completedAt) : null,
      deliveredAt: order.deliveredAt ? Number(order.deliveredAt) : null
    })) : []
  };
}
