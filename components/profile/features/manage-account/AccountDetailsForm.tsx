"use client";

import {
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import AccountField from "./AccountField";

type Props = {
  name: string;
  setName: (value: string) => void;
  email: string;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
};

export default function AccountDetailsForm({
  name,
  setName,
  email,
  phoneNumber,
  setPhoneNumber,
}: Props) {
  return (
    <div className="space-y-6">
      <AccountField
        id="account-name"
        label="Full name"
        value={name}
        onChange={setName}
        icon={UserRound}
        placeholder="Your name"
      />

      <AccountField
        id="account-email"
        label="Email"
        value={email}
        icon={Mail}
        type="email"
        disabled
      />

      <AccountField
        id="account-phone"
        label="Phone number"
        value={phoneNumber}
        onChange={setPhoneNumber}
        icon={Phone}
        type="tel"
        placeholder="Your phone number"
      />
    </div>
  );
}