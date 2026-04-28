import { CartItem } from "@/store/useCartStore";

export const generateWhatsAppLink = (cartItems: CartItem[], userDetails: { name: string; address: string; phone?: string }) => {
  const phone = "918157858977"; // Updated business number
  let message = `*New Order from Website*\n\n`;
  
  cartItems.forEach(item => {
    message += `• ${item.name} (${item.weight}) x ${item.quantity} - ₹${item.price * item.quantity}\n`;
  });
  
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  message += `\n*Total: ₹${total}*`;
  message += `\n\n*Customer Details:*`;
  message += `\nName: ${userDetails.name}`;
  message += `\nAddress: ${userDetails.address}`;
  if (userDetails.phone) {
    message += `\nPhone: ${userDetails.phone}`;
  }
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

export const sendWhatsAppOrder = (productName: string, variant: string, price: number) => {
  const phoneNumber = "918157858977"; // Your business number
  const message = `Hi! I want to order:
*Product:* ${productName}
*Size:* ${variant}
*Price:* ₹${price}

Please let me know the payment details and delivery time.`;

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
};

export const sendWhatsAppCartOrder = (cartItems: CartItem[], totalPrice: number, userDetails: { name: string; address: string; phone: string }) => {
  const businessPhoneNumber = "918157858977"; // Updated business number
  
  const itemsText = cartItems.map((item, index) => (
    `${index + 1}. *${item.name}*\n   Size: ${item.weight}\n   Qty: ${item.quantity} x ₹${item.price} = ₹${(item.quantity * item.price).toFixed(2)}`
  )).join('\n\n');

  const message = `*NEW WEBSITE ORDER*\n
--------------------------
${itemsText}
--------------------------
*Total Amount: ₹${totalPrice.toFixed(2)}*

*CUSTOMER DETAILS:*
*Name:* ${userDetails.name}
*Address:* ${userDetails.address}
*WhatsApp:* ${userDetails.phone}

Please confirm this order and share the payment details.`;

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${businessPhoneNumber}?text=${encodedMessage}`, '_blank');
};
