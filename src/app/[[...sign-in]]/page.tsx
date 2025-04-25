import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold mb-2">College Management System</h1>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>
        <SignIn />
      </div>
    </div>
  );
}
//             <label className="block text-sm font-medium mb-1">Username</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               placeholder="Enter your username"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium mb-1">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               placeholder="Enter your password"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium mb-1">Sign in as</label>
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//             >
//               <option value="admin">Administrator</option>
//               <option value="student">Student</option>
//               <option value="parent">Parent</option>
//               <option value="teacher">Teacher</option>
//             </select>
//           </div>
          
//           {error && <p className="text-red-500 text-sm">{error}</p>}
          
//           <button
//             type="submit" 
//             className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded"
//           >
//             Sign In
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

//"use client";

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';

// export default function SignInPage() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('student');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSignIn = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!username || !password) {
//       setError('Please enter both username and password');
//       return;
//     }
    
//     // For demonstration purposes, check for admin credentials
//     if (role === 'admin' && username === 'admin' && password === 'admin') {
//       // Set a fake auth cookie for middleware
//       document.cookie = "__clerk_db_jwt=demo_token; path=/; max-age=3600";
//       router.push('/dashboard/admin');
//       return;
//     }
    
//     // For other roles or non-admin credentials
//     if (username.length >= 3 && password.length >= 3) {
