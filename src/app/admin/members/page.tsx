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
  const [members, setMembers] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<RegistrationData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
      {/* Search Input */}
      <div className="mb-4 flex justify-center">
        <div className=" w-full md:w-1/2">
          <DashboardStats />
          <Input
            type="text"
            placeholder="Search by name, ID, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=""
          />
          <div className="flex justify-between items-center mt-4">
            <h2 className="text-lg font-semibold">Registered Members</h2>
            <Button
              onClick={() => exportToExcel(members, "Gad_Family_Members.xlsx")}
            >
              Export to Excel
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading members...</p>
      ) : members.length === 0 ? (
        <p className="text-center">No registered members found.</p>
      ) : (
        <div className="overflow-x-auto  flex flex-row justify-center">
          <Card className="overflow-x-auto md:w-1/2">
            <Table className="shadow-md rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>National ID</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Marital Status</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMembers.map((member) => (
                  <TableRow
                    key={member.id}
                    onClick={() => handleRowClick(member)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <TableCell>{member.names}</TableCell>
                    <TableCell>{member.nationalID}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.gender}</TableCell>
                    <TableCell>{member.maritalStatus}</TableCell>
                    <TableCell>
                      {member.isApproved ? (
                        <Badge className="bg-green-700">Approved</Badge>
                      ) : (
                        <Badge className="bg-yellow-500">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {!member.isApproved ? (
                        <Button
                          onClick={() => approveMember(member.id, true)}
                          className="w-full"
                          size="sm"
                        >
                          Approve
                        </Button>
                      ) : (
                        <Button
                          onClick={() => approveMember(member.id, false)}
                          className="bg-red-500 w-full"
                          size="sm"
                        >
                          Inactivate
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Member Details</DialogTitle>
              <DialogDescription>{selectedMember.names}</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <p>
                <strong>National ID:</strong> {selectedMember.nationalID}
              </p>
              <p>
                <strong>Phone:</strong> {selectedMember.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedMember.email}
              </p>
              <p>
                <strong>Gender:</strong> {selectedMember.gender}
              </p>
              <p>
                <strong>DoB:</strong>
                {" " + moment(selectedMember.dob).format("DD MMM YYYY")}
              </p>
              <p>
                <strong>Marital Status:</strong> {selectedMember.maritalStatus}
              </p>
              <p>
                <strong>Profession:</strong> {selectedMember.profession}
              </p>
              <p>
                <strong>Date Joined:</strong>
                {" " + moment(selectedMember.dateJoined).format("DD MMM YYYY")}
              </p>
              <p>
                <strong>Church Cell:</strong> {selectedMember.churchCell}
              </p>
              <p>
                <strong>Address:</strong> {selectedMember.province},{" "}
                {selectedMember.district}, {selectedMember.sector},{" "}
                {selectedMember.cell}, {selectedMember.village}
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
