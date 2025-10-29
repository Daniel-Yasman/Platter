function Message({ children }) {
  return (
    <div className="mb-4 bg-[#ffc098] text-indigo-900 flex justify-center items-center py-2.5">
      <p className="text-sm  font-semibold  opacity-70">{children}</p>
    </div>
  );
}
export default Message;
