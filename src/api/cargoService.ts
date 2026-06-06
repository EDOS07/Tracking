
export const cargoService = {

  async getUpcomingOrders() {
    const response = await fetch('https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io/orders/upcoming');
    if (!response.ok) throw new Error('Error de red');
    return await response.json();
  },

async getOrderDetail() {
    const response = await fetch('https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io/orders');
    if (!response.ok) throw new Error('Error al obtener detalle');
    return await response.json();
  }
};