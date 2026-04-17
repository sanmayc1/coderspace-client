import type {
  IDomain,
  IExample,
  IInterviewData,
  IInterviewDataUser,
  IListContestState,
  IProblemListing,
  IReward,
  ISkill,
  TLanguages,
} from './types';

export interface ICommonResponse {
  success: boolean;
  message: string;
}

export interface ISuccessResponse<T> extends ICommonResponse {
  data: T;
}

export interface IErrorResponse extends ICommonResponse {
  errors?: any[];
}

export interface IGetCompanyResponse {
  companyName: string;
  gstin: string;
  email: string;
  profileUrl: string;
}

export interface IGetAllUsersResponse {
  page: number;
  totalPages: number;
  users: IUsersDetails[];
}

export interface IUsersDetails {
  username: string;
  email: string;
  level: number;
  badge: 'silver' | 'gold' | 'platinum';
  userId: string;
  accountId: string;
  blocked: boolean;
  profileUrl?: string;
}

export interface IGetUserResponse {
  id: string;
  name: string;
  username: string;
  xpCoin: number;
  currentLevel: number;
  currentBadge: string;
  accountId: string;
  about?: string;
  premiumActive: boolean;
  profileUrl: string;
  skills: any[];
  auth: string;
  followers: number;
  following: number;
  problemSolved: number;
}

export interface IGetAllDomains {
  domains: IDomain[];
}

export interface IGetAllSkills {
  skills: ISkill[];
}

export interface IGetAllProblemAdminListing {
  totalPages: number;
  currentPage: number;
  problems: IProblemListing[];
}

export interface IGetLanguageDetails {
  id: string;
  language: TLanguages;
  tmpCode: string;
  solution: string;
  fnName: string;
}

export interface IGetTestcase {
  id: string;
  input: string;
  output: string;
  example?: boolean;
}

export interface IGetProblem {
  title: string;
  description: string;
  difficulty: string;
  skills: ISkill[];
  premium: boolean;
  domain: string;
  constrain: string;
  examples: IExample[];
}

export interface IUserGetProblem {
  id: string;
  title: string;
  number: number;
  difficulty: string;
  skills: ISkill[];
  premium: boolean;
}

export interface IUserGetProblemsResponse {
  problems: IUserGetProblem[];
  totalPages: number;
  currentPage: number;
}

export interface ITemplateCodes {
  language: string;
  id: string;
  templateCode: string;
}

export interface IUserGetProblemDetailed {
  title: string;
  description: string;
  number: number;
  difficulty: string;
  skills: ISkill[];
  premium: boolean;
  domain: string;
  constrain: string;
  examples: IExample[];
  templateCodes: ITemplateCodes[];
  testcases: { input: string; output: string; expected: string; isCorrect?: boolean }[];
}

export interface IGetAllContest {
  contests: IListContestState[];
  currentPage: number;
  totalPages: number;
}

export interface IGetAllCodersResponse {
  userId: string;
  name: string;
  username: string;
  badge: string;
  profileUrl: string;
  isFollowing: boolean;
}

export interface IGetCoderResponse {
  userId: string;
  name: string;
  username: string;
  badge: string;
  level: number;
  following: number;
  followers: number;
  about?: string;
  joinDate: string;
  problemSolved: number;
  profileUrl: string;
  accountId: string;
  isFollowing: boolean;
}

export interface IGetProblemUpdatesResponse {
  status: string;
  solution: string;
  language: string;
}

export interface IRunProblemResponse {
  testcases: {
    input: string;
    output: string;
    expected: string;
    isCorrect: boolean;
  }[];
  success: boolean;
}

export interface IGetAllPlansResponse {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  duration: string;
}

export interface ICreateOrderResponse {
  orderId: string;
  amount: string;
  currency: string;
  name: string;
  email: string;
}

export interface IGetContestResponse {
  title: string;
  description: string;
  domain: string;
  skills: string[];
  problems: string[];
  rewards: IReward[];
  dateAndTime: string;
  duration: number;
  visibility: string;
}

export interface IGetAllContestUpcomingAndOngoingResponse {
  contests: IGetUserContestsResponse[];
  currentPage: number;
  totalPages: number;
}

export interface IGetUserContestsResponse {
  id: string;
  title: string;
  description: string;
  dateAndTime: string;
  domain: string;
  skills: ISkill[];
  duration: string;
  rewards: Omit<IReward, 'id'>[];
}

export interface IContestProblem extends IUserGetProblemDetailed {
  id: string;
}

export interface IGetContestProblemsResponse {
  problems: IContestProblem[];
  endDateAndTime: Date;
}

export interface ISubmitProblemResponse extends IRunProblemResponse {
  levelReached: number;
  badgeReached: string;
  xpCoinEarned: number;
}

export interface IContestSubmitProblemResponse extends IRunProblemResponse {}

export interface ILeaderboard {
  userId: string;
  username: string;
  contestName: string;
  totalProblems: number;
  name: string;
  profileUrl: string;
  badge: string;
  score: number;
  solvedProblems: number;
  totalSubmissions: number;
  timeTaken: number;
}

export interface IContestLeaderboardResponse {
  leaderboard: ILeaderboard[];
  currentPage: number;
  totalPages: number;
}

export interface IGetAllAvailableProblems {
  problems: { id: string; title: string }[];
}

export interface IGetAllChatsResponse {
  chatPartner: {
    id: string;
    name: string;
    profilePicture: string;
  };
  lastMessage: {
    content: string;
    timestamp: Date;
  };
  unreadCount: number;
}

export interface IGetChatMessagesResponse {
  chats: IGetChatMessages[];
  chatPartner: {
    id: string;
    name: string;
    profilePicture: string;
  };
}

export interface IGetChatMessages {
  id: string;
  message: string;
  timestamp: Date;
  seen: boolean;
  receiverId: string;
  senderId: string;
}

export interface IGetAllInterviewsResponse {
  interviews: IInterviewData[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export interface IGetAllUserInterviewsResponse {
  interviews: IInterviewDataUser[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export interface IGetInterviewQuestionResponse {
  question: string;
  audio: string;
  questionNumber: number;
}

type Month =
  | 'Jan'
  | 'Feb'
  | 'Mar'
  | 'Apr'
  | 'May'
  | 'Jun'
  | 'Jul'
  | 'Aug'
  | 'Sep'
  | 'Oct'
  | 'Nov'
  | 'Dec';

export interface ChartItem {
  name: Month;
  participants: number;
  submissions: number;
}

export interface QuickTab {
  totalContests: number;
  totalParticipants: number;
  activeContests: number;
  upcomingContests: number;
}

export interface DashboardDataResponse {
  quicktab: QuickTab;
  chart: ChartItem[];
}

export interface IGetAdminDashboardResponse {
  quicktab: {
    totalUsers: number;
    activeSubscriptions: number;
    totalProblems: number;
    totalInterviews: number;
  };
  monthlyGrowthData: { name: string; users: number; revenue: number }[];
}


export interface Notification {
  _id: string;
  accountId: string;
  message: string;
  title: string;
  type: "level_up" | "badge" | "system" | string; 
  isRead: boolean;
  createdAt: string; 
  updatedAt: string; 
}

export interface NotificationsDataResponse {
  notifications: Notification[];
  total: number;
}

