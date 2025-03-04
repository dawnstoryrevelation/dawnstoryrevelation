document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  
  // Function to switch between the signup and login forms
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.tab === 'signup') {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
      } else if (btn.dataset.tab === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
      }
    });
  });

  // Toggle password visibility function
  function togglePasswordVisibility(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(iconId);

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon.classList.remove("fa-eye");
      eyeIcon.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      eyeIcon.classList.remove("fa-eye-slash");
      eyeIcon.classList.add("fa-eye");
    }
  }

  // Add event listeners for password toggle for both forms
  document.querySelector("#signup-form .password-toggle")?.addEventListener("click", function() {
    togglePasswordVisibility("signup-password", "signup-eye");
  });

  document.querySelector("#login-form .password-toggle")?.addEventListener("click", function() {
    togglePasswordVisibility("login-password", "login-eye");
  });

  // Firebase Authentication - Sign Up form handling
  const signupFormSubmit = document.getElementById("signup-form-submit");
  signupFormSubmit?.addEventListener('click', async function(e) {
    e.preventDefault();
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const displayName = document.getElementById("signup-name").value;

    try {
      // Firebase sign-up logic
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      await user.updateProfile({
        displayName: displayName
      });

      // Save additional user data in Firestore if needed
      const userRef = firebase.firestore().doc(`users/${user.uid}`);
      await userRef.set({
        displayName: displayName,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      console.log("User created successfully:", user);
      // Redirect to home or other page after successful signup
      window.location.href = '/home';

    } catch (error) {
      console.error("Error during sign up:", error.message);
    }
  });

  // Firebase Authentication - Login form handling
  const loginFormSubmit = document.getElementById("login-form-submit");
  loginFormSubmit?.addEventListener('click', async function(e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      // Firebase login logic
      await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log("User logged in successfully");
      // Redirect to home or other page after successful login
      window.location.href = '/home';

    } catch (error) {
      console.error("Error during login:", error.message);
    }
  });
});