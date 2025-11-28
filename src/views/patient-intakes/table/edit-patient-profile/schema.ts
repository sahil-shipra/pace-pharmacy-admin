import z from "zod";

export const AccountSchema = z.object({
    id: z.number(),
    holderName: z.string().min(1, 'Holder name is required'),
    designation: z.string().min(1, 'Designation is required'),
    organizationName: z.string().min(1, 'Organization name is required'),
    contactPerson: z.string(),
    phone: z.string().min(1, 'Phone is required'),
    emailAddress: z
        .email('A valid Email Address is required')
        .min(1, 'Email Address is required'),
    fax: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    preferredLocation: z.number(),
    shippingSameAsBilling: z.boolean()
});

export const AddressSchema = z.object({
    addressLine1: z.string().min(1, 'Address line 1 is required'),
    addressLine2: z.string(),
    city: z.string().min(1, 'City is required'),
    province: z.string().min(1, 'Province is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
});

export const MedicalDirectorSchema = z.object({
    id: z.number(),
    accountId: z.number(),
    isAlsoMedicalDirector: z.boolean(),
    name: z.string().min(1, 'Name is required'),
    licenseNo: z.string(),
    email: z.string().optional().default(''),
}).refine(
    (data) => {
        if (data.isAlsoMedicalDirector === false) {
            return data.email && data.email.length > 0 && z.string().email().safeParse(data.email).success;
        }
        return true;
    },
    {
        message: 'Valid email is required',
        path: ['email'],
    }
);

export const updateRequestSchema = z.object({
    account: AccountSchema,
    billingAddress: AddressSchema,
    shippingAddress: AddressSchema,
    medical_directors: MedicalDirectorSchema,
});

// Type inference:
export type UpdateAccountData = z.infer<typeof updateRequestSchema>;