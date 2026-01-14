import Swal from 'sweetalert2';

const baseOptions = {
  background: '#0b0b0b',
  color: '#fff',
  showClass: { popup: 'swal2-noanimation' },
  hideClass: { popup: 'swal2-noanimation' },
  allowEscapeKey: true,
  allowOutsideClick: true,
  buttonsStyling: false,
};

export const confirm = (options = {}) =>
  Swal.fire({ icon: 'warning', ...baseOptions, ...options });

export const swalSuccess = (options = {}) =>
  Swal.fire({ icon: 'success', showConfirmButton: false, timer: 1200, ...baseOptions, ...options });

export const swalError = (options = {}) => {
  const opts = {
    icon: 'error',
    title: options.title || 'Lỗi',
    text: options.text || '',
    showConfirmButton: true,
    confirmButtonText: options.confirmButtonText || 'OK',
    showCloseButton: true,
    focusConfirm: true,
    allowEscapeKey: true,
    allowOutsideClick: true,
    didOpen: () => {
      try {
        // ensure confirm button is enabled, clickable and will close the modal
        const btn = Swal.getConfirmButton();
        if (btn) {
          btn.disabled = false;
          btn.style.pointerEvents = 'auto';
          btn.removeAttribute('disabled');
          btn.focus();
          btn.addEventListener('click', () => { try { Swal.close(); } catch (e) {} }, { once: true });
        }

        // backdrop click fallback
        const container = document.querySelector('.swal2-container');
        if (container) {
          const handler = (ev) => {
            if (ev.target && ev.target.classList && ev.target.classList.contains('swal2-container')) {
              try { Swal.close(); } catch (e) {}
              container.removeEventListener('click', handler);
            }
          };
          container.addEventListener('click', handler);
        }
      } catch (e) {}
    },
    timer: options.timer ?? 1500,
    ...baseOptions,
    ...options,
  };
  try { Swal.close(); } catch (e) {}
  return Swal.fire(opts);
};

export default Swal;
