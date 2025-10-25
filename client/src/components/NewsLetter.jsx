const NewsLetter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 mt-24 pb-14">
      <div className="flex items-center justify-center">
        <h2 className="md:text-4xl text-2xl font-semibold text-gray-900 overflow-hidden whitespace-nowrap">
          Never Miss a Deal
        </h2>
        <span className="md:text-4xl text-2xl animate-blink text-gray-900">
          !
        </span>
      </div>

      <p className="md:text-lg text-gray-500/70 pb-8 animate-typing">
        Get latest offers, new arrivals, and exclusive discounts
      </p>

      <form className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
        <input
          className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500 active:border-gray-900"
          type="text"
          placeholder="Enter your Email id"
          required
        />
        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-orange-500 hover:bg-orange-600 transition-all cursor-pointer rounded-md rounded-l-none whitespace-nowrap"
        >
          Get Deals!
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
