import { auth } from "@/lib/firebaseConfig";
import {
  ConfirmationResult,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  updateProfile,
} from "firebase/auth";
import { ensureUserProfile } from "./users";

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

  const result = await confirmationResult.confirm(otp);

  await ensureUserProfile(result.user);

  return result.user;
};

export const registerWithEmail = async (
  name: string,
  email: string,
  password: string,
) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(result.user, { displayName: name });
  await ensureUserProfile(result.user);

  return result.user;
};

export const loginWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);

  return result.user;
};
