/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, update } from "firebase/database";
import { db } from "@/lib/firebaseConfig";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import moment from "moment";
import DashboardStats from "@/components/dashboard/DashboardSts";
import { exportToExcel } from "@/utils/exportToExcel";
import { useTranslation } from "react-i18next";
import "@/lib/i18n"; // Import i18n setup
import {
  getMemberContributions,
  getMonthShortName,
  updateMemberContribution,
} from "@/utils/contributions";
import { Checkbox } from "@/components/ui/checkbox";

interface RegistrationData {
  id: string;
  names: string;
  phone: string;
  email: string;
  gender: string;
  maritalStatus: string;
  dob: string;
  nationalID: string;
  profession: string;
  studied: string;
  dateJoined: string;
  a12Family: string;
  churchCell: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  isApproved: boolean;
  timestamp: string;
}

export default function RegisteredMembers() {
  const { t } = useTranslation();

  const [members, setMembers] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<RegistrationData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contributions, setContributions] = useState<any>(null);
  const pageSize = 10; // Adjust the number of items per page

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const membersRef = ref(db, "users");
        const snapshot = await get(membersRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const membersArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setMembers(membersArray);
        } else {
          setMembers([]);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const approveMember = async (memberId: string, activate: boolean = true) => {
    try {
      await update(ref(db, `users/${memberId}`), { isApproved: activate });

      // Update UI instantly
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.id === memberId ? { ...member, isApproved: activate } : member
        )
      );
    } catch (error) {
      console.error("Error approving member:", error);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.names.toLowerCase().includes(search.toLowerCase()) ||
      member.nationalID.includes(search) ||
      member.phone.includes(search) ||
      member.email.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredMembers.length / pageSize);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Open Modal with Selected Member
  const handleRowClick = (member: RegistrationData) => {
    getMemberContributions(member.nationalID).then((data) => {
      console.log("Contributions:", data);
      setContributions(data);
    });
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const ContributionComponent = ({
    type = "One Stone Project",
  }: {
    type: string;
  }) => {
    const amount = type === "One Stone Project" ? 1000 : 500;
    const totalContributed = Object.values(contributions?.[type] || {}).reduce(
      (acc: number, curr: any) => acc + curr.amount, 0
    );
    return (
      <div className="rounded-lg max-w-max min-w-[320px] mt-2 mb-4">
        {/* Header Row */}
        <h1 className="font-bold text-orange-500">{type}</h1>
        <h2 className="text-xs font-bold">(Tot: RWF {totalContributed})</h2>
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
              <Checkbox
                // checked={contributions?.[type]?.[i + 1] > 0}
                defaultChecked={
                  contributions?.[type]?.[getMonthShortName(i)]?.amount > 0
                }
                onCheckedChange={(checked) => {
                  updateMemberContribution(
                    selectedMember?.nationalID || "",
                    moment().year().toString(),
                    type,
                    getMonthShortName(i),
                    checked ? amount : 0
                  );
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      {/* Search Input */}
      <div className="mb-4 flex justify-center">
        <div className=" w-full md:w-1/2">
          <DashboardStats />
          <Input
            type="text"
            placeholder={t("searchByNameIdEmail")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=""
          />
          <div className="flex justify-between items-center mt-4">
            <h2 className="text-lg font-semibold">{t("registeredMembers")}</h2>
            <Button
              onClick={() => exportToExcel(members, "Gad_Family_Members.xlsx")}
            >
              {t("exportToExcel")}
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center">{t("loadingMembers")}</p>
      ) : members.length === 0 ? (
        <p className="text-center">{t("noRegisteredMembersFound")}</p>
      ) : (
        <div className="overflow-x-auto  flex flex-row justify-center">
          <Card className="overflow-x-auto md:w-1/2">
            <Table className="shadow-md rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead>{t("full_name")}</TableHead>
                  <TableHead>{t("national_id")}</TableHead>
                  <TableHead>{t("phone_number")}</TableHead>
                  <TableHead>{t("gender")}</TableHead>
                  <TableHead>{t("marital_status")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMembers.map((member) => (
                  <TableRow
                    key={member.id}
                    // onClick={() => handleRowClick(member)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <TableCell onClick={() => handleRowClick(member)}>
                      {member.names}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(member)}>
                      {member.nationalID}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(member)}>
                      {member.phone}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(member)}>
                      {member.gender}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(member)}>
                      {member.maritalStatus}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(member)}>
                      {member.isApproved ? (
                        <Badge className="bg-green-700">{t("approved")}</Badge>
                      ) : (
                        <Badge className="bg-yellow-500">{t("pending")}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {!member.isApproved ? (
                        <Button
                          onClick={() => approveMember(member.id, true)}
                          className="w-full"
                          size="sm"
                        >
                          {t("approve")}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => approveMember(member.id, false)}
                          className="bg-red-500 w-full"
                          size="sm"
                        >
                          {t("inactivate")}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination */}
            <Pagination className="mt-4 flex justify-center">
              <PaginationContent>
                <PaginationItem>
                  {currentPage > 1 && (
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                    />
                  )}
                </PaginationItem>
                <PaginationItem>
                  <span className="px-3">
                    {currentPage} / {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  {currentPage < totalPages && (
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                    />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Card>
        </div>
      )}
      {/* Member Details Modal */}
      {selectedMember && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="w-full">
            <DialogHeader>
              <DialogTitle>{t("memberDetails")}</DialogTitle>
              <DialogDescription>{selectedMember.names}</DialogDescription>
            </DialogHeader>
            <div className="overflow-x-auto  space-y-2">
              <p>
                <strong>{t("national_id")}:</strong> {selectedMember.nationalID}
              </p>
              <p>
                <strong>{t("phone_number")}:</strong> {selectedMember.phone}
              </p>
              <p>
                <strong>{t("email")}:</strong> {selectedMember.email}
              </p>
              <p>
                <strong>{t("gender")}:</strong> {selectedMember.gender}
              </p>
              <p>
                <strong>{t("dob")}:</strong>
                {" " + moment(selectedMember.dob).format("DD MMM YYYY")}
              </p>
              <p>
                <strong>{t("marital_status")}:</strong>{" "}
                {selectedMember.maritalStatus}
              </p>
              <p>
                <strong>{t("profession")}:</strong> {selectedMember.profession}
              </p>
              <p>
                <strong>{t("date_joined")}:</strong>
                {" " + moment(selectedMember.dateJoined).format("DD MMM YYYY")}
              </p>
              <p>
                <strong>{t("church_cell")}:</strong> {selectedMember.churchCell}
              </p>
              <p>
                <strong>{t("address")}:</strong> {selectedMember.province},{" "}
                {selectedMember.district}, {selectedMember.sector},{" "}
                {selectedMember.cell}, {selectedMember.village}
              </p>
              <div className="overflow-x-auto">
                <ContributionComponent type="One Stone Project" />
                <ContributionComponent type="Family Contribution" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsModalOpen(false)}>
                {t("close")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
