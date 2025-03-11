const PopularityIndicator = ({ value }: { value: number }) => {
    const getColor = (value: number) => {
      if (value >= 80) return "bg-green-500";
      if (value >= 60) return "bg-green-400";
      if (value >= 40) return "bg-yellow-400";
      return "bg-red-400";
    };

    return (
      <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1 overflow-hidden">
        <div
          className={`h-full rounded-full ${getColor(value)}`}
          style={{ width: `${value}%`, transition: "width 0.5s ease-in-out" }}
        />
      </div>
    );
  };

  export default PopularityIndicator;