export async function sendOrderWhatsApp(cart, total){
const items = cart.map(i=> `${i.title} (x${i.quantity||1})`).join(', ')
const text = encodeURIComponent(`Hola! Quiero comprar: ${items}. Total: $${total}`)
const url = `https://wa.me/5491123558308?text=${text}`
window.open(url, '_blank')
return { ok: true }
}


// placeholders para futuras funciones con API/MySQL
export async function fetchProducts(){ return Promise.resolve([]) }
export async function sendOrderToAPI(order){ return Promise.resolve({ok:true, id: Math.floor(Math.random()*100000)}) }