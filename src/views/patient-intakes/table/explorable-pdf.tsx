import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image
} from "@react-pdf/renderer";
import type { PatientResponse } from "../types";
import { format } from "date-fns";
import { ProvincesEnum, shownOrganizationType } from "./view-patient-profile";

const styles = StyleSheet.create({
    page: {
        padding: 24,
        fontSize: 10,
        fontFamily: "Helvetica",
    },
    logoRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    logo: {
        width: 278,
        // height: 70,
        // objectFit: "contain",
    },
    hr: {
        marginVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#E2E2E2",
    },
    labelRow: {
        flexDirection: "row",
        marginTop: 4,
        marginBottom: 4,
    },
    label: {
        width: 135,
        fontWeight: "bold",
    },
    text: {
        fontSize: 10,
        margin: '2px 0'
    },
    small: {
        fontSize: 9,
        color: "#444444",
    },
    listItem: {
        flexDirection: "row",
        marginBottom: 4,
    },
    listIndex: {
        width: 16,
    },
    checkboxRow: {
        flexDirection: "row",
        marginVertical: 6,
    },
    bold: {
        fontWeight: "bold",
    },
    footnote: {
        marginTop: 20,
        fontSize: 9,
        fontWeight: "bold",
    },
});

const ExportPDF = ({ data }: { data: PatientResponse }) => {

    const billingAddress = data?.addresses?.find(address => address.addressType?.toLowerCase() === "billing") ?? data?.addresses?.[0]
    const shippingAddress = data?.addresses?.find(address => address.addressType?.toLowerCase() === "shipping") ?? data?.addresses?.[1]

    const cardNumberDisplay = data?.payment_information
        ? `${data.payment_information.cardNumber ?? "----"}`
        : "—"

    const cardExpiryDisplay = data?.payment_information
        ? `${data.payment_information.cardExpiryMonth}/${data.payment_information.cardExpiryYear?.slice(-2) ?? "--"}`
        : "—"

    const deliveryHours = data?.delivery_settings?.deliveryHours;

    const deliveryEntries = Object.entries(
        typeof deliveryHours === "object" && deliveryHours !== null
            ? deliveryHours
            : {}
    ).filter(([_, value]) => value);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.logoRow}>
                    <Image src={'/logo.png'} style={styles.logo} />
                </View>

                <Text style={{ marginBottom: 10, fontWeight: "bold" }}>
                    New Professional Account Setup :
                </Text>

                {/* Fields */}
                <View style={{ ...styles.labelRow, justifyContent: 'space-between' }}>
                    <View style={{ ...styles.labelRow, width: "50%", marginBottom: 0 }}>
                        <Text style={styles.label}>Account Holder's Name :</Text>
                        <Text style={styles.text}>
                            {data.accounts.holderName}
                        </Text>
                    </View>

                    <View style={{ ...styles.labelRow, width: "50%", marginBottom: 0 }}>
                        <Text style={styles.label}>Designation/License :</Text>
                        <Text style={styles.text}>
                            {data.accounts.designation}
                        </Text>
                    </View>
                </View>
                <View style={styles.hr} />

                <View style={{ ...styles.labelRow, justifyContent: 'space-between' }}>
                    <View style={{ ...styles.labelRow, width: "50%", marginBottom: 0 }}>
                        <Text style={styles.label}>Clinic/Organization Name :</Text>
                        <Text style={styles.text}>
                            {data.accounts.organizationName}
                        </Text>
                    </View>

                    <View style={{ ...styles.labelRow, width: "50%", marginBottom: 0 }}>
                        <Text style={styles.label}>Clinic/Organization Type :</Text>
                        <Text style={styles.text}>
                            {shownOrganizationType(data.accounts.organizationType)}
                        </Text>
                    </View>
                </View>

                <View style={styles.hr} />

                <View style={styles.labelRow}>
                    <Text style={styles.label}>Contact Person :</Text>
                    <Text style={styles.text}>
                        {data.accounts.contactPerson || '—'}
                    </Text>
                </View>

                {data.accounts.contactPersonPhone ? (
                    <View style={styles.labelRow}>
                        <Text style={styles.label}>Contact Person Phone :</Text>
                        <Text style={styles.text}>{data.accounts.contactPersonPhone}</Text>
                    </View>
                ) : null}

                {data.accounts.contactPersonEmail ? (
                    <View style={styles.labelRow}>
                        <Text style={styles.label}>Contact Person Email :</Text>
                        <Text style={styles.text}>{data.accounts.contactPersonEmail}</Text>
                    </View>
                ) : null}

                <View style={styles.hr} />

                <View style={styles.labelRow}>
                    <Text style={styles.label}>Billing Address :</Text>
                    <View>
                        <Text style={styles.text}>
                            {billingAddress.addressLine1},
                            {billingAddress.addressLine2},
                        </Text>
                        <Text style={styles.text}>
                            City : {billingAddress.city}   Province : {ProvincesEnum[billingAddress.province as keyof typeof ProvincesEnum]}   Postal Code : {billingAddress.postalCode}
                        </Text>
                    </View>
                </View>
                <View style={styles.hr} />

                <View style={styles.labelRow}>
                    <Text style={styles.label}>Shipping Address :</Text>
                    <View>
                        <Text style={styles.text}>
                            {shippingAddress.addressLine1},
                            {shippingAddress.addressLine2},
                        </Text>
                        <Text style={styles.text}>
                            City : {shippingAddress.city}   Province : {ProvincesEnum[shippingAddress.province as keyof typeof ProvincesEnum]}   Postal Code : {shippingAddress.postalCode}
                        </Text>
                        <Text style={styles.text}>Ph : {data.accounts.phone}   Email : {data.accounts.emailAddress}</Text>
                    </View>
                </View>
                <View style={styles.hr} />

                <View style={{ ...styles.labelRow }}>
                    <Text style={styles.label}>Delivery Hours :</Text>
                    <View>
                        {deliveryEntries.map(([day, value]) => (
                            <Text
                                key={day}
                                style={{ ...styles.text, margin: "2px 0" }}
                            >
                                {day} : {value}
                            </Text>
                        ))}
                    </View>
                </View>

                <View style={styles.hr} />

                <View style={styles.labelRow}>
                    <Text style={styles.label}>Payment Information :</Text>
                    <View>
                        <Text style={{ ...styles.text, margin: "2px 0" }}>[{data.payment_information.paymentMethod === 'visa' && '*'}] Visa   [{data.payment_information.paymentMethod === 'mastercard' && '*'}] Master Card   [{data.payment_information.paymentMethod === 'bank_transfer' && '*'}] E-Transfer</Text>
                        {data.payment_information.paymentMethod !== 'bank_transfer' &&
                            <>
                                <Text style={{ ...styles.text, margin: "2px 0" }}>
                                    Card Number : {cardNumberDisplay}   Exp : {cardExpiryDisplay}   CVV : {data.payment_information ? data.payment_information.cardCvv : "—"}
                                </Text>
                                <Text style={{ ...styles.text, margin: "2px 0" }}>Name on Card : {data.payment_information.nameOnCard}</Text>
                            </>
                        }
                    </View>
                </View>

                <View style={styles.hr} />

                {/* Cardholder Acknowledgement */}
                <Text style={styles.text}>
                    <Text style={styles.bold}>I {data.acknowledgements?.cardholderName || data.accounts.holderName}</Text>, am financially responsible for all purchases made on this account. I will keep it current
                    and agree to maintain the account in good standing. I acknowledge that a late fee will apply to late payments, and a restocking fee to orders never picked up.
                </Text>
                <Text style={{ ...styles.text, marginTop: 6 }}>
                    I authorize Pace Pharmacy to process my account according to the terms above and confirm that I have read and understand all acknowledgements on{" "}
                    <Text style={styles.bold}>{format(new Date(data.accounts.createdAt), 'dd MMM yyyy')}</Text>.
                </Text>

                <View style={{ ...styles.hr, marginTop: 6 }} />

                {/* Account Holder Acknowledgement */}
                <Text style={{ ...styles.text, marginBottom: 6 }}>
                    <Text style={styles.bold}>I {data.acknowledgements?.accountHolderName || data.accounts.holderName}</Text>, acknowledge all of the following:
                </Text>

                {[
                    "All medications supplied to the above clinic/organization will be used within an established patient-healthcare professional relationship. An appropriately authorized healthcare professional will assess and document the clinical appropriateness of each medication for each patient before administering or dispensing.",
                    "Pace Pharmacy is a compounding pharmacy and is not a drug manufacturer. Compounded medications will only be supplied and used within an established and valid patient-healthcare professional relationship and will not be resold or distributed to third parties.",
                    "Pace Pharmacy is available to provide medication information and patient counselling services.",
                ].map((item, i) => (
                    <View key={i} style={styles.listItem} wrap={false}>
                        <Text style={styles.listIndex}>{i + 1}.</Text>
                        <Text style={styles.text}>{item}</Text>
                    </View>
                ))}

                <Text style={{ ...styles.text, marginTop: 6 }}>
                    I authorize Pace Pharmacy to process my account according to the terms above and confirm that I have read and understand all acknowledgements on{" "}
                    <Text style={styles.bold}>{format(new Date(data.accounts.createdAt), 'dd MMM yyyy')}</Text>.
                </Text>

                <View style={styles.hr} />

                <View break>
                    <View style={{ ...styles.labelRow, justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <View style={{ ...styles.labelRow, width: "50%", marginBottom: 0 }}>
                            <Text style={styles.label}>Medical Director's Name :</Text>
                            <Text style={styles.text}>
                                {data.medical_directors?.name}
                            </Text>
                        </View>

                        <View style={{ ...styles.labelRow, width: "50%", marginBottom: 0 }}>
                            <Text style={styles.label}>License :</Text>
                            <Text style={styles.text}>
                                {data.medical_directors?.licenseNo}
                            </Text>
                        </View>
                    </View>

                    {/* Medical Director Confirmations */}
                    <Text style={{ ...styles.text, marginBottom: 4, marginTop: 4 }}>
                        For medications ordered or prescribed under my medical direction, I confirm that:
                    </Text>

                    {[
                        "Individuals administering medications have been appropriately trained and assessed as competent to administer the medications provided.",
                        "Where an individual is not independently authorized to perform a controlled act, appropriate delegation and documentation are in place in accordance with applicable legislation and the requirements of my regulatory college.",
                        "Appropriate emergency training, procedures, equipment and supplies are in place for the medications and procedures being provided.",
                    ].map((item, i) => (
                        <View key={i} style={styles.listItem}>
                            <Text style={styles.listIndex}>{i + 1}.</Text>
                            <Text style={styles.text}>{item}</Text>
                        </View>
                    ))}

                    <View style={{ ...styles.hr, marginTop: 6 }} />

                    {/* Prescription Requirement */}
                    <View style={styles.checkboxRow}>
                        <Text style={styles.text}>[{(data.applications.prescriptionRequirement === 'withoutPrescription' || data.medical_directors.isAlsoMedicalDirector) ? '*' : ' '}]</Text>
                        <Text style={{ ...styles.text, marginLeft: 6 }}>
                            I authorize the following individuals —{' '}
                            <Text style={styles.bold}>{data.applications.authorizedIndividuals || '_______________'}</Text>
                            {' '}— to place orders under my name for{' '}
                            <Text style={styles.bold}>{data.accounts.organizationName}</Text>,{' '}
                            without a signed prescription for each order.
                        </Text>
                    </View>

                    <View style={styles.checkboxRow}>
                        <Text style={styles.text}>[{data.applications.prescriptionRequirement === 'withPrescription' ? '*' : ' '}]</Text>
                        <Text style={{ ...styles.text, marginLeft: 6 }}>I require a signed prescription for each order.</Text>
                    </View>

                    <Text style={styles.footnote}>
                        *Please Return Forms by Email or Fax. Only Completed Forms Will Be Accepted*
                    </Text>
                </View>
            </Page>
        </Document >
    )
};

export default ExportPDF;
