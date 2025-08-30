import type { FieldConfig, ISectionProps } from "@/types/props.types";
import { Bell, CircleUserRound, MessageSquareText } from "lucide-react";

export const navHeads = [
  { title: "Home", navigate: "" },
  { title: "Problems", navigate: "" },
  { title: "Contest", navigate: "" },
  { title: "Coders", navigate: "" },
  { title: "Discussion", navigate: "" },
  { title: "Interview", navigate: "" },
];

export const navIcons = [
  { icon: <Bell className="text-gray-600" size={24} />, navigate: "" },
  {
    icon: <MessageSquareText className="text-gray-500" size={24} />,
    navigate: "",
  },

  {
    icon: <CircleUserRound className="text-gray-500" size={24} />,
    navigate: "",
  },
];

export const sectionData: ISectionProps[] = [
  {
    head: "Think Code Solve",
    description:
      "Explore a wide range of coding problems designed to challenge and sharpen your skills. From beginner basics to advanced algorithm puzzles, CoderSpace has something for every coder.",
    bannerUrl: "thinkcodesolve.jpg",
    exploreUrl: "./",
    reverse: false,
  },
  {
    head: "Compete Learn Win.",
    description:
      "Put your skills to the test in real-time coding contests. Face off against other coders, climb the leaderboard, and sharpen your speed and accuracy under pressure.",
    exploreUrl: "/",
    bannerUrl: "competelearnwin.jpg",
    reverse: true,
  },
  {
    head: "Connect with Other Coders",
    description:
      "Explore a wide range of coding problems designed to challenge and sharpen your skills. From beginner basics to advanced algorithm puzzles, CoderSpace has something for every coder.",
    exploreUrl: "/",
    bannerUrl: "connectwithother.jpg",
    reverse: false,
  },
];

export const UserRegisterFormFields: FieldConfig[] = [
  {
    name: "username",
    placeholder: "Username",
    type: "text",
  },
  {
    name: "name",
    placeholder: "Name",
    type: "text",
  },
  {
    name: "email",
    placeholder: "Email",
    type: "text",
  },
  {
    name: "password",
    placeholder: "Password",
    type: "password",
  },
  {
    name: "confirmPassword",
    placeholder: "Confirm Password",
    type: "password",
  },
];

export const LoginFileds: FieldConfig[] = [
  {
    name: "email",
    placeholder: "Email",
    type: "text",
  },
  {
    name: "password",
    placeholder: "Password",
    type: "text",
  },
];

export const CompanyRegisterFields: FieldConfig[] = [
  {
    name: "companyName",
    placeholder: "Company Name",
    type: "text",
  },
  {
    name: "gstin",
    placeholder: "GSTIN",
    type: "text",
  },
  {
    name: "email",
    placeholder: "Email",
    type: "text",
  },
  {
    name: "password",
    placeholder: "Password",
    type: "password",
  },
  {
    name: "confirmPassword",
    placeholder: "Confirm Password",
    type: "password",
  },
];
