
export interface AccountInfo {
    createdAt: string;                 // ISO date string
    updatedAt: string;                 // ISO date string
    accountHolderName: string;
    accountHolderEmail: string;
    medicalDirectorName: string;
    medicalDirectorLicense: string;
    medicalDirectorEmail: string;
    authStatus: "Pending" | "Approved" | "Rejected";
    accountId: number
    isAccountActive: boolean | null,
    accountStatus: "active" | "inactive"
}

export type PaginationInfo = {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
};

export type IntakeSummary = {
    totalIntakes: number;
    completed: number;
    authPending: number;
};


export type PatientIntakesResponse = {
    accounts: AccountInfo[]
    statistics: IntakeSummary
    pagination: PaginationInfo
}

export type PreferredLocationType = "all" | 'leaside' | "downtown"
export type AuthStatusType = "all" | 'pending' | "completed"

export type QueryParams = {
    preferredLocation: PreferredLocationType,
    authStatus: AuthStatusType
    page?: number
    pageSize?: number
}

export type PatientResponse = {
    accounts: {
        id: number;
        holderName: string;
        designation: string;
        organizationName: string;
        contactPerson: string;
        phone: string;
        emailAddress: string;
        fax: string;
        documents: null | any;
        createdAt: string;
        updatedAt: string;
        preferredLocation: number;
        shippingSameAsBilling: boolean | null
    };
    acknowledgements: {
        id: number;
        accountId: number;
        nameToAcknowledge: string;
        acknowledgementConsent: boolean;
        consentDate: string;
    };
    delivery_settings: {
        id: number;
        accountId: number;
        instruction: string | null;
        deliveryHours: {
            Monday: string;
            Tuesday: string;
            Wednesday: string;
            Thursday: string;
            Friday: string;
        };
    };
    medical_directors: {
        id: number;
        accountId: number;
        isAlsoMedicalDirector: boolean;
        name: string;
        licenseNo: string;
        email: string;
    };
    payment_information: {
        id: number;
        accountId: number;
        paymentMethod: 'visa' | 'mastercard' | 'amex' | 'bank_transfer';
        cardNumberLast4: string;
        nameOnCard: string;
        cardExpiryMonth: string;
        cardExpiryYear: string;
        paymentAuthorization: boolean;
        createdAt: string;
    };
    applications: {
        id: number;
        accountId: number;
        referenceCode: string;
        expiryDate: string;
        isActive: boolean;
        isExpired: boolean;
        isSubmitted: boolean;
        submittedDate: string | null;
        prescriptionRequirement: "withPrescription" | "withoutPrescription" | null;
    };
    addresses: Array<{
        id: number;
        accountId: number;
        addressType: string;
        addressLine1: string;
        addressLine2: string;
        city: string;
        province: string;
        postalCode: string;
    }>;
};
