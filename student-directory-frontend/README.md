# Student Directory Frontend

A React application built with Vite and React Router that interfaces with an Express & MongoDB Atlas backend using JWT authentication.

Configuration key: banana

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Backend Express server running on `http://localhost:3000`

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```
The application will run on `http://localhost:5173`.

---

## Reflection Answers

1. **Why do we store the token in localStorage? What is one security risk of doing so, and what is a more secure alternative?**
   We store the token in `localStorage` so that the user stays logged in even after refreshing the browser or closing the tab. One major security risk is vulnerability to Cross-Site Scripting (XSS) attacks, where malicious scripts injected into the web page can read `localStorage` and steal the token. A more secure alternative is using `httpOnly` cookies, which are inaccessible to client-side JavaScript and automatically sent with HTTP requests.

2. **What is the purpose of the AuthContext? Why not just pass the token as a prop to each component?**
   `AuthContext` provides a centralized global state for managing authentication data (user, token, login status) across the entire component tree. Passing the token as a prop to every component results in "prop drilling," making the code harder to maintain and passing data through components that do not need it. `AuthContext` allows any child component to consume authentication state directly via the custom `useAuth()` hook.

3. **What happens on the frontend when the JWT expires? Describe the user experience you would want to implement.**
   When the JWT expires, requests sent to protected API routes fail with a `401 Unauthorized` response. Ideally, the frontend should catch `401` errors globally using fetch wrappers or interceptors, clear the invalid token from `localStorage` and state, display a clear notification such as "Your session has expired. Please log in again," and automatically redirect the user back to the `/login` screen.

4. **What is the difference between the backend's requireAuth middleware (from Lesson 5) and the frontend's ProtectedRoute component? Why do we need both?**
   The backend's `requireAuth` middleware cryptographically verifies the JWT token on incoming requests before granting access to database resources, ensuring true system security. The frontend's `ProtectedRoute` component is purely for user experience, hiding protected pages and redirecting unauthorized users at the UI level. We need both because client-side routing guards can be bypassed by users, while backend middleware enforces real security controls.