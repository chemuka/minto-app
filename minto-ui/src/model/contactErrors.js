export const contactErrors = {
    address: () => ({ addressType: "", street: "", city: "", state: "", zipcode: "", country: "" }),

    email: () => ({ emailType: "", address: "" }),

    phone: () => ({ phoneType: "", countryCode: "", number: "" }),
}