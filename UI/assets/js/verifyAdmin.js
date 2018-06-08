if (decoded.role !== 'admin') {
  alert('You are not authorized to perform this action');
  window.location.replace('/dashboard');
}
