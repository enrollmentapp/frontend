export enum FormType {
  ISD_DOWNEY_DATA_CENTER_REGISTRATION_LA_COUNTY_EMPLOYEES = 'ISD_DOWNEY_DATA_CENTER_REGISTRATION_LA_COUNTY_EMPLOYEES',
  ISD_DOWNEY_DATA_CENTER_REGISTRATION_CONTRACTORS_AND_AND_VENDORS = 'ISD_DOWNEY_DATA_CENTER_REGISTRATION_CONTRACTORS_AND_AND_VENDOR',
  ISD_INTERNET_REGISTRATION_FORM_PERMANENT_EMPLOYEES = 'ISD_INTERNET_REGISTRATION_FORM_PERMANENT_EMPLOYEES',
  ISD_INTERNET_REGISTRATION_FORM_CONTRACTORS_AND_VENDORS = 'ISD_INTERNET_REGISTRATION_FORM_CONTRACTORS_AND_VENDORS',
  ISD_ACTIVE_DIRECTORY_HOSTED_REGISTRATION_FORMS_PERMANENT_EMPLOYEES = 'ISD_ACTIVE_DIRECTORY_HOSTED_REGISTRATION_FORMS_PERMANENT_EMPLOYEES',
  ISD_ACTIVE_DIRECTORY_HOSTED_REGISTRATION_FORMS_CONTRACTOR_AND_VENDORS = 'ISD_ACTIVE_DIRECTORY_HOSTED_REGISTRATION_FORMS_CONTRACTOR_AND_VENDORS',
}

export enum FormUserType {
  EMPLOYEE = 'EMPLOYEE',
  CONTRACTOR = 'CONTRACTOR',
}

//TODO: Add an interface for Service Request

/**
 * A representation of the response from the server.
 */
export interface ServiceRequest {
  requestNumber: number;
}
