// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth, db } from "@/firebaseConfig";
// import { ref, set } from "firebase/database";
// import { useAuth } from "@/hooks/useAuth";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { toast } from "@/components/ui/use-toast";
// import { useTranslation } from "react-i18next";

// interface FormData {
//   fullName: string;
//   email: string;
//   password: string;
//   familyID: string;
// }

// export default function AddUser() {
//   const { user } = useAuth();
//   const { t } = useTranslation();
//   const [loading, setLoading] = useState(false);
  
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<FormData>();

//   const handleAddUser = async (data: FormData) => {
//     setLoading(true);
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
//       const newUser = userCredential.user;

//       await set(ref(db, `users/${newUser.uid}`), {
//         fullName: data.fullName,
//         email: data.email,
//         familyID: data.familyID,
//         uid: newUser.uid,
//         isAdmin: false, // Default to non-admin
//       });

//       reset();
//       toast({ title: t("success"), description: t("user_registered"), variant: "success" });
//     } catch (error: any) {
//       toast({ title: t("error"), description: error.message, variant: "destructive" });
//     }
//     setLoading(false);
//   };

//   if (!user?.isAdmin) return <p className="text-red-500">{t("access_denied")}</p>;

//   return (
//     <Card className="max-w-md mx-auto mt-10">
//       <CardHeader>
//         <CardTitle>{t("add_new_user")}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit(handleAddUser)} className="space-y-4">
//           <div>
//             <Label>{t("full_name")}</Label>
//             <Input
//               placeholder={t("enter_full_name")}
//               {...register("fullName", { required: t("full_name_required") })}
//             />
//             {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
//           </div>
//           <div>
//             <Label>{t("email")}</Label>
//             <Input
//               type="email"
//               placeholder={t("enter_email")}
//               {...register("email", { required: t("email_required") })}
//             />
//             {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//           </div>
//           <div>
//             <Label>{t("password")}</Label>
//             <Input
//               type="password"
//               placeholder={t("enter_password")}
//               {...register("password", { required: t("password_required"), minLength: { value: 6, message: t("password_min_length") } })}
//             />
//             {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
//           </div>
//           <div>
//             <Label>{t("family_id")}</Label>
//             <Input
//               placeholder={t("enter_family_id")}
//               {...register("familyID", { required: t("family_id_required") })}
//             />
//             {errors.familyID && <p className="text-red-500 text-sm mt-1">{errors.familyID.message}</p>}
//           </div>
//           <Button type="submit" className="w-full" disabled={loading}>
//             {loading ? t("adding") : t("add_user")}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }
