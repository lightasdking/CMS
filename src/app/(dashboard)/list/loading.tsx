// const Loading = () => {
//     return (
//       <div className="p-8 animate-pulse">
//         <div className=" rounded-lg overflow-hidden shadow-md">
//           <div className="p-8 bg-gray-200 flex space-x-32">
//             <div className="h-6 bg-gray-300 rounded w-1/6"></div>
//             <div className="h-6 bg-gray-300 rounded w-2/6"></div>
//             <div className="h-6 bg-gray-300 rounded w-1/6"></div>
//             <div className="h-6 bg-gray-300 rounded w-1/6"></div>
//           </div>
//           <div className="p-4">
//             {[...Array(10)].map((_, index) => (
//               <div
//                key={index}
//                 className="flex items-center justify-between mb-4 py-2 mt-4"
//               >
//                 <div className="h-8 bg-gray-200 rounded w-1/6 mr-2"></div>
//                 <div className="h-8 bg-gray-200 rounded w-2/6 mr-2"></div>
//                 <div className="h-8 bg-gray-200 rounded w-1/6 mr-2"></div>
//                 <div className="h-8 bg-gray-200 rounded w-1/6"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   };
  
//   export default Loading;
  
const Loading = () => {
  const generateRows = () => {
    const rows = [];
    for (let i = 0; i < 10; i++) {
      rows.push(
        <section
          key={i}
          className="inline-flex items-center justify-between py-2 mb-4 mt-4 w-full"
        >
          <div className="w-1/6 h-8 rounded bg-gray-200 mr-2"></div>
          <div className="w-2/6 h-8 rounded bg-gray-200 mr-2"></div>
          <div className="w-1/6 h-8 rounded bg-gray-200 mr-2"></div>
          <div className="w-1/6 h-8 rounded bg-gray-200"></div>
        </section>
      );
    }
    return rows;
  };

  return (
    <div className="p-8 animate-pulse">
      <section className="rounded-lg overflow-hidden shadow-md">
        <header className="inline-flex bg-gray-200 p-8 space-x-32">
          <div className="w-1/6 h-6 rounded bg-gray-300"></div>
          <div className="w-2/6 h-6 rounded bg-gray-300"></div>
          <div className="w-1/6 h-6 rounded bg-gray-300"></div>
          <div className="w-1/6 h-6 rounded bg-gray-300"></div>
        </header>
        <div className="p-4">{generateRows()}</div>
      </section>
    </div>
  );
};

export default Loading;