import React from 'react';
import Swal from 'sweetalert2';

const Alert = {
  success: (message) => {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: message,
    });
  },
  error: (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: message,
    });
  },
};

export default Alert;
