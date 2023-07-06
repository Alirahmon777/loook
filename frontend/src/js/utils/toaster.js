export function toaster(type, message) {
  const toaster = document.querySelector('.toaster');
  const toasterText = document.querySelector('.toaster-text');
  const toastClass =
    'absolute top-2 text-center right-5 px-6 z-10 py-4 rounded-lg';

  console.log(toaster);
  console.log('ok');

  toaster.className +=
    type == 'success'
      ? ` ${toastClass} block bg-green-400`
      : ` ${toastClass} block bg-red-400`;
  toasterText.textContent = message;

    setTimeout(() => (toaster.className += ' hidden'), 3000);
}
