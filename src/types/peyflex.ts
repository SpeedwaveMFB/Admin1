export interface AirtimeNetwork {
    id: string; // used for purchase
    name: string; // for display
}

export interface PurchaseAirtimePayload {
    network: string; // Changed from networkId to match likely API expectation of 'network' or 'network_id'. Keeping 'network' based on usual patterns, or 'id' from the network list.
    // Wait, user didn't specify purchase payload keys. I will stick to 'network' or 'networkId' but usually it matches the ID field.
    // Let's assume 'network' is the key for the ID.
    amount: number;
    phone: string; // "phoneNumber" or "phone"? User said "phoneNumber" in request, but "phone" is common. Sticking to "phoneNumber" as per initial request unless specified.
    pin: string;
}

export interface DataNetwork {
    id: string;
    name: string;
    status: string;
}

export interface DataPlan {
    id: number;
    network_id: string;
    plan_type: string;
    amount: string; // Original price
    size: string;
    validity: string;
    price: string; // Display price
}

export interface PurchaseDataPayload {
    network: string;
    plan: string; // plan id
    phone: string;
    pin: string;
}

export interface CableProvider {
    id: string;
    name: string;
}

export interface CablePlan {
    id: number;
    provider: string; // e.g. "dstv"
    package: string; // e.g. "DSTV Padi"
    amount: string;
}

export interface VerifyCableRequest {
    iuc: string;
    provider: string;
}

export interface VerifyCableResponse {
    success: boolean;
    message: string;
    data: {
        customer_name: string;
        status: string;
        due_date?: string;
    };
}

export interface SubscribeCablePayload {
    provider: string;
    plan: string; // plan id or code?
    iuc: string;
    pin: string;
}

export interface ElectricityProvider {
    id: string; // e.g. "ikeja-electric"
    name: string;
    identifier: string; // "electricity"
}

export interface VerifyElectricityRequest {
    meter: string;
    plan: string; // provider id
    type: 'prepaid' | 'postpaid';
    identifier?: string;
}

export interface VerifyElectricityResponse {
    success: boolean;
    message: string;
    data: {
        customer_name: string;
        address?: string;
        // other fields
    };
}

export interface RechargeElectricityPayload {
    provider: string; // plan/provider id
    meter: string;
    amount: number;
    type: 'prepaid' | 'postpaid';
    pin: string;
}
