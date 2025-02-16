import { getMonthShortName } from "@/utils/contributions";
import { Checkbox } from "./ui/checkbox";
import { useTranslation } from "react-i18next";
import "@/lib/i18n"; // Import i18n setup

/* eslint-disable @typescript-eslint/no-explicit-any */
export const ContributionComponent = ({
  type = "One Stone Project",
  contributions,
}: {
  type: string;
  contributions: any;
}) => {
  const { t } = useTranslation();

  const totalContributed = Object.values(contributions?.[type] || {}).reduce(
    (acc: number, curr: any) => acc + curr.amount,
    0
  );
  return (
    <div className="rounded-lg max-w-max min-w-[320px] mt-2 mb-4">
      {/* Header Row */}
      <h1 className="font-bold text-orange-500">{t(type)}</h1>
      <h2 className="text-xs font-bold">(Tot: RWF {totalContributed.toLocaleString()})</h2>
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
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="p-2 w-8 text-center">
            {contributions?.[type]?.[getMonthShortName(i)]?.amount > 0
              ? "✅"
              : <Checkbox disabled />}
          </div>
        ))}
      </div>
    </div>
  );
};
