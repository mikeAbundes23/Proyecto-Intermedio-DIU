import Swal from "sweetalert2";

class SwalMessages {
  constructor() {
    this.confirmMessage = async () => {
      return await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
        customClass: {
          title: 'swal-title',
          icon: 'swal-icon',
          confirmButton: 'btn btn-danger me-3',
          cancelButton: 'btn btn-primary'
        },
        buttonsStyling: false
      });
    };
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