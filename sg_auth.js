// Simple local user store for demo (in-memory, not production)
const users = JSON.parse(localStorage.getItem('sg_users') || '{}');
let currentUser = JSON.parse(localStorage.getItem('sg_current_user') || 'null');

function saveUsers() {
  localStorage.setItem('sg_users', JSON.stringify(users));
}
function saveCurrentUser() {
  localStorage.setItem('sg_current_user', JSON.stringify(currentUser));
}

function showSignInModal() {
  document.getElementById('signInModal').style.display = 'flex';
  showSignInTab('signin');
}
function showSignInTab(tab) {
  document.getElementById('sg-signin-tab').classList.toggle('active', tab==='signin');
  document.getElementById('sg-signup-tab').classList.toggle('active', tab==='signup');
  document.getElementById('sg-signin-form').style.display = tab==='signin' ? 'block' : 'none';
  document.getElementById('sg-signup-form').style.display = tab==='signup' ? 'block' : 'none';
}
function signOut() {
  currentUser = null;
  saveCurrentUser();
  updateSignInButton();
}
function updateSignInButton() {
  const btn = document.getElementById('signInBtn');
  const nav = btn.parentElement;
  let logoutBtn = document.getElementById('sg-logout-btn');
  if (currentUser) {
    // Show only first name
    let firstName = currentUser.name ? currentUser.name.split(' ')[0] : (currentUser.email || currentUser.phone);
    btn.textContent = 'Hi, ' + firstName;
    btn.onclick = null;
    btn.title = '';
    // Add logout button if not present
    if (!logoutBtn) {
      logoutBtn = document.createElement('button');
      logoutBtn.id = 'sg-logout-btn';
      logoutBtn.textContent = 'Log Out';
      logoutBtn.className = 'btn btn-secondary ms-2';
      logoutBtn.onclick = signOut;
      nav.appendChild(logoutBtn);
    } else {
      logoutBtn.style.display = '';
    }
  } else {
    btn.textContent = 'Sign in';
    btn.onclick = showSignInModal;
    btn.title = '';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}
window.addEventListener('DOMContentLoaded', updateSignInButton);

// Sign in logic
function handleSignIn(e) {
  e.preventDefault();
  const id = document.getElementById('sg-signin-id').value.trim();
  const pass = document.getElementById('sg-signin-password').value;
  let user = null;
  for (const k in users) {
    if ((users[k].email === id || users[k].phone === id) && users[k].password === pass) {
      user = users[k];
      break;
    }
  }
  if (user) {
    currentUser = user;
    saveCurrentUser();
    updateSignInButton();
    document.getElementById('signInModal').style.display = 'none';
    alert('Signed in successfully!');
  } else {
    alert('Invalid credentials.');
  }
}
// Sign up logic
function handleSignUp(e) {
  e.preventDefault();
  const name = document.getElementById('sg-signup-name').value.trim();
  const email = document.getElementById('sg-signup-email').value.trim();
  const phone = document.getElementById('sg-signup-phone').value.trim();
  const pass = document.getElementById('sg-signup-password').value;
  if (!name) {
    alert('Please enter your name.');
    return;
  }
  if (!email && !phone) {
    alert('Enter email or phone.');
    return;
  }
  for (const k in users) {
    if (users[k].email === email && email) {
      alert('Email already registered.');
      return;
    }
    if (users[k].phone === phone && phone) {
      alert('Phone already registered.');
      return;
    }
  }
  const user = { name, email, phone, password: pass };
  users[email || phone] = user;
  saveUsers();
  alert('Sign up successful! You can now sign in.');
  showSignInTab('signin');
}
