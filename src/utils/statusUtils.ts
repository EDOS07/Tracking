export const buildTimeline = (status: number) => [
  { title: 'Created Order', isCompleted: status >= 0 },
  { title: 'Accepted Order', isCompleted: status >= 1 },
  { title: 'Pickup Started', isCompleted: status >= 2 },
  { title: 'Pickup Completed', isCompleted: status >= 3 },
  { title: 'Out for Delivery', isCompleted: status >= 4 },
  { title: 'Delivery Completed', isCompleted: status >= 5 },
  { title: 'Order Completed', isCompleted: status >= 6 }
];