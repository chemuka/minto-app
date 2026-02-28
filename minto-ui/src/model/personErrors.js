export const personErrors = {
    person: () => ({
        firstName: "",
        middleName: "",
        lastName: "",
        dob: "",
        lifeStatus: "",
        notes: "",
        contact: { addresses: [], emails: [], phones: [] }
    }),

    spouse: () => ({ maritalStatus: "", person: { ...personErrors.person() }}),

    child: () => ({ childType: "", person: { ...personErrors.person() }}),

    parent: () => ({ parentType: "", person: { ...personErrors.person() }}),
    
    sibling: () => ({ siblingType: "", person: { ...personErrors.person() }}),
    
    referee: () => ({ membershipNumber: "", person: { ...personErrors.person() }}),
    
    relative: () => ({ membershipNumber: "", familyRelationship: "", person: { ...personErrors.person() }}),
    
    beneficiary: () => ({ percentage: "", relationship: "", person: { ...personErrors.person() }}),
}