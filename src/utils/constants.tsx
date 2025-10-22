import type { FieldConfig, ISectionProps } from "@/types/props.types";
import type { ISideBarItems } from "@/types/types";
import {
  Bell,
  BriefcaseBusiness,
  Code,
  CreditCard,
  Globe,
  LayoutDashboard,
  MessageSquare,
  MessageSquareText,
  Settings,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";

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
    name: "name",
    placeholder: "Name",
    type: "text",
  },
  {
    name: "username",
    placeholder: "Username",
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
    type: "password",
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

export const ResetPasswordFields: FieldConfig[] = [
  { name: "newPassword", placeholder: "New Password", type: "password" },
  {
    name: "confirmPassword",
    placeholder: "Confirm Password",
    type: "password",
  },
];

export const adminMenuItems: ISideBarItems[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    navigate: "/admin",
  },
  { icon: Users, label: "Manage Users", navigate: "/admin/manage-user" },
  {
    icon: BriefcaseBusiness,
    label: "Manage Business",
    navigate: "/admin/manage-business",
  },
  { icon: Code, label: "Manage Problems",navigate:"/admin/manage-problems" },
  { icon: Trophy, label: "Manage Contests" },
  { icon: Globe, label: "Manage Domains" },
  { icon: MessageSquare, label: "Manage Interviews" },
  { icon: UserCheck, label: "Community" },
  { icon: CreditCard, label: "Plans" },
  { icon: CreditCard, label: "Payment" },
  { icon: Settings, label: "Settings" },
];

export const companyMenuItems: ISideBarItems[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    navigate: "/company",
  },
  { icon: Trophy, label: "Manage Contests" },
  { icon: CreditCard, label: "Revenue" },
  { icon: Settings, label: "Settings" },
];

export const Badges = [
  { label: "Silver", value: "silver" },
  { label: "Gold", value: "gold" },
  { label: "Platinum", value: "platinum" },
];
