import { Eye, EyeOff } from "lucide-react";
import type { ReactNode } from "react";
import { Fragment } from "react/jsx-runtime";

type InfoItem = {
    label: string
    value?: ReactNode
}

type PaymentInformation = {
    id: number;
    accountId: number;
    paymentMethod: 'visa' | 'mastercard' | 'amex' | 'bank_transfer';
    cardNumber: string;
    cardCvv: string;
    cardNumberLast4: string;
    nameOnCard: string;
    cardExpiryMonth: string;
    cardExpiryYear: string;
    paymentAuthorization: boolean;
    createdAt: string;
};

function InfoSection({ title, items }: { title: string, items: InfoItem[] }) {
    if (!items.length) return;
    return (
        <div className="flex flex-col gap-3">
            <h1 className="text-theme-green text-xl">{title}</h1>
            <div className="grid grid-cols-2 gap-2">
                {items.map(({ label, value }) => (
                    <Fragment key={label}>
                        <div className="text-muted-foreground">{label}</div>
                        <div>{value ?? "—"}</div>
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export const PaymentMethodLabel: Record<string, string> = {
    "visa": 'VISA',
    "mastercard": 'Master Card',
    "amex": 'American Express',
    "bank_transfer": 'E-Transfer'
};

import { useState } from "react";

function ToggleableCardNumber({ paymentInformation }: { paymentInformation: PaymentInformation }) {
    const [showFull, setShowFull] = useState(false);

    if (!paymentInformation) {
        return <span>—</span>;
    }

    const masked = `**** **** **** ${paymentInformation.cardNumberLast4 ?? "----"}`;
    const full = paymentInformation.cardNumber || masked; // fallback if full number isn't available

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>{showFull ? full : masked}</span>

            <button
                type="button"
                onClick={() => setShowFull(prev => !prev)}
                style={{ cursor: "pointer" }}
            >
                {showFull ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
        </div>
    );
}

function ToggleableCvv({ paymentInformation }: { paymentInformation: PaymentInformation }) {
    const [showFull, setShowFull] = useState(false);

    if (!paymentInformation) {
        return <span>—</span>;
    }

    const masked = `***`;
    const full = paymentInformation.cardCvv || masked; // fallback if full number isn't available

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>{showFull ? full : masked}</span>

            <button
                type="button"
                onClick={() => setShowFull(prev => !prev)}
                style={{ cursor: "pointer" }}
            >
                {showFull ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
        </div>
    );
}

function PaymentInformation({ paymentInformation }: { paymentInformation: PaymentInformation }) {

    const cardExpiryDisplay = paymentInformation
        ? `${paymentInformation.cardExpiryMonth}/${paymentInformation.cardExpiryYear?.slice(-2) ?? "--"}`
        : "—"

    return (
        <InfoSection
            title="Payment Information"
            items={
                paymentInformation?.paymentMethod === 'bank_transfer' ?
                    [
                        { label: "Payment Method", value: PaymentMethodLabel[paymentInformation?.paymentMethod] },
                    ]
                    :
                    [
                        { label: "Payment Method", value: PaymentMethodLabel[paymentInformation?.paymentMethod] },
                        { label: "Card Number", value: <ToggleableCardNumber paymentInformation={paymentInformation} /> },
                        { label: "Card Holder Name", value: paymentInformation?.nameOnCard },
                        { label: "Expiry Date", value: cardExpiryDisplay },
                        { label: "CVV", value: <ToggleableCvv paymentInformation={paymentInformation} /> },
                    ]}
        />
    )
}

export default PaymentInformation