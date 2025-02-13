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
