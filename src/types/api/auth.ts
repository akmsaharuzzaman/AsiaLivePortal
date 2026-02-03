export type TLoginBody = {
  username: string;
  password: string;
};
export type TResetPassword = {
  email: string;
  newPassword: string;
  confirmPassword: string;
};

export type TForgetPassword = {
  email: string;
};

export type TChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// RESPONSES TYPES

// export type TUser = {
//   activityZone: {
//     zone: string;
//   };
//   level: number;
//   whoCanTextMe: "all_users" | string;
//   _id: string;
//   email: string;
//   userStateInApp: "Offline" | "Online" | string;
//   userPermissions: string[];
//   country: string;
//   avatar: string;
//   name: string;
//   uid: string;
//   userRole: "user" | "admin" | string;
//   countryLanguages: string[];
//   isViewer: boolean;
//   createdAt: string; // ISO Date string
//   updatedAt: string; // ISO Date string
//   __v: number;
//   birthday: string; // ISO Date string
//   gender: "Male" | "Female" | "Other" | string;
//   highLevelRequirements: string[];
//   stats: {
//     coins: number;
//     diamonds: number;
//     level: number;
//     stars: number;
//     gifts: number[];
//   };
// };

export type TUser = {
  _id: string;
  email: string;
  phone:string;
  userStateInApp: string;
  userPermissions: string[];
  avatar: string;
  name: string;
  uid: string;
  userId: string;
  userRole: string;
  country?: string;
  countryLanguages: string[];
  isViewer: false;
  coins: number;
  verified: boolean;
  activityZone: {
    zone: string;
    expire?: string;
  };
  createdAt: string;
  updatedAt: string;
  birthday: string;
  gender: string;
  stats: {
    userId: string;
    stars?: number;
    coins?: number;
    diamonds?: number;
    levels?: number;
    gifts: [];
    createdAt: string;
    updatedAt: string;
  };
};

export type TCreatePortalRoleBody = {
  name: string;
  userId: string;
  password: string;
  designation: string;
  userRole: string;
  parentCreator?: string;
  userPermissions?: string[];
};

export type TWidrawRequest = {
  _id: string;
  name: string;
  hostId: {
    _id: string;
    avatar: string;
    name: string;
  };
  accountNumber: string;
  accountType: string;
  withdrawDate: string;
  day: number;
  time: number;
  audioHour: number;
  videoHour: number;
  country: string;
  totalDiamond: number;
  totalSalary: number;
  status: string;
  agencyId: {
    _id: string;
    name: string;
    userId: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type TTransactionAdminHistory = {
  _id: string;
  senderRole: string;
  senderId: string;
  receiverRole: string;
  receiverId: string;
  amount: number;
  expireAt: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
  receiver: TUser;
};
