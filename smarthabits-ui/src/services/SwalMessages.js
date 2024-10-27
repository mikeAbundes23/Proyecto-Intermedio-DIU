import Swal from "sweetalert2";

class SwalMessages {
  constructor() {
    this.confirmMessage = Swal.mixin({
      customClass: {
        title: 'swal-title',
        icon: 'swal-icon',
        confirmButton: 'btn btn-primary swal-confirm-button',
        cancelButton: 'btn btn-danger swal-cancel-button',
      },
      buttonsStyling: false
    });
  }
    
  // show confirmation message
  successMessage(message) {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      toast: true,
      text: message,
      background: '#E8F8F8',
      showConfirmButton: false,
      timer: 4000
    });
  }
   
  // show error message
  errorMessage(message) {
    if (message === null) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        toast: true,
        text: "No se pudieron obtener los datos",
        background: '#F8E8F8',
        showConfirmButton: false,
        timer: 4000
      });
    } else if (message === "FORBIDDEN") {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        toast: true,
        text: "Inicia sesión para realizar esta acción",
        background: '#F8E8F8',
        showConfirmButton: false,
        timer: 4000
      });
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        toast: true,
        text: message,
        background: '#F8E8F8',
        showConfirmButton: false,
        timer: 4000
      });
    }
  }
}

// Creamos una instancia con nombre
const swalMessages = new SwalMessages();

// Exportamos la instancia
export default swalMessages;