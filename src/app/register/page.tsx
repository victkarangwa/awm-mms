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
import { Progress } from "@/components/ui/progress";
import { db } from "@/lib/firebaseConfig";
import { get, push, ref } from "firebase/database";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface RegistrationData {
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
  churchCell: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  isApproved: boolean;
  timestamp: string;
}

const steps = [
  "Personal Info",
  "Contact Info",
  "Church & Location",
  "Review & Submit",
];

export default function Register() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationData>();

  const [step, setStep] = useState(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [nationalIDExists, setNationalIDExists] = useState(false);

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid && !nationalIDExists) {
      if (step < steps.length - 1) setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // Modified checkNationalID function using Realtime Database
  const checkNationalID = async (id: string) => {
    if (!id) return;

    const usersRef = ref(db, "users"); // Reference to the users list
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const users = snapshot.val(); // Get all users
      const userExists = Object.values(users).some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (user: any) => user.nationalID === id
      );

      setNationalIDExists(userExists);
    } else {
      setNationalIDExists(false);
    }
  };

  // Modified onSubmit function using Realtime Database
  const onSubmit = async (data: RegistrationData) => {
    try {
      const userRef = ref(db, "users"); // Reference to the specific user by ID
      data.isApproved = false;
      data.timestamp = new Date().toISOString();
      await push(userRef, data);  // Set the data in Realtime Database
      setShowModal(true); // Show modal on success
    } catch (error) {
      console.log("Error: ", error); // Handle error if any
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <CardHeader className="text-center">
        <p className="text-sm text-gray-600 mt-1">
          Please fill out the form to register as a family member.
        </p>
      </CardHeader>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">{steps[step]}</h2>
        </CardHeader>
        <CardContent>
          <Progress
            value={(step / (steps.length - 1)) * 100}
            className="mb-4"
          />
          <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
            {step === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      National ID
                    </label>
                    <Input
                      placeholder="Enter your National ID"
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
                      onBlur={(e) => checkNationalID(e.target.value.trim())}
                    />
                    {errors.nationalID && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.nationalID?.message}
                      </p>
                    )}
                    {nationalIDExists && (
                      <p className="text-red-500 text-sm mt-1">
                        This National ID is already registered
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <Input
                      placeholder="Enter your full name"
                      {...register("names", {
                        required: "Full name is required",
                      })}
                    />
                    {errors.names && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.names?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      {...register("dob", {
                        required: "Date of birth is required",
                      })}
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dob?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      className="border border-gray-300 rounded-md p-2 w-full"
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.gender?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Marital Status
                    </label>
                    <select
                      className="border border-gray-300 rounded-md p-2 w-full"
                      {...register("maritalStatus", {
                        required: "Marital status is required",
                      })}
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                    {errors.maritalStatus && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.maritalStatus?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="Enter your phone number"
                      {...register("phone", {
                        required: "Phone number is required",
                      })}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Profession
                    </label>
                    <Input
                      placeholder="Enter your profession"
                      {...register("profession", {
                        required: "Profession is required",
                      })}
                    />
                    {errors.profession && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.profession?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Field of Study
                    </label>
                    <Input
                      placeholder="Enter what you studied"
                      {...register("studied", {
                        required: "Field of study is required",
                      })}
                    />
                    {errors.studied && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.studied?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      When did join the church?
                    </label>
                    <Input
                      type="date"
                      {...register("dateJoined", {
                        required: "Date joined is required",
                      })}
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.dob?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Church Cell
                    </label>
                    <Input
                      placeholder="Enter your church cell"
                      {...register("churchCell", {
                        required: "Church cell is required",
                      })}
                    />
                    {errors.churchCell && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.churchCell?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Province
                    </label>
                    <Input
                      placeholder="Enter your province"
                      {...register("province", {
                        required: "Province is required",
                      })}
                    />
                    {errors.province && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.province?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      District
                    </label>
                    <Input
                      placeholder="Enter your district"
                      {...register("district", {
                        required: "District is required",
                      })}
                    />
                    {errors.district && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.district?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sector
                    </label>
                    <Input
                      placeholder="Enter your sector"
                      {...register("sector", {
                        required: "Sector is required",
                      })}
                    />
                    {errors.sector && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.sector?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cell
                    </label>
                    <Input
                      placeholder="Enter your cell"
                      {...register("cell", {
                        required: "Cell is required",
                      })}
                    />
                    {errors.cell && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.cell?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Village
                    </label>
                    <Input
                      placeholder="Enter your village"
                      {...register("village", {
                        required: "Village is required",
                      })}
                    />
                    {errors.village && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.village?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold">Full Name:</p>
                        <p>{getValues("names")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Date of Birth:</p>
                        <p>{getValues("dob")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Gender:</p>
                        <p>{getValues("gender")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Marital Status:</p>
                        <p>{getValues("maritalStatus")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Phone:</p>
                        <p>{getValues("phone")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Email:</p>
                        <p>{getValues("email")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">National ID:</p>
                        <p>{getValues("nationalID")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Profession:</p>
                        <p>{getValues("profession")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Studied:</p>
                        <p>{getValues("studied")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Church Cell:</p>
                        <p>{getValues("churchCell")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Province:</p>
                        <p>{getValues("province")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">District:</p>
                        <p>{getValues("district")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Sector:</p>
                        <p>{getValues("sector")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Cell:</p>
                        <p>{getValues("cell")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Village:</p>
                        <p>{getValues("village")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </form>
          <div className="flex justify-between mt-4">
            {step > 0 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={() =>
                  formRef.current?.dispatchEvent(
                    new Event("submit", { cancelable: true, bubbles: true })
                  )
                }
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <Button
        className="my-2 w-full underline"
        variant="link"
        onClick={() => router.push("/check")}
      >
        Check if already registered
      </Button>
      <div className="text-center mt-4 text-sm text-gray-600">
        Need help? Call/Text us at
        <span className="font-semibold text-orange-600"> +250 789 152 190</span>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              <span className="text-green-500 text-center flex flex-col items-center gap-2">
                <CheckCircle className="w-16 h-16" />{" "}
                <span>Registration Successful</span>
              </span>
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-gray-500">
            Your registration has been successfully submitted.
          </p>
          <Button
            className="w-full"
            variant="default"
            onClick={() => router.push("/")}
          >
            Go Home
          </Button>
          <Button
            className="w-full underline"
            variant="link"
            onClick={() => {
              setStep(0);
              setShowModal(false);
              reset();
            }}
          >
            Register Another
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
