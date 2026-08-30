import { auth } from "@/lib/firebaseConfig";
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber} from "firebase/auth";

let confirmationResult: ConfirmationResult | null = null;

export const sendOTP = async (phoneNumber: string) => {
  const receptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
  });

  confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    receptchaVerifier,
  );
};

export const verifyOtp = async (otp: string) => {
  if (!confirmationResult) {
    throw new Error("OTP was not requested");
  }

  const result = confirmationResult.confirm(otp);

  return (await result).user;
};
