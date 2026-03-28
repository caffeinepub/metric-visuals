import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface EnquiryInput {
    serviceType: string;
    duration: string;
    name: string;
    email: string;
    message: string;
    phone: string;
    budgetRange: string;
    location: string;
    eventDate: string;
}
export interface Enquiry {
    id: EnquiryId;
    status: string;
    serviceType: string;
    duration: string;
    name: string;
    createdAt: bigint;
    email: string;
    message: string;
    phone: string;
    budgetRange: string;
    location: string;
    eventDate: string;
}
export interface UserProfile {
    name: string;
}
export type EnquiryId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteEnquiry(enquiryId: EnquiryId): Promise<void>;
    getAllEnquiries(): Promise<Array<Enquiry>>;
    getAndMarkEnquiryAsContacted(enquiryId: EnquiryId): Promise<Enquiry>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEnquiriesByStatus(status: string): Promise<Array<Enquiry>>;
    getEnquiry(enquiryId: EnquiryId): Promise<Enquiry>;
    getEnquiryCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasEnquiries(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitEnquiry(input: EnquiryInput): Promise<EnquiryId>;
    updateEnquiryStatus(enquiryId: EnquiryId, status: string): Promise<void>;
}
