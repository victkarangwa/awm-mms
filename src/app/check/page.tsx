"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, XCircle } from "lucide-react"; // Import icons
import { useRouter } from "next/navigation";
import { useState } from "react";
import { db } from "../../lib/firebaseConfig";  // Still import db, but it's for Realtime DB now
import { useForm } from "react-hook-form";
import { ref, get } from "firebase/database";  // Import Realtime Database methods

interface ModalData {
  names: string;
  nationalID: string;
  phone: string;
  churchCell: string;
}

interface CheckRegistration {
  nationalID: string;
}

export default function Home() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckRegistration>();

  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false); // Track error state

  const onSubmit = async (data: CheckRegistration) => {
    setIsError(false); // Reset error state before the check
    
    // Reference to the users path in Realtime Database
    const usersRef = ref(db, "users");

    try {
      // Fetch all users from the Realtime Database
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        // Find the user with matching nationalID
        const users = snapshot.val();  // This will return a JSON object
        let userFound = false;

        for (const key in users) {
          if (users[key].nationalID === data.nationalID) {
            setModalData(users[key]);
            userFound = true;
            break;
          }
        }

        if (userFound) {
          setShowModal(true);
          setIsError(false); // Success, reset error state
        } else {
          setIsError(true); // No matching record found
          setShowModal(true);
        }
      } else {
        setIsError(true); // No users in DB
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching data from Realtime Database:", error);
      setIsError(true);
      setShowModal(true);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-center">Check Registration</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                National ID
              </label>
              <Input
                placeholder="Enter National ID"
                {...register("nationalID", {
                  required: "National ID is required",
                  minLength: {
                    value: 16,
                    message: "National ID must be at least 16 digits",
                  },
                  maxLength: {
                    value: 16,
                    message: "National ID must not exceed 16 digits",
                  },
                  setValueAs: (value) => value.trim(), // Trim input before validation
                })}
              />
              {errors.nationalID && (
                <p className="text-red-500 text-sm pt-2">
                  {errors.nationalID?.message}
                </p>
              )}
            </div>
            <Button
              className="mt-6 mb-2 w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Check"}
            </Button>
          </form>
          <div className="relative flex items-center my-4">
            <div className="w-full border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <Button
            className="my-2 w-full"
            variant="secondary"
            onClick={() => router.push("/register")}
          >
            Register
          </Button>
        </CardContent>
      </Card>
      <div className="text-center mt-4 text-sm text-gray-600">
        Need help? Call/Text us at
        <span className="font-semibold text-orange-600"> +250 789 152 190</span>
      </div>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              {isError ? (
                <span className="text-red-500 text-center flex flex-col items-center gap-2">
                  <XCircle className="w-16 h-16" />{" "}
                  <span>Record Not Found</span>
                </span>
              ) : (
                <span className="text-green-500 text-center flex flex-col items-center gap-2">
                  <CheckCircle className="w-16 h-16" />{" "}
                  <span>Record Found</span>
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          {isError ? (
            <div className="text-center">
              <p className="py-2">No record found for this National ID.</p>
              <Button
                className="my-2 w-full"
                variant="secondary"
                onClick={() => router.push("/register")}
              >
                Click here to register
              </Button>
            </div>
          ) : (
            <div className="space-y-4 flex flex-col">
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <p className="font-semibold">Member</p>
                    <p>{modalData?.names}</p>
                  </div>
                  <div>
                    <p className="font-semibold">National ID</p>
                    <p>{modalData?.nationalID}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Phone Number</p>
                    <p>{modalData?.phone}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Church Cell</p>
                    <p>{modalData?.churchCell}</p>
                  </div>
                </CardContent>
              </Card>
              <Button
                className="my-2 w-full"
                variant="secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
