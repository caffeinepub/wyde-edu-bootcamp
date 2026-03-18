import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Registration {
    paymentScreenshot: string;
    referral: string;
    courseLevel: string;
    whatsapp: string;
    fullName: string;
    email: string;
    timestamp: string;
    college: string;
}
export interface backendInterface {
    getAllRegistrations(password: string): Promise<Array<Registration> | null>;
    getRegistrationCount(): Promise<bigint>;
    register(data: Registration): Promise<void>;
}
