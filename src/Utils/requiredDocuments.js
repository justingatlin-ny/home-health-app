const instructions = "Last three months starting in August 2019."

export default {
    people: ["pa", "ma"],
    categories: {
        citizenship: [
            "birth_certificate",
            "social_security_card"
        ],
        health: {
            "medicare_card": [ 'front', 'back' ],
            "prescription_card": [ 'front', 'back' ]
        },
        assets: {
            "checking_statement": { instructions },
            "savings_statement": { instructions },
            "vehicle_ownership_documents": {  },
            "life_insurance": { },
            "deeds": { }
        },
        income: [
            "2019_social_security_benefit_letter",
            "2019_pension_benefit_letter"
        ],
        estate_planning: [
            "last_will_and_testament",
            "long_term_care_insurance",
            "copies_of_power_of_attorney"
        ],
        medical_expences: [
            "proof_of_medical_expenses",
            "proof_of_shelter_expenses"
        ]
    }
}
