// Constructor de objetos productos del carrito
class Producto {
  constructor(id, nombre, imagen, precio) {
    this.id = id;
    this.nombre = nombre;
    this.imagen = imagen;
    this.precio = precio;
  }
}

//Creo el stock trayendo los datos de un JSON

let stock = [];
let carrito = [];
const urlProductos = "./productos.json";
const contador = document.getElementById("cart-counter");
const envios = document.getElementById("envios");
const vaciarCar = document.querySelector("#clear");
const finalizarCompra = document.getElementById("comprar");
const busqueda = document.querySelector (".search");

fetch(urlProductos)
  .then((response) => response.json())
  .then((data) => {
    stock = data;
    mostrarStock();
  });

//Creo la vista de los productos en stock

function mostrarStock() {
  // Fila de tres tarjetas de productos
  for (let i = 0; i < 6; i++) {
    let tarjeta = document.createElement("div");
    tarjeta.setAttribute("class", "card col-sm-12 col-md-2");
    if (stock[i]) {
      tarjeta.innerHTML = `
            <img class="card-img-top img" src=${
              stock[i].imagen
            } alt="Card image">
            <div class="card-body">
                <h4 class="card-title">${stock[i].nombre}</h4>
                <p class="card-text">Precio $${stock[i].precio}</p>
                <button 
                    class="btn btn-card" 
                    data-id=${stock[i].id}
                    data-nombre=${stock[i].nombre.replaceAll(
                      " ",
                      "_"
                    )} // Reemplazamos los espacios en blanco para evitar errores
                    data-precio=${stock[i].precio} 
                    data-imagen=${stock[i].imagen} 
                    onclick="agregarProducto(event)"
                >Comprar</button>
            </div>
            `;
    }
    // Enviamos cada tarjeta al HTML
    document.getElementById("cards").appendChild(tarjeta);
  }
}

// Si hay carrito en el localStorage lo carga y lo muestra
if (localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"));
  mostrarCarrito();
}

// Creo la función para la vista del carrito en el HTML

function mostrarCarrito() {
  let acumuladorCarritoHTML = ``;

  for (let i = 0; i < carrito.length; i++) {
    let template = `
        <div class="card-carrito">
            <img class="card-img-top img-carrito" src=${
              carrito[i].imagen
            } alt="Card image">
            <div class="card-body">
                <h4 class="card-title">${carrito[i].nombre.replaceAll(
                  "_",
                  " "
                )}</h4> <!--Recuperamos los espacios en blanco-->
                <p class="card-text">Cantidad: ${carrito[i].cantidad}</p>
                <button class="btn btn-card" onclick="decrementar('${
                  carrito[i].id
                }')">-</button>
                <button class="btn btn-card" onclick="incrementar('${
                  carrito[i].id
                }')">+</button>
                <p class="card-text">Precio $${
                  carrito[i].precio * carrito[i].cantidad
                }</p>
                <button 
                class="btn btn-card"  
                onclick="eliminarProducto('${carrito[i].id}')"
                >Eliminar</button>
            </div>
        </div>
        `;

    acumuladorCarritoHTML += template;
  }

  document.querySelector("#cart").innerHTML = acumuladorCarritoHTML;
  // Guardamos el estado del carrito en el localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para agregar productos al carrito
function agregarProducto(event) {
  let encontrado = carrito.findIndex(
    (item) => item.id == event.target.dataset.id
  );
  if (encontrado == -1) {
    let productoElegido = new Producto(
      event.target.dataset.id,
      event.target.dataset.nombre,
      event.target.dataset.imagen,
      event.target.dataset.precio
    );
    productoElegido.cantidad = 1;
    carrito.push(productoElegido);
    contador.innerHTML = carrito.length;
      
  } else {
    carrito[encontrado].cantidad += 1;
  }

  mostrarCarrito();
  actualizarTotal();
 
  Swal.fire({
    position: 'center',
    title: `Se agregó ${event.target.dataset.nombre.replaceAll( "_", " ")}`,
    showConfirmButton: false,
    timer: 1500,
    customClass: "sweetAlert"
})

}

// Función para eliminar un producto del carrito
function eliminarProducto(id) {
  let encontrado = carrito.findIndex((item) => item.id == id);
  carrito.splice(encontrado, 1);
  contador.innerHTML = carrito.length;

  mostrarCarrito();
  actualizarTotal();
}

// Función para vaciar el carrito
function vaciarCarrito() {
  carrito = [];
  contador.innerHTML = carrito.length;
  mostrarCarrito();
  actualizarTotal();

}
vaciarCar.addEventListener("click", vaciarCarrito);

// Función para incrmentar la cantidad de un producto en el carrito
function incrementar(id) {
  let encontrado = carrito.findIndex((item) => item.id == id);
  carrito[encontrado].cantidad += 1;
  mostrarCarrito();
  actualizarTotal();
}

// Función para decrementar la cantidad de un producto en el carrito
function decrementar(id) {
  let encontrado = carrito.findIndex((item) => item.id == id);
  if (carrito[encontrado].cantidad > 1) carrito[encontrado].cantidad -= 1;
  mostrarCarrito();
  actualizarTotal();
}

// Función para actualizar el total del carrito
function actualizarTotal() {
  let total = 0;
  carrito.forEach((item) => (total += item.cantidad * item.precio));
  document.querySelector("#total").innerHTML = "Total: $" + total;
}

//Función para finalizar compra con Sweet Alert

finalizarCompra.addEventListener('click', () => {
 
  Swal.fire({
      title: 'Está seguro de finalizar su compra?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, estoy seguro',
      cancelButtonText: 'No, no quiero seguir comprando'
  }).then((result) => {

      if (result.isConfirmed) {
          Swal.fire({
              title: '¡Gracias por comprar en Teka!',
              icon: 'success',
              text: 'Su compra finalizó con éxito'
          })
      }
  })
})


  