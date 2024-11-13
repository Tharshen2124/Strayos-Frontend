export const Spinner = () => {
  return (
    <div className="flex flex-col gap-y-5 items-center justify-center h-screen">
        <div className="w-24 h-24 border-4 border-t-transparent  rounded-full animate-spin"></div>
        <h1 className="dark:text-white text-gray-800">Loading map...</h1>
    </div>
  );
};

