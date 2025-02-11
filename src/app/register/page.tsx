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
import { SetStateAction, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import "@/lib/i18n"; // Import i18n s
import rwanda from "@/data/rwanda";

type RwandaType = {
  [key: string]: {
    [key: string]: {
      [key: string]: {
        [key: string]: string[];
      };
    };
  };
};

const rwandaData: RwandaType = rwanda;
import { memberData } from "@/types";


export default function Register() {
  const { t } = useTranslation();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<memberData>();

  const [step, setStep] = useState(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [nationalIDExists, setNationalIDExists] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedCell, setSelectedCell] = useState("");

  const handleProvinceChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict("");
    setSelectedSector("");
    setSelectedCell("");
  };

  const handleDistrictChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedDistrict(e.target.value);
    setSelectedSector("");
    setSelectedCell("");
  };

  const handleSectorChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedSector(e.target.value);
    setSelectedCell("");
  };

  const handleCellChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedCell(e.target.value);
  };

  const steps = [
    t("personal_info"),
    t("contact_info"),
    t("church_location"),
    t("review_submit"),
  ];

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
  const onSubmit = async (data: memberData) => {
    try {
      const userRef = ref(db, "users"); // Reference to the specific user by ID
      data.isApproved = false;
      data.timestamp = new Date().toISOString();
      data.a12Family = "GAD";
      await push(userRef, data); // Set the data in Realtime Database
      setShowModal(true); // Show modal on success
    } catch (error) {
      console.log("Error: ", error); // Handle error if any
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <CardHeader className="text-center">
        <p className="text-sm text-gray-600 mt-1">{t("please_fill_form")}</p>
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
                      {t("national_id")}
                    </label>
                    <Input
                      placeholder={t("enter_national_id")}
                      {...register("nationalID", {
                        required: t("national_id_required"),
                        minLength: {
                          value: 16,
                          message: t("national_id_min_length"),
                        },
                        maxLength: {
                          value: 16,
                          message: t("national_id_max_length"),
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
                        {t("national_id_exists")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("full_name")}
                    </label>
                    <Input
                      placeholder={t("enter_full_name")}
                      {...register("names", {
                        required: t("full_name_required"),
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
                      {t("dob")}
                    </label>
                    <Input
                      type="date"
                      {...register("dob", {
                        required: t("dob_required"),
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
                      {t("gender")}
                    </label>
                    <select
                      className="border border-gray-300 rounded-md p-2 w-full"
                      {...register("gender", {
                        required: t("gender_required"),
                      })}
                    >
                      <option value="">{t("select_gender")}</option>
                      <option value="Male">{t("male")}</option>
                      <option value="Female">{t("female")}</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.gender?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("marital_status")}
                    </label>
                    <select
                      className="border border-gray-300 rounded-md p-2 w-full"
                      {...register("maritalStatus", {
                        required: t("marital_status_required"),
                      })}
                    >
                      <option value="">{t("select_status")}</option>
                      <option value="Single">{t("single")}</option>
                      <option value="Married">{t("married")}</option>
                      <option value="Divorced">{t("divorced")}</option>
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
                      {t("phone")}
                    </label>
                    <Input
                      type="tel"
                      placeholder={t("enter_phone")}
                      {...register("phone", {
                        required: t("phone_required"),
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
                      {t("email")}
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...register("email", {
                        required: t("email_required"),
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: t("email_invalid"),
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
                      {t("profession")}
                    </label>
                    <Input
                      placeholder={t("enter_profession")}
                      {...register("profession", {
                        required: t("profession_required"),
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
                      {t("field_of_study")}
                    </label>
                    <Input
                      placeholder={t("enter_study")}
                      {...register("studied", {
                        required: t("field_of_study_required"),
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
                      {t("date_joined")}
                    </label>
                    <Input
                      type="date"
                      {...register("dateJoined", {
                        required: t("date_joined_required"),
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
                      {t("church_cell")}
                    </label>
                    <Input
                      placeholder={t("enter_church_cell")}
                      {...register("churchCell", {
                        required: t("church_cell_required"),
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
                      {t("province")}
                    </label>
                    {/* <Input
                      placeholder={t("enter_province")}
                      {...register("province", {
                        required: t("province_required"),
                      })} 
                    /> */}
                    <select
                      {...register("province")}
                      onChange={handleProvinceChange}
                      className="border border-gray-300 rounded-md p-2 w-full"
                    >
                      <option value="">Select Province</option>
                      {Object.keys(rwanda).map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                    {errors.province && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.province?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("district")}
                    </label>
                    {/* <Input
                      placeholder={t("enter_district")}
                        Object.keys(rwandaData[selectedProvince] || {}).map(
                        required: t("district_required"),
                      })}
                    /> */}
                    <select
                      {...register("district")}
                      onChange={handleDistrictChange}
                      disabled={!selectedProvince}
                      className="border border-gray-300 rounded-md p-2 w-full"
                    >
                      <option value="">Select District</option>
                      {selectedProvince &&
                        Object.keys(rwandaData[selectedProvince] || {}).map(
                          (district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          )
                        )}
                    </select>
                    {errors.district && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.district?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("sector")}
                    </label>
                    {/* <Input
                      placeholder={t("enter_sector")}
                      {...register("sector", {
                        required: t("sector_required"),
                      })}
                    /> */}
                    <select
                      {...register("sector")}
                      onChange={handleSectorChange}
                      disabled={!selectedDistrict}
                      className="border border-gray-300 rounded-md p-2 w-full"
                    >
                      <option value="">Select Sector</option>
                      {selectedDistrict &&
                        Object.keys(
                          rwandaData[selectedProvince][selectedDistrict] || {}
                        ).map((sector) => (
                          <option key={sector} value={sector}>
                            {sector}
                          </option>
                        ))}
                    </select>
                    {errors.sector && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.sector?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("cell")}
                    </label>
                    {/* <Input
                      placeholder={t("enter_cell")}
                      {...register("cell", {
                        required: t("cell_required"),
                      })}
                    /> */}
                    <select
                      {...register("cell")}
                      onChange={handleCellChange}
                      disabled={!selectedSector}
                      className="border border-gray-300 rounded-md p-2 w-full"
                    >
                      <option value="">Select Cell</option>
                      {selectedSector &&
                        Object.keys(
                          rwandaData[selectedProvince][selectedDistrict][
                            selectedSector
                          ] || {}
                        ).map((cell) => (
                          <option key={cell} value={cell}>
                            {cell}
                          </option>
                        ))}
                    </select>
                    {errors.cell && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.cell?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("village")}
                    </label>
                    {/* <Input
                      placeholder={t("enter_village")}
                      {...register("village", {
                        required: t("village_required"),
                      })}
                    /> */}
                    <select
                      {...register("village")}
                      disabled={!selectedCell}
                      className="border border-gray-300 rounded-md p-2 w-full"
                    >
                      <option value="">Select Village</option>
                      {selectedCell &&
                        rwandaData[selectedProvince][selectedDistrict][
                          selectedSector
                        ][selectedCell]?.map((village) => (
                          <option key={village} value={village}>
                            {village}
                          </option>
                        ))}
                    </select>
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
                        <p className="font-semibold">{t("full_name")}:</p>
                        <p>{getValues("names")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("dob")}:</p>
                        <p>{getValues("dob")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("gender")}:</p>
                        <p>{getValues("gender")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("marital_status")}:</p>
                        <p>{getValues("maritalStatus")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("phone")}:</p>
                        <p>{getValues("phone")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("email")}:</p>
                        <p>{getValues("email")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("national_id")}:</p>
                        <p>{getValues("nationalID")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("profession")}:</p>
                        <p>{getValues("profession")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("field_of_study")}:</p>
                        <p>{getValues("studied")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("church_cell")}:</p>
                        <p>{getValues("churchCell")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("province")}:</p>
                        <p>{getValues("province")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("district")}:</p>
                        <p>{getValues("district")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("sector")}:</p>
                        <p>{getValues("sector")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("cell")}:</p>
                        <p>{getValues("cell")}</p>
                      </div>
                      <div>
                        <p className="font-semibold">{t("village")}:</p>
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
                {t("back")}
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button onClick={handleNext}>{t("next")}</Button>
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
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  t("submit")
                )}
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
        {t("check_if_registered")}
      </Button>
      <div className="text-center mt-4 text-sm text-gray-600">
        {t("need_help")}{" "}
        <span className="font-semibold text-[#e5b77f]"> +250 789 152 190</span>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              <span className="text-green-500 text-center flex flex-col items-center gap-2">
                <CheckCircle className="w-16 h-16" />{" "}
                <span>{t("registration_successful")}</span>
              </span>
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-gray-500">
            {t("registration_submitted")}
          </p>
          <Button
            className="w-full"
            variant="default"
            onClick={() => router.push("/")}
          >
            {t("go_home")}
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
            {t("register_another")}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
