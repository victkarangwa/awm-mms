"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebaseConfig";
import "@/lib/i18n"; // Import i18n setup
import { memberData } from "@/types";
import { get, ref } from "firebase/database";
import { MarsIcon, UsersIcon, VenusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import SkeletonLoading from "../Skeleton";
import { useTranslation } from "react-i18next";
import { getTotalFamilyContributions } from "@/utils/contributions";

export default function DashboardStats() {
  const { t } = useTranslation();
  const [totalMembers, setTotalMembers] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalContributions, setTotalContributions] = useState<number | null>(
    null
  );
  const [year] = useState("2025");

  useEffect(() => {
    async function fetchData() {
      const total = await getTotalFamilyContributions(year);
      // console.log("-----", total)
      setTotalContributions(total);
    }
    fetchData();
  }, [year]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const membersRef = ref(db, "users");
        const snapshot = await get(membersRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const membersArray = Object.values(data) as memberData[];

          const total = membersArray.length;
          const males = membersArray.filter(
            (member: memberData) => member.gender === "Male"
          ).length;
          const females = membersArray.filter(
            (member: memberData) => member.gender === "Female"
          ).length;

          setTotalMembers(total);
          setMaleCount(males);
          setFemaleCount(females);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();
  }, []);

  return loading ? (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
      <SkeletonLoading />
      <SkeletonLoading />
      <SkeletonLoading />
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 py-4">
      {/* Total Members Card */}
      <Card className="shadow-md flex justify-center items-center bg-blue-100 border-blue-500">
        <UsersIcon className="w-8 h-8 text-blue-500 " />
        <div>
          <CardHeader>
            <CardTitle className="text-sm">{t("total")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-center">{totalMembers}</p>
          </CardContent>
        </div>
      </Card>

      {/* Male Members Card */}
      <Card className="shadow-md flex justify-center items-center bg-orange-100 border-orange-500">
        <MarsIcon className="w-8 h-8 text-orange-500 " />
        <div>
          <CardHeader>
            <CardTitle className="text-sm">{t("male")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-center">{maleCount}</p>
          </CardContent>
        </div>
      </Card>

      {/* Female Members Card */}
      <Card className="shadow-md flex justify-center items-center bg-green-100 border-green-500">
        <VenusIcon className="w-8 h-8 text-green-500 " />
        <div>
          <CardHeader>
            <CardTitle className="text-sm">{t("female")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-center">{femaleCount}</p>
          </CardContent>
        </div>
      </Card>

      {/* Total Contributions Card */}
      <Card className="shadow-md flex justify-center items-center bg-red-100 border-red-500">
        {/* <MarsIcon className="w-8 h-8 text-red-500 " /> */}
        <div>
          <CardHeader>
            <CardTitle className="text-sm text-center">{t("contributions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-center">
              <label className="text-sm">RWF</label> {totalContributions?.toLocaleString() || 0}
            </p>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
