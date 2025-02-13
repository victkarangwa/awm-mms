export const ContributionComponent = ({
  type = "One Stone Project",
}: {
  type: string;
}) => {
  return (
    <div className="rounded-lg max-w-max min-w-[320px] mt-2 mb-4">
      {/* Header Row */}
      <h1 className="font-bold text-orange-500">{type}</h1>
      <h2 className="text-xs font-bold">(Tot: RWF 6,000)</h2>
      <div className="flex bg-gray-100 font-semibold p-2 rounded-t-lg min-w-max">
        <div className="p-2 w-8">M</div>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="p-2 w-8 text-center">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Status Row */}
      <div className="shadow-md flex border-t p-2 min-w-max">
        <div className="p-2 w-8 font-semibold">S</div>
        {[
          "✅",
          "❌",
          "✅",
          "✅",
          "✅",
          "✅",
          "✅",
          "✅",
          "✅",
          "✅",
          "✅",
          "✅",
        ].map((status, i) => (
          <div key={i} className="p-2 w-8 text-center">
            {status}
          </div>
        ))}
      </div>
    </div>
  );
};
