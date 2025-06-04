export interface ConfigDataType {
    username: string;
    longitude: number;
    latitude: number;
    placeName: string;
};

export interface InstitutionType {
    id : string;
    institution_name : string;
    longitude : number;
    latitude : number;
    place_name : string;
}

export interface AccountType {
    id : string;
    isConfigured : boolean;
    auth_user_id : string;
    username : string;
    primary_location_longitude : number;
    primary_location_latitude : number;
    place_name : string;
};

export interface StatusType {
    floodHeight : string;
    rainIntensity : string;
    windSpeed : string;
};

// Define the type for the status data based on the provided structure
export interface StatusTableType {
    is_safe: string;
    flood_height: number;
    rain_intensity: number;
    wind_speed: number;
    modality: string;
    transportation: string;
    evacuation: string;
    readiness: string;
    datetime: string; // timestamptz represented as string
};

export interface UpdateStatusType {
    floodHeight : string | null;
    rainIntensity : string | null;
    windSpeed : string | null;
    modality : string | null;
    safety : string | null;
    transportation : string | null;
    evacuation : string | null;
    readiness : string | null;
}

export interface AnnouncementType {
    id: number;
    main_text: string;
    description: string | null;
    datetime: string | null;
    author_username: string | null;
    institution_id: string | null;
}