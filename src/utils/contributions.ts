/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDatabase, ref, update, get } from "firebase/database";

export async function updateMemberContribution(
  nationalID: string,
  year: string,
  contributionType: string,
  month: string,
  amount: number
) {
  const db = getDatabase();
  const contributionRef = ref(
    db,
    `contributions/${year}/${nationalID}/${contributionType}/${month}`
  );

  try {
    await update(
      contributionRef,
      amount ? { amount } : { amount: 0 }
    );
    return { success: true };
  } catch (error) {
    console.error("Error updating contribution:", error);
    return { success: false, error };
  }
}

export async function getMemberContributions(
  nationalID: string,
  year: string = "2025"
) {
  const db = getDatabase();
  const contributionsRef = ref(db, `contributions/${year}/${nationalID}`);

  try {
    const snapshot = await get(contributionsRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null; // No contributions found
    }
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return null;
  }
}

export async function getTotalFamilyContributions(year: string) {
  const db = getDatabase();
  const contributionsRef = ref(db, `contributions/${year}`);

  try {
    const snapshot = await get(contributionsRef);
    if (!snapshot.exists()) return 0;

    let totalAmount = 0;
    const data = snapshot.val();

    Object.values(data).forEach((member: any) => {
      // Sum "familyContributions"
      if (member.familyContributions) {
        Object.values(member.familyContributions).forEach((month: any) => {
          totalAmount += month.amount || 0;
        });
      }

      // Sum "Family Contribution" (alternative naming)
      if (member["Family Contribution"]) {
        Object.values(member["Family Contribution"]).forEach((month: any) => {
          totalAmount += month.amount || 0;
        });
      }

      // Sum "One Stone Project"
      if (member["One Stone Project"]) {
        Object.values(member["One Stone Project"]).forEach((month: any) => {
          totalAmount += month.amount || 0;
        });
      }
    });

    return totalAmount;
  } catch (error) {
    console.error("Error fetching total contributions:", error);
    return 0;
  }
}

export const getMonthShortName = (month: number) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[month];
};
